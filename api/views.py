from cgitb import lookup
from logging import Logger
from os import stat
from turtle import update
from django.shortcuts import render
from rest_framework import generics, status
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response


class RoomView(generics.ListAPIView):
    serializer_class = RoomSerializer
    queryset = Room.objects


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        # temp print out request object?
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
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=[
                          'guest_can_pause', 'votes_to_skip', 'updated_at'])
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            # Else no room exists - create and save
            else:
                room = Room(guest_can_pause=guest_can_pause,
                            votes_to_skip=votes_to_skip, host=host)
                room.save()
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response('Could not create room.', status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code=code)
            # could this be replaced with the exists method like above?
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code'}, status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Room Code Param Not Found'}, status.HTTP_400_BAD_REQUEST)
