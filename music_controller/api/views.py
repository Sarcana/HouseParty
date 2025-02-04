from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room

# APIView is used to override default methods like get and post
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class getRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = "code"

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)

        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data["is_host"] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response(
                {"Room Not Found: Invalid room code"}, status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {"Bad Request": "Code paramater not found in request"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get("guest_can_pause")
            votes_to_skip = serializer.data.get("votes_to_skip")
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)

            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                # Since a new room wasnt created and just the parameters were updates we are going to have to pass alist of params which say what all values were changed
                room.save(update_fields=["guest_can_pause", "votes_to_skip"])
                self.request.session["room_code"] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room.objects.create(
                    host=host,
                    guest_can_pause=guest_can_pause,
                    votes_to_skip=votes_to_skip,
                )
                self.request.session["room_code"] = room.code
                return Response(
                    RoomSerializer(room).data, status=status.HTTP_201_CREATED
                )

        return Response(
            {"Bad Request": "Invalid data..."}, status=status.HTTP_400_BAD_REQUEST
        )


# To join the room it is being called by RoomJoin.js
class JoinRoom(APIView):
    lookup_url_kwarg = "code"

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # in post request we can simply use .data
        code = request.data.get(self.lookup_url_kwarg)
        print(code)
        if code != None:
            room_result = Room.objects.filter(code=code)
            if room_result.exists():
                room = room_result[0]
                # Below line is usegful in the case when a person leaves the room and wants to rejoin without entering the code again
                # self.request.session['room_code'] = code
                return Response({"message": "Room Joined!"}, status=status.HTTP_200_OK)

            return Response(
                {"Bad Request": "Invalid Room Code"}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"Bad Request": "Invalid post data, did not find a code key"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class UserinRoom(APIView):

    def get(self, request, format="None"):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {"code": self.request.session.get("room_code")}

        return JsonResponse(data, status=status.HTTP_200_OK)


class LeaveRoom(APIView):

    def post(self, request, format="None"):
        if not self.request.session.exists(self.request.session.session_key):
            return Response(
                {"Bad Request": "Session already not active"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if "room_code" in self.request.session:
            self.request.session.pop("room_code")
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()
            return Response({"Message": "Success"}, status=status.HTTP_200_OK)
        return Response(
            {"Bad Request": "Room Code doesnt exist"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        print("Session check passed")

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            print("Serializer valid")

            guest_can_pause = serializer.data.get("guest_can_pause")
            votes_to_skip = serializer.data.get("votes_to_skip")
            code = serializer.data.get("code")
            # code='7WY0GY'
            print(
                f"Received data - guest_can_pause: {guest_can_pause}, votes_to_skip: {votes_to_skip}, code: {code}"
            )

            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                print("Room not found")
                return Response(
                    {"msg": "Room not found."}, status=status.HTTP_404_NOT_FOUND
                )

            room = queryset[0]
            user_id = self.request.session.session_key
            if room.host != user_id:
                print("User is not the host of the room")
                return Response(
                    {"msg": "You are not the host of this room."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=["guest_can_pause", "votes_to_skip"])
            print("Room updated successfully")
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
        else:
            print("Invalid data:", serializer.errors)

        return Response(
            {"Bad Request": "Invalid Data...", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


class DeleteRoom(APIView):
    lookup_url_kwarg = "code"

    def get(self, request, format=None):

        code = request.GET.get(self.lookup_url_kwarg)

        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                room.delete()
            return Response({"Message": "Success"}, status=status.HTTP_200_OK)
        return Response(
            {"Bad Request": "Room Code doesnt exist"},
            status=status.HTTP_400_BAD_REQUEST,
        )
