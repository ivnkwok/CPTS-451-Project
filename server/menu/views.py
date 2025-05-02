from rest_framework import generics, permissions
from .models import MenuItem
from .serializers import MenuItemSerializer

# NEW IMPORTS for the public stats view
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from users.models import Balance  # from users app

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

# === NEW PUBLIC STATS VIEW ===
@api_view(['GET'])
@permission_classes([AllowAny])
def public_stats_view(request):
    # Get all user balances
    balances = Balance.objects.select_related('user').values('user__username', 'amount')

    # Get all menu items and their times bought
    items = MenuItem.objects.values('name', 'times_bought')

    return Response({
        "balances": list(balances),
        "items": list(items)
    })
