from rest_framework import serializers
from .models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model  = Feedback
        fields = ['id', 'user', 'title', 'description', 'response', 'created_at', 'responded_at']
        read_only_fields = ['user', 'created_at', 'responded_at']

    def get_user(self, obj):
        return obj.user.username if obj.user else 'Anonymous'