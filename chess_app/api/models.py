from django.db import models

# Create your models here.
class Chess(models.Model):
    image = models.ImageField(upload_to='images/')

class Fen(models.Model):
    fen = models.CharField(max_length=100)