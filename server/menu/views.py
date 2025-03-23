from rest_framework import generics, permissions
from .models import MenuItem
from .serializers import MenuItemSerializer

class MenuItemCreateView(generics.CreateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.AllowAny]
