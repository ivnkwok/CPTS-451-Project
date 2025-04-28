# server/users/views.py

from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import MenuItem 
from menu.models import MenuItem as MenuItemModel  # (You'll need this if your MenuItem is actually from menu app)
from .serializers import MenuItemSerializer
from users.models import Balance  # (Adjust if Balance is stored somewhere else)

class MenuItemCreateView(generics.CreateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.AllowAny]

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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def purchase_item(request):
    try:
        item_id = request.data.get('itemId')
        if not item_id:
            return Response({'error': 'Item ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        item = MenuItemModel.objects.get(id=item_id)
        balance = Balance.objects.get(user=request.user)

        if balance.amount < item.price:
            return Response({'error': 'Insufficient balance.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Subtract price and save
        balance.amount -= item.price
        balance.save()

        # Increment item's times_bought
        item.times_bought += 1
        item.save()

        return Response({'message': 'Purchase successful', 'new_balance': balance.amount}, status=status.HTTP_200_OK)

    except MenuItemModel.DoesNotExist:
        return Response({'error': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Balance.DoesNotExist:
        return Response({'error': 'Balance not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
