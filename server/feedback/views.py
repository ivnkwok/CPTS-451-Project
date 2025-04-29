from rest_framework import generics, permissions, status
from .models import Feedback
from .serializers import FeedbackSerializer
from .permissions import IsStaffOrAdmin
from rest_framework.response import Response
from django.utils import timezone

class FeedbackDetailView(generics.RetrieveDestroyAPIView):
    """
    GET:  (optional) retrieve a single feedback item
    DELETE: only staff/admin can delete
    """
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffOrAdmin]

    def perform_destroy(self, instance):
        instance.delete()

class FeedbackListCreateView(generics.ListCreateAPIView):
    """
    GET: Authenticated students see only their own feedback; 
         staff/admin see all.
    POST: Anyone can submit feedback.
    """
    serializer_class = FeedbackSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]
        # Anyone can create
        return [permissions.AllowAny()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and (user.is_staff or user.groups.filter(name='admin').exists()):
            return Feedback.objects.all().order_by('-created_at')
        return Feedback.objects.filter(user=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user if self.request.user.is_authenticated else None)

class FeedbackReplyView(generics.UpdateAPIView):
    """
    PATCH: Only staff/admin can add a response.
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
