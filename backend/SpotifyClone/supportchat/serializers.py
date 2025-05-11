from rest_framework import serializers
from .models import GlobalMessage

class GlobalMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalMessage
        fields = ["id", "sender", "content", "timestamp"]
