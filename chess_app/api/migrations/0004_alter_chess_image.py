# Generated by Django 4.2.4 on 2023-09-06 13:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0003_alter_chess_image"),
    ]

    operations = [
        migrations.AlterField(
            model_name="chess",
            name="image",
            field=models.ImageField(upload_to="images/"),
        ),
    ]
