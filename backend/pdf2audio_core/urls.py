from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# API routes
router = DefaultRouter()
router.register(r'documents', views.PDFDocumentViewSet, basename='pdfdocument')
router.register(r'processed', views.ProcessedDocumentViewSet, basename='processeddocument')

urlpatterns = [
    # API routes
    path('api/', include(router.urls)),
    
    # Legacy routes (deprecated - return helpful messages)
    path('upload/', views.upload_pdf, name='upload'),
    path('select/<uuid:file_id>/', views.select_pages, name='select_pages'),
    path('edit/<uuid:file_id>/', views.edit_text, name='edit_text'),
    path('generate/<uuid:file_id>/', views.generate_audio, name='generate_audio'),
    path('play/<uuid:audio_id>/', views.play_audio, name='play_audio'),
]