from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MenuItemCreateView, MenuItemListView, MenuItemDeleteView, OrderViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('create/', MenuItemCreateView.as_view(), name='create_menu_item'),
    path('list/', MenuItemListView.as_view(), name='list_menu_items'),
    path('delete/<int:pk>/', MenuItemDeleteView.as_view(), name='delete_menu_item'),
    path('', include(router.urls)),
]
