from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import ChessSerializer, FenSerializer
from .models import Chess, Fen
from rest_framework.views import APIView
from rest_framework.response import Response
from api.chess_notation import ImageToFen

# Create your views here.
class ChessView(generics.CreateAPIView):
    queryset = Chess.objects.all()
    serializer_class = ChessSerializer


class PostImageView(APIView):
    queryset = Chess.objects.all()
    serializer_class = ChessSerializer

    parser_classes = (MultiPartParser, FormParser)  # Allow image upload through form data

    def post(self, request, *args, **kwargs):
        serializer = ChessSerializer(data=request.data)

        if serializer.is_valid():
            serializer.validated_data['image'].name = 'chess_image.png' 
            serializer.save()

            fen = ImageToFen().get_fen()

            return Response(fen, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetBestPositions(APIView):
    queryset = Fen.objects.all()
    serializer_class = FenSerializer

    def post(self, request, *args, **kwargs):
        serializer = FenSerializer(data=request.data, many=True)
        
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)