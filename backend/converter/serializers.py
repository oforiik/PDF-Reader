from rest_framework import serializers
from .models import PDFDocument, ProcessedDocument

class PDFDocumentSerializer(serializers.ModelSerializer):
    filename = serializers.ReadOnlyField()
    active_pages = serializers.ReadOnlyField()
    active_pages_count = serializers.ReadOnlyField()
    deleted_pages_count = serializers.ReadOnlyField()
    
    class Meta:
        model = PDFDocument
        fields = [
            'id', 'filename', 'uploaded_at', 'total_pages', 
            'pages_deleted', 'thumbnails_generated', 'processing_status',
            'active_pages', 'active_pages_count', 'deleted_pages_count'
        ]
        read_only_fields = ['id', 'uploaded_at', 'total_pages', 'thumbnails_generated', 'processing_status']

class PDFUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFDocument
        fields = ['original_file']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class PageSelectionSerializer(serializers.Serializer):
    pages_deleted = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        allow_empty=True,
        help_text="List of page numbers to delete (1-based)"
    )
    
    def validate_pages_deleted(self, value):
        # Remove duplicates and sort
        return sorted(list(set(value)))

class ThumbnailSerializer(serializers.Serializer):
    page_number = serializers.IntegerField()
    url = serializers.URLField()
    is_deleted = serializers.BooleanField()

class DocumentDetailSerializer(serializers.ModelSerializer):
    filename = serializers.ReadOnlyField()
    active_pages = serializers.ReadOnlyField()
    active_pages_count = serializers.ReadOnlyField()
    deleted_pages_count = serializers.ReadOnlyField()
    thumbnails = serializers.SerializerMethodField()
    
    class Meta:
        model = PDFDocument
        fields = [
            'id', 'filename', 'uploaded_at', 'total_pages', 
            'pages_deleted', 'thumbnails_generated', 'processing_status',
            'active_pages', 'active_pages_count', 'deleted_pages_count',
            'thumbnails'
        ]
    
    def get_thumbnails(self, obj):
        if not obj.thumbnails_generated:
            return []
        
        thumbnails = []
        for page_num in range(1, obj.total_pages + 1):
            thumbnail_url = f"{self.context['request'].build_absolute_uri('/media/')}thumbnails/{obj.id}/page_{page_num}.jpg"
            thumbnails.append({
                'page_number': page_num,
                'url': thumbnail_url,
                'is_deleted': page_num in (obj.pages_deleted or [])
            })
        
        return thumbnails

class ProcessedDocumentSerializer(serializers.ModelSerializer):
    pdf = PDFDocumentSerializer(read_only=True)
    
    class Meta:
        model = ProcessedDocument
        fields = ['id', 'pdf', 'extracted_text', 'edited_text', 'audio_file', 'created_at', 'audio_status']
        read_only_fields = ['id', 'created_at']