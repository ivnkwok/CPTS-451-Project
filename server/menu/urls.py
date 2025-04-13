from django.urls import path
from .views import MenuItemCreateView, MenuItemListView, MenuDetailItemUpdateDeleteView

urlpatterns = [
    path('create/', MenuItemCreateView.as_view(), name='create_menu_item'),
    path('list/', MenuItemListView.as_view(), name='list_menu_items'),
    path('item/<int:pk>/', MenuDetailItemUpdateDeleteView.as_view(), name='update_menu_item'),
]