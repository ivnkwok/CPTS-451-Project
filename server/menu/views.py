from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied
from .models import MenuItem
from .serializers import MenuItemSerializer
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated]

<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
