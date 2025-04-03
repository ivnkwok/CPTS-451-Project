from django.shortcuts import render
from rest_framework import viewsets, status, generics, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied, ValidationError
from .models import MenuItem, Order, OrderItem
from .serializers import MenuItemSerializer, OrderSerializer, OrderItemSerializer

# Create your views here.

class MenuItemCreateView(generics.CreateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied("Only staff members can create menu items.")
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied("Only staff members can delete menu items.")
        
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response({"message": "Menu item deleted successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": "Failed to delete menu item", "details": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class MenuItemListView(generics.ListAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """
        Optionally filters the queryset by:
          - category
          - min_price, max_price
          - dietary (exact or partial match)
        """
        queryset = super().get_queryset()
        request = self.request
        category = request.query_params.get('category', None)
        min_price = request.query_params.get('min_price', None)
        max_price = request.query_params.get('max_price', None)
        dietary = request.query_params.get('dietary', None)

        # Filter by category (case-insensitive exact match)
        if category:
            queryset = queryset.filter(category__iexact=category)

        # Filter by min_price
        if min_price is not None:
            queryset = queryset.filter(price__gte=min_price)

        # Filter by max_price
        if max_price is not None:
            queryset = queryset.filter(price__lte=max_price)

        # Filter by dietary restriction (very basic substring search)
        if dietary:
            queryset = queryset.filter(dietary_restrictions__icontains=dietary)

        return queryset

class MenuItemDeleteView(generics.DestroyAPIView):
    queryset = MenuItem.objects.all()
    permission_classes = [permissions.IsAuthenticated]  # Only authenticated users can delete

    def delete(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response({"message": "Menu item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except MenuItem.DoesNotExist:
            return Response({"error": "Menu item not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(student=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            # Calculate total amount from items
            items_data = request.data.get('items', [])
            total_amount = sum(
                MenuItem.objects.get(id=item['menu_item']).price * item.get('quantity', 1)
                for item in items_data
            )

            # Check balance
            if total_amount > request.user.balance:
                return Response(
                    {
                        "error": "Insufficient balance",
                        "required_amount": total_amount,
                        "current_balance": request.user.balance
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create order
            order_data = {
                'student': request.user.id,
                'total_amount': total_amount,
                'status': 'pending',
                'notes': request.data.get('notes', '')
            }
            serializer = self.get_serializer(data=order_data)
            serializer.is_valid(raise_exception=True)
            order = serializer.save()

            # Create order items
            for item_data in items_data:
                OrderItem.objects.create(
                    order=order,
                    menu_item_id=item_data['menu_item'],
                    quantity=item_data.get('quantity', 1),
                    notes=item_data.get('notes', '')
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if not request.user.is_staff:
            raise PermissionDenied("Only staff members can update orders.")

        try:
            # Handle order status updates
            new_status = request.data.get('status')
            if new_status:
                if new_status == 'completed':
                    # Deduct amount from student's balance
                    instance.student.balance -= instance.total_amount
                    instance.student.save()
                elif new_status == 'declined':
                    # No balance deduction needed
                    pass
                instance.status = new_status
                instance.staff = request.user
                instance.save()

            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
