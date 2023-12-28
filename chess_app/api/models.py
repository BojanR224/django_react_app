from django.db import models
from api.storage import OverwriteStorage


# Create your models here.
class Chess(models.Model):
    #upload_to='chess_image', storage=OverwriteStorage()
    image = models.ImageField()

class Fen(models.Model):
    fen = models.CharField(max_length=100)