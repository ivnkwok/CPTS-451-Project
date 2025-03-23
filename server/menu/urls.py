from django.urls import path
from .views import MenuItemCreateView

urlpatterns = [
    path('create/', MenuItemCreateView.as_view(), name='create_menu_item'),
]
