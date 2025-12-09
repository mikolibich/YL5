"""
URL configuration for backend project.

"""

from django.urls import path, include  # Include used to import other apps' urls
from myapp import views 
from myapp.admin import ROSE_staff_portal
from django.views.generic import RedirectView
from rest_framework.urlpatterns import format_suffix_patterns
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf.urls.static import static
from myapp.views import CustomTokenObtainPairView, CreateUserView
from drf_spectacular.views import SpectacularAPIView


urlpatterns = [
    path('rose-staff-portal/', ROSE_staff_portal.urls), 
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/user/register/', CreateUserView.as_view(), name = 'register'),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")), # only needed in the gui version
    path("api/", include("myapp.urls")) # if the previous paths are not found go to myapps url paths
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

ROSE_staff_portal.index_title = "ROSE FOUNDATION"
ROSE_staff_portal.site_header = "ROSE Foundation Admin"
ROSE_staff_portal.site_title = "ROSE Foundation Staff Login"
ROSE_staff_portal.site_url = "/kv6014/rose-foundation"
