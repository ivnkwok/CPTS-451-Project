from django.urls import path
from .views import MenuItemCreateView, MenuItemListView, purchase_item
from .views import BalanceDetailView, BalanceTopUpView, get_csrf_token

urlpatterns = [
    path('balance/', BalanceDetailView.as_view(), name='user-balance'),
    path('balance/top-up/', BalanceTopUpView.as_view(), name='balance-top-up'),
    path('csrf/', get_csrf_token, name='csrf-token'),
    path('menu/purchase/', purchase_item, name='menu-purchase'),
]
