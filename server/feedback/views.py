from rest_framework import generics, permissions, status
from .models import Feedback
from .serializers import FeedbackSerializer
from .permissions import IsStaffOrAdmin
from rest_framework.response import Response
from django.utils import timezone

class FeedbackListCreateView(generics.ListCreateAPIView):
    queryset         = Feedback.objects.all().order_by('-created_at')
    serializer_class = FeedbackSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            # Only staff/admin can see all feedback
            return [permissions.IsAuthenticated(), IsStaffOrAdmin()]
        # Anyone (even anonymous) can POST
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        # Attach user if logged in, else leave “Anonymous”
        user = self.request.user if getattr(self.request, 'user', None) and self.request.user.is_authenticated else None
        serializer.save(user=user)

class FeedbackReplyView(generics.UpdateAPIView):
    """
    (Optional) allow staff to post a response.
    """
    queryset         = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffOrAdmin]
    
    def patch(self, request, *args, **kwargs):
        fb = self.get_object()
        fb.response     = request.data.get('response', fb.response)
        fb.responded_at = timezone.now()
        fb.save()
        return Response(self.get_serializer(fb).data, status=status.HTTP_200_OK)
