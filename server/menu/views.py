from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied
from .models import MenuItem
from .serializers import MenuItemSerializer

# Create your views here.

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
