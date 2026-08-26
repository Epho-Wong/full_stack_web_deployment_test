from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
import os
from dotenv import load_dotenv
from .models import PgData
from django.core.cache import cache
import json

# Create your views here.

load_dotenv()

@api_view(['GET'])
def check_api_connection(request):
    my_secret=os.getenv('DJANGO_SECRET_KEY', 'default_key')
    return Response({
        "message":"check django api connection",
        "secret_from_env":my_secret
    })

@api_view(['GET'])
def get_pg_data(request):
    cache_key="django_pg_data_list"
    cached_data=cache.get(cache_key)
    if cached_data:
        return Response({"database":"postgresql", "source":"Redis_cache", "items":cached_data})

    if not PgData.objects.exists():
        PgData.objects.create(name="django pg item", description="data auto creation cause object doesn't exist")
    
    data = list(PgData.objects.values('name', 'description', 'created_at'))

    cache.set(cache_key, data, timeout=300)  #timeout 300s
    return Response({"database":"django_postgresql", "source":"database_direct", "items":data})