from django.db import models

class GlobalMessage(models.Model):
    sender = models.CharField(max_length=100, blank=True, null=True) 
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} - {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"
