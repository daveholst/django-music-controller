from os import stat
from turtle import update
from django.shortcuts import render
from rest_framework import generics, status
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response


class RoomView(generics.ListAPIView):
    queryset = Room.objects
    serializer_class = RoomSerializer


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        # temp print out request object?
        print(request)
        # If no session exists create one
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            # Grab data from request
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            # Check if host already has an active room
            queryset = Room.objects.filter(host=host)
            # If room exists update with new data
            if queryset.exists():
                room = queryset[0]
                room.guests_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            # Else no room exists - create and save
            else:
                room = Room(guest_can_pause=guest_can_pause,
                            votes_to_skip=votes_to_skip, host=host)
                room.save()
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response('Could not create room.', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
