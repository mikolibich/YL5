"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
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
from django.urls import path, include  # Include used to import other apps' urls
from myapp import views 
from myapp.admin import ROSE_staff_portal
from django.views.generic import RedirectView

urlpatterns = [
    path('ROSE-staff-portal/', ROSE_staff_portal.urls),
    # browsers cache this redirect since permanent = True
    path('ROSE-staff-portal', RedirectView.as_view(url='ROSE-staff-portal/', permanent = True)), 

]

#    path('', include('myapp.urls')),
admin.site.index_title = "ROSE"
admin.site.site_header = "ROSE Admin"
admin.site.site_title = "ROSE Staff Login"
