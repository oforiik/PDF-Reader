import React, { useState } from 'react';

interface PageGridProps {
  pages: string[];
  deletedPages: Set<number>;
  onDeletePage: (pageIndex: number) => void;
  onContinue: () => void;
}

export const PageGrid: React.FC<PageGridProps> = ({ 
  pages, 
  deletedPages, 
  onDeletePage, 
  onContinue 
}) => {
  const [hoveredPage, setHoveredPage] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">Select Pages to Keep</h2>
          <p className="text-gray-600 mt-2">
            Hover over pages and click the X to remove them. 
            {pages.length - deletedPages.size} of {pages.length} pages selected.
          </p>
        </div>
        <button
          onClick={onContinue}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          disabled={deletedPages.size === pages.length}
        >
          Continue to Text Editor
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-h-[70vh] overflow-y-auto">
        {pages.map((page, index) => (
          <div
            key={index}
            className={`
              relative group aspect-[3/4] border-2 rounded-lg overflow-hidden transition-all
              ${deletedPages.has(index) 
                ? 'border-red-300 bg-red-50 opacity-50' 
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }
            `}
            onMouseEnter={() => setHoveredPage(index)}
            onMouseLeave={() => setHoveredPage(null)}
          >
            {/* Mock PDF page thumbnail */}
            <div className="w-full h-full bg-white flex items-center justify-center">
              <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-4">
                <div className="w-full h-1/3 bg-gray-300 rounded mb-2"></div>
                <div className="w-full h-1 bg-gray-300 rounded mb-1"></div>
                <div className="w-3/4 h-1 bg-gray-300 rounded mb-1"></div>
                <div className="w-full h-1 bg-gray-300 rounded mb-1"></div>
                <div className="w-2/3 h-1 bg-gray-300 rounded"></div>
              </div>
            </div>

            {/* Page number */}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {index + 1}
            </div>

            {/* Delete button */}
            {(hoveredPage === index || deletedPages.has(index)) && (
              <button
                onClick={() => onDeletePage(index)}
                className={`
                  absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors
                  ${deletedPages.has(index)
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                  }
                `}
                title={deletedPages.has(index) ? 'Restore page' : 'Delete page'}
              >
                {deletedPages.has(index) ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            )}

            {/* Deleted overlay */}
            {deletedPages.has(index) && (
              <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                <span className="text-red-700 font-bold text-lg">DELETED</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};