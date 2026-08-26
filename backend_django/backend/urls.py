"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from api.views import check_api_connection, get_pg_data
from django.conf import settings
from django.http import HttpResponse
import os

def server_react_app(request):
    index_path=os.path.join(settings.STATIC_ROOT, 'index.html')
    try:
        with open(index_path, 'r', encoding='utf-8')as f:
            return HttpResponse(f.read())
    except FileNotFoundError:
        return HttpResponse("index.html not found")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/django/test/',check_api_connection, name='test_api'),
    path('api/django/db/',get_pg_data, name='get django postgresql db'),
    # re_path(r'^.*$', server_react_app)
]
