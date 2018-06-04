from django.shortcuts import render
from django.http.response import HttpResponse

from django.template import loader

# Create your views here.

def game_ui( request ):
    template = loader.get_template('index.html')
    return HttpResponse( template.render( {}, request ))
