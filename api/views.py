from django.shortcuts import render
from rest_framework import generics, status
from .models import Room
from .serializers import RoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response


class RoomView(generics.ListAPIView):
    queryset = Room.objects
    serializer_class = RoomSerializer
