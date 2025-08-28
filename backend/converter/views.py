from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
import logging
import os
from django.conf import settings

from .models import PDFDocument, ProcessedDocument
from .serializers import (
    PDFDocumentSerializer, PDFUploadSerializer, PageSelectionSerializer,
    DocumentDetailSerializer, ProcessedDocumentSerializer
)
from .utils import generate_pdf_thumbnails, extract_pdf_text, get_pdf_page_count
from .tasks import generate_audio_task

logger = logging.getLogger(__name__)

class PDFDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = PDFDocumentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        return PDFDocument.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PDFUploadSerializer
        elif self.action == 'retrieve':
            return DocumentDetailSerializer
        elif self.action == 'update_page_selection':
            return PageSelectionSerializer
        return PDFDocumentSerializer
    
    def create(self, request, *args, **kwargs):
        """Upload a new PDF and start processing"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create the document
        pdf_document = serializer.save()
        
        try:
            # Get page count
            pdf_document.total_pages = get_pdf_page_count(pdf_document.original_file.path)
            pdf_document.processing_status = 'generating_thumbnails'
            pdf_document.save()
            
            # Generate thumbnails
            thumbnails = generate_pdf_thumbnails(
                pdf_document.original_file.path, 
                pdf_document.id
            )
            
            if thumbnails:
                pdf_document.thumbnails_generated = True
                pdf_document.processing_status = 'ready'
                pdf_document.save()
                logger.info(f"Successfully processed PDF {pdf_document.id}")
            else:
                pdf_document.processing_status = 'error'
                pdf_document.save()
                logger.error(f"Failed to generate thumbnails for PDF {pdf_document.id}")
                
        except Exception as e:
            pdf_document.processing_status = 'error'
            pdf_document.save()
            logger.error(f"Error processing PDF {pdf_document.id}: {e}")
        
        # Return the detailed document info
        response_serializer = DocumentDetailSerializer(pdf_document, context={'request': request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    def retrieve(self, request, *args, **kwargs):
        """Get detailed document info including thumbnails"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def update_page_selection(self, request, pk=None):
        """Update which pages are deleted"""
        pdf_document = self.get_object()
        serializer = PageSelectionSerializer(data=request.data)
        
        if serializer.is_valid():
            pages_deleted = serializer.validated_data['pages_deleted']
            
            # Validate page numbers are within range
            if pages_deleted:
                max_page = max(pages_deleted)
                if max_page > pdf_document.total_pages:
                    return Response(
                        {'error': f'Page {max_page} does not exist. Document has {pdf_document.total_pages} pages.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            pdf_document.pages_deleted = pages_deleted
            pdf_document.save()
            
            response_serializer = DocumentDetailSerializer(pdf_document, context={'request': request})
            return Response(response_serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def extract_text(self, request, pk=None):
        """Extract text from active pages"""
        pdf_document = self.get_object()
        
        try:
            # Extract text excluding deleted pages
            extracted_text = extract_pdf_text(
                pdf_document.original_file.path,
                excluded_pages=pdf_document.pages_deleted or []
            )
            
            # Create or update processed document
            processed_doc, created = ProcessedDocument.objects.get_or_create(
                pdf=pdf_document,
                defaults={'extracted_text': extracted_text}
            )
            
            if not created:
                processed_doc.extracted_text = extracted_text
                processed_doc.save()
            
            serializer = ProcessedDocumentSerializer(processed_doc, context={'request': request})
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(f"Error extracting text from PDF {pdf_document.id}: {e}")
            return Response(
                {'error': 'Failed to extract text from PDF'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        """Get processing status of a document"""
        pdf_document = self.get_object()
        return Response({
            'status': pdf_document.processing_status,
            'thumbnails_generated': pdf_document.thumbnails_generated,
            'total_pages': pdf_document.total_pages
        })

class ProcessedDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = ProcessedDocumentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ProcessedDocument.objects.filter(pdf__user=self.request.user)
    
    @action(detail=True, methods=['patch'])
    def update_text(self, request, pk=None):
        """Update the edited text"""
        processed_doc = self.get_object()
        edited_text = request.data.get('edited_text', '')
        
        processed_doc.edited_text = edited_text
        processed_doc.save()
        
        serializer = self.get_serializer(processed_doc)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def generate_audio(self, request, pk=None):
        """Generate audio from text"""
        processed_doc = self.get_object()
        
        # Use edited text if available, otherwise use extracted text
        text_to_convert = processed_doc.edited_text or processed_doc.extracted_text
        
        if not text_to_convert:
            return Response(
                {'error': 'No text available for audio generation'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Generate unique filename
            import time
            audio_filename = f"audio_{processed_doc.pdf.id}_{int(time.time())}.mp3"
            audio_path = os.path.join(settings.MEDIA_ROOT, 'audio', audio_filename)
            
            # Ensure audio directory exists
            os.makedirs(os.path.dirname(audio_path), exist_ok=True)
            
            # Start background task (if you have Celery set up)
            # generate_audio_task.delay(text_to_convert, audio_path)
            
            # For now, we'll just update status
            processed_doc.audio_status = 'processing'
            processed_doc.save()
            
            serializer = self.get_serializer(processed_doc)
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(f"Error generating audio for document {processed_doc.id}: {e}")
            return Response(
                {'error': 'Failed to generate audio'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Legacy function-based views for backward compatibility
@login_required
def upload_pdf(request):
    """Legacy view - redirect to use API instead"""
    return JsonResponse({'message': 'Use POST /api/converter/documents/ instead'}, status=410)

@login_required
def select_pages(request, file_id):
    """Legacy view - redirect to use API instead"""
    return JsonResponse({'message': f'Use GET /api/converter/documents/{file_id}/ instead'}, status=410)

@login_required
def edit_text(request, file_id):
    """Legacy view - redirect to use API instead"""
    return JsonResponse({'message': f'Use POST /api/converter/documents/{file_id}/extract_text/ instead'}, status=410)

@login_required
def generate_audio(request, file_id):
    """Legacy view - redirect to use API instead"""
    return JsonResponse({'message': 'Use ProcessedDocument API instead'}, status=410)

@login_required
def play_audio(request, audio_id):
    """Legacy view - redirect to use API instead"""
    return JsonResponse({'message': 'Use ProcessedDocument API instead'}, status=410)