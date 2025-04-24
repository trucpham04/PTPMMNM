from django.db import models
from user.models import User 

class Chat(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="chats")  
    message = models.TextField()  # Tin nhắn của người dùng
    response = models.TextField(null=True, blank=True)  # Phản hồi từ AI
    timestamp = models.DateTimeField(auto_now_add=True)  # Thời gian gửi tin nhắn
   

    def __str__(self):
        return f"Chat by {self.user.username if self.user else 'Anonymous'} at {self.timestamp}"

    class Meta:
        ordering = ['timestamp']