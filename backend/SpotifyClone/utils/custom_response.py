from rest_framework.response import Response
from rest_framework import generics, permissions, status

def custom_response(ec=0, em="Success", dt=None):
    return Response({"EC": ec, "EM": em, "DT": dt}, status=status.HTTP_200_OK if ec == 0 else status.HTTP_400_BAD_REQUEST)
