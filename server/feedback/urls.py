from django.urls import path
from .views import FeedbackListCreateView, FeedbackReplyView

urlpatterns = [
    path('',   FeedbackListCreateView.as_view(), name='feedback-list-create'),
    path('<int:pk>/reply/', FeedbackReplyView.as_view(),    name='feedback-reply'),
]
