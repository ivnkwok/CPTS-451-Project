from django.urls import path
from .views import MenuItemCreateView, MenuItemListView

urlpatterns = [
    path('create/', MenuItemCreateView.as_view(), name='create_menu_item'),
    path('list/', MenuItemListView.as_view(), name='list_menu_items'),
]