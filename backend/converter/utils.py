import os
from PIL import Image
from PyPDF2 import PdfReader
from pdf2image import convert_from_path
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def generate_pdf_thumbnails(pdf_path, document_id, max_pages=None):
    """
    Generate thumbnails from a PDF file and save them organized by document ID.
    Returns a list of thumbnail info dictionaries.
    """
    try:
        # Create directory structure: media/thumbnails/document_id/
        thumbnail_dir = os.path.join(settings.MEDIA_ROOT, 'thumbnails', str(document_id))
        os.makedirs(thumbnail_dir, exist_ok=True)
        
        # Convert PDF pages to images
        if max_pages:
            images = convert_from_path(pdf_path, dpi=150, first_page=1, last_page=max_pages)
        else:
            images = convert_from_path(pdf_path, dpi=150)
        
        thumbnails = []
        
        for i, image in enumerate(images):
            # Resize to thumbnail (200x280 to maintain aspect ratio)
            image.thumbnail((200, 280), Image.Resampling.LANCZOS)
            
            # Create a white background image for consistent sizing
            background = Image.new('RGB', (200, 280), 'white')
            
            # Calculate position to center the thumbnail
            x = (200 - image.width) // 2
            y = (280 - image.height) // 2
            
            # Paste the thumbnail onto the background
            background.paste(image, (x, y))
            
            # Save thumbnail
            thumb_filename = f"page_{i+1}.jpg"
            thumb_path = os.path.join(thumbnail_dir, thumb_filename)
            background.save(thumb_path, "JPEG", quality=85)
            
            # Store thumbnail info
            thumbnails.append({
                'page_number': i + 1,
                'filename': thumb_filename,
                'path': thumb_path,
                'url': f"{settings.MEDIA_URL}thumbnails/{document_id}/{thumb_filename}"
            })
        
        logger.info(f"Generated {len(thumbnails)} thumbnails for document {document_id}")
        return thumbnails
        
    except Exception as e:
        logger.error(f"Error generating thumbnails for document {document_id}: {e}")
        return []

def extract_pdf_text(pdf_path, excluded_pages=None):
    """
    Extract text from a PDF file, excluding specified pages.
    Returns the extracted text as a string.
    """
    try:
        if excluded_pages is None:
            excluded_pages = []
        
        # Convert to set of integers for faster lookup
        excluded_set = set(int(page) for page in excluded_pages)
        
        reader = PdfReader(pdf_path)
        extracted_text = ""
        
        for page_num, page in enumerate(reader.pages, 1):
            # Skip excluded pages
            if page_num not in excluded_set:
                try:
                    page_text = page.extract_text()
                    if page_text.strip():  # Only add non-empty text
                        extracted_text += f"\n--- Page {page_num} ---\n"
                        extracted_text += page_text
                        extracted_text += "\n"
                except Exception as e:
                    logger.warning(f"Could not extract text from page {page_num}: {e}")
                    continue
        
        logger.info(f"Extracted text from {len(reader.pages) - len(excluded_set)} pages")
        return extracted_text.strip()
        
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {e}")
        return ""

def get_pdf_page_count(pdf_path):
    """
    Get the total number of pages in a PDF file.
    """
    try:
        reader = PdfReader(pdf_path)
        return len(reader.pages)
    except Exception as e:
        logger.error(f"Error getting page count: {e}")
        return 0

def cleanup_thumbnails(document_id):
    """
    Clean up thumbnail files for a document.
    """
    try:
        thumbnail_dir = os.path.join(settings.MEDIA_ROOT, 'thumbnails', str(document_id))
        if os.path.exists(thumbnail_dir):
            import shutil
            shutil.rmtree(thumbnail_dir)
            logger.info(f"Cleaned up thumbnails for document {document_id}")
    except Exception as e:
        logger.error(f"Error cleaning up thumbnails for document {document_id}: {e}")