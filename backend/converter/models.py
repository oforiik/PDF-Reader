import uuid
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import FileExtensionValidator

class PDFDocument(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    original_file = models.FileField(
        upload_to='pdfs/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf'])]
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    total_pages = models.IntegerField(default=0)
    pages_deleted = models.JSONField(default=list)  # Store deleted page numbers as list of integers
    thumbnails_generated = models.BooleanField(default=False)
    processing_status = models.CharField(
        max_length=20,
        choices=[
            ('uploaded', 'Uploaded'),
            ('generating_thumbnails', 'Generating Thumbnails'),
            ('ready', 'Ready'),
            ('error', 'Error')
        ],
        default='uploaded'
    )
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"PDF Document {self.id} - {self.original_file.name}"
    
    @property
    def filename(self):
        return self.original_file.name.split('/')[-1] if self.original_file else None
    
    @property
    def active_pages(self):
        """Return list of page numbers that are not deleted"""
        if not self.pages_deleted:
            return list(range(1, self.total_pages + 1))
        return [page for page in range(1, self.total_pages + 1) if page not in self.pages_deleted]
    
    @property
    def deleted_pages_count(self):
        return len(self.pages_deleted) if self.pages_deleted else 0
    
    @property
    def active_pages_count(self):
        return self.total_pages - self.deleted_pages_count

class ProcessedDocument(models.Model):
    pdf = models.OneToOneField(PDFDocument, on_delete=models.CASCADE)
    extracted_text = models.TextField()
    edited_text = models.TextField(blank=True, null=True)  # Store user-edited text
    audio_file = models.FileField(upload_to='audio/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    audio_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('processing', 'Processing'),
            ('completed', 'Completed'),
            ('failed', 'Failed')
        ],
        default='pending'
    )
    
    def __str__(self):
        return f"Processed Document for {self.pdf.filename}"