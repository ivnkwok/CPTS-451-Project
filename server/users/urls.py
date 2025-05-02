from django.urls import path
from .views import BalanceDetailView, BalanceTopUpView, get_csrf_token
from .views import purchase_item, list_users_view, delete_user_view

urlpatterns = [
    path('balance/', BalanceDetailView.as_view(), name='user-balance'),
    path('balance/top-up/', BalanceTopUpView.as_view(), name='balance-top-up'),
    path('csrf/', get_csrf_token, name='csrf-token'),
    path('menu/purchase/', purchase_item, name='menu-purchase'),
    path('list/', list_users_view, name='list-users'),
    path('<int:id>/delete/', delete_user_view, name='delete-user'),
]
