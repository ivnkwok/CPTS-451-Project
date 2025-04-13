from django.urls import path
from .views import StudentBalanceView, OwnBalanceView, UserProfileView

urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('balance/<str:student_id>/', StudentBalanceView.as_view(), name='student-balance'),
    path('balance/', OwnBalanceView.as_view(), name='own-balance'),
] 