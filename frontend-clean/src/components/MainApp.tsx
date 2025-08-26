// src/components/MainApp.tsx
import React, { useState } from 'react';
import { PDFUpload } from './PDFUpload';
import { PageGrid } from './PageGrid';
import { TextEditor } from './TextEditor';

export const MainApp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'pages' | 'text' | 'audio'>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [deletedPages, setDeletedPages] = useState<Set<number>>(new Set());
  const [extractedText, setExtractedText] = useState('');

  const handleUploadComplete = (file: File, pageList: string[]) => {
    setUploadedFile(file);
    setPages(pageList);
    setCurrentStep('pages');
  };

  const handleDeletePage = (pageIndex: number) => {
    const newDeleted = new Set(deletedPages);
    if (newDeleted.has(pageIndex)) {
      newDeleted.delete(pageIndex);
    } else {
      newDeleted.add(pageIndex);
    }
    setDeletedPages(newDeleted);
  };

  const handleContinueToText = () => {
    // Mock text extraction from remaining pages
    const remainingPages = pages.filter((_, index) => !deletedPages.has(index));
    const mockText = `This is extracted text from ${remainingPages.length} pages of your PDF document. 

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.

Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.`;
    
    setExtractedText(mockText);
    setCurrentStep('text');
  };

  const handleGenerateAudio = (text: string) => {
    console.log('Generating audio for text:', text.substring(0, 100) + '...');
    // In real app, this would trigger API call to generate audio
    setCurrentStep('audio');
  };

  const resetApp = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
    setPages([]);
    setDeletedPages(new Set());
    setExtractedText('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress indicator */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">PDF to Audio Converter</h1>
            <div className="flex items-center space-x-4">
              {(['upload', 'pages', 'text', 'audio'] as const).map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${currentStep === step
                        ? 'bg-blue-600 text-white'
                        : index < (['upload', 'pages', 'text', 'audio'] as const).indexOf(currentStep)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                      }
                    `}
                  >
                    {index + 1}
                  </div>
                  {index < 3 && (
                    <div
                      className={`
                        w-8 h-0.5 mx-2
                        ${index < (['upload', 'pages', 'text', 'audio'] as const).indexOf(currentStep)
                          ? 'bg-green-600'
                          : 'bg-gray-300'
                        }
                      `}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="py-8">
        {currentStep === 'upload' && (
          <PDFUpload onUploadComplete={handleUploadComplete} />
        )}
        
        {currentStep === 'pages' && (
          <PageGrid
            pages={pages}
            deletedPages={deletedPages}
            onDeletePage={handleDeletePage}
            onContinue={handleContinueToText}
          />
        )}
        
        {currentStep === 'text' && (
          <TextEditor
            initialText={extractedText}
            onTextChange={() => {}}
            onGenerateAudio={handleGenerateAudio}
          />
        )}
        
        {currentStep === 'audio' && (
          <div className="max-w-2xl mx-auto p-6 text-center">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">Audio Generated Successfully!</h2>
              <p className="text-gray-600 mb-6">Your PDF has been converted to audio. You can now download and listen to it.</p>
              
              {/* Mock audio player */}
              <div className="bg-gray-100 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 8h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <div className="flex-1">
                    <div className="bg-gray-300 rounded-full h-2 relative">
                      <div className="bg-blue-600 rounded-full h-2" style={{ width: '30%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>1:23</span>
                      <span>4:56</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Playing: {uploadedFile?.name || 'Your PDF Audio'}</p>
              </div>

              <div className="flex gap-3 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Download Audio
                </button>
                <button 
                  onClick={resetApp}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Convert Another PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};