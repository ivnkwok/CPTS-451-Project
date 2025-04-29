from rest_framework import generics, permissions
from .models import MenuItem
from .serializers import MenuItemSerializer

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

