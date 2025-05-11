from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import GlobalMessage
from .serializers import GlobalMessageSerializer

@api_view(["GET"])
def global_chat_history(request):
    try:
        messages = GlobalMessage.objects.order_by("timestamp")[:100]
        
        if not messages:
            return Response([], status=200)

        serializer = GlobalMessageSerializer(messages, many=True)

        return Response(serializer.data, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
