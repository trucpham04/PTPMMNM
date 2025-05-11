import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from supportchat.models import GlobalMessage

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = "public_chat"
        self.room_group_name = f"chat_{self.room_name}"

        # Add the channel to the group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        logger.info(f"User connected to {self.room_group_name} with channel {self.channel_name}")

    async def disconnect(self, close_code):
        # Remove the channel from the group when disconnected
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        logger.info(f"User disconnected with code {close_code} from group {self.room_group_name}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        content = data.get("content")
        username = data.get("username")
        sender = data.get("sender")  # Lấy sender từ FE
        
        # Lưu tin nhắn trực tiếp với sender
        await self.save_message(sender, content)

        # Send the received content to the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "content": content,
                "username": username,
                "sender": sender,  # Thêm sender vào
            }
        )

    async def chat_message(self, event):
        # Send the content to WebSocket
        await self.send(text_data=json.dumps({
            "content": event["content"],
            "username": event["username"],
            "sender": event["sender"],  # Thêm sender vào
        }))

    @database_sync_to_async
    def save_message(self, sender, content):
        try:
            # Lưu tin nhắn vào model GlobalMessage, chỉ lưu sender dưới dạng chuỗi
            GlobalMessage.objects.create(sender=sender, content=content)
            logger.info(f"Saved content from {sender}: {content}")
        except Exception as e:
            logger.error(f"Error saving content: {e}")
