from django.urls import include, path

from ui.views import *

urlpatterns = [
    path('.', game_ui ),
]