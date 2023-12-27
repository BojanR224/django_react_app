from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import ChessSerializer, FenSerializer
from .models import Chess, Fen
from rest_framework.views import APIView
from rest_framework.response import Response
# from api.chess_recognition import ImageToFen
import math
from django.conf import settings
from .cornerDetection import CornerDetection

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
        stockfish = settings.STOCKFISH_ENGINE

        if serializer.is_valid():
            serializer.validated_data['image'].name = 'chess_image.png' 
            serializer.save()
            
            # image = serializer.data['image']
            # print(type(image))
            detection = CornerDetection()
            fen_string = detection.main()

            # fen = ImageToFen().get_fen()
            print(fen_string)
            if stockfish.is_fen_valid(fen_string):

                return Response({'fen': fen_string}, status=status.HTTP_201_CREATED)
            
            return Response({'fen': 'rnbqkb1r/ppp1ppp1/5n1p/1B1p4/4P3/1P3N2/P1PP1PPP/RNBQK2R b KQkq - 1 4'}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetBestPositions(APIView):
    queryset = Fen.objects.all()
    serializer_class = FenSerializer

    def post(self, request, *args, **kwargs):
        serializer = FenSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()

            fen = serializer.validated_data['fen']
            
            stockfish = settings.STOCKFISH_ENGINE

            if stockfish.is_fen_valid(fen):
                
                stockfish.set_fen_position(fen)
                top_3_moves = stockfish.get_top_moves(3)
                centipawns = stockfish.get_evaluation()['value']
                win_percentage = round(50 + 50 * (2 / (1 + math.exp(-0.00368208 * centipawns)) - 1),2)
                response = {'win_percentage': win_percentage, 'top_3_moves': top_3_moves}

                return Response(response, status=status.HTTP_200_OK)

            return Response("Invalid FEN string", status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)