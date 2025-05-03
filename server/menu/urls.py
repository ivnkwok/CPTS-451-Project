from django.urls import path
from .views import MenuItemCreateView, MenuItemListView, UpdateMenuItem, public_stats_view, MenuItemDestroyView

urlpatterns = [
    path('create/', MenuItemCreateView.as_view(), name='create_menu_item'),
    path('list/', MenuItemListView.as_view(), name='list_menu_items'),
    path('<int:id>/update/', UpdateMenuItem, name='update-menu-item'),
    path('stats/', public_stats_view, name='public-stats'),
    path('<int:pk>/', MenuItemDestroyView.as_view(), name='menuitem-detail-delete'),
]