import React, { useState } from 'react';

interface TextEditorProps {
  initialText: string;
  onTextChange: (text: string) => void;
  onGenerateAudio: (text: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({ 
  initialText, 
  onTextChange, 
  onGenerateAudio 
}) => {
  const [text, setText] = useState(initialText);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange(newText);
  };

  const handleGenerateAudio = async () => {
    setIsGenerating(true);
    // Simulate audio generation
    setTimeout(() => {
      onGenerateAudio(text);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Edit Your Text</h2>
          <p className="text-gray-600 mt-2">
            Review and edit the extracted text before converting to audio.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setText(initialText)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleGenerateAudio}
            disabled={!text.trim() || isGenerating}
            className={`
              px-6 py-2 rounded-lg font-medium transition-colors
              ${isGenerating || !text.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              } text-white
            `}
          >
            {isGenerating ? 'Generating...' : 'Generate Audio'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {text.length} characters
            </span>
            <span className="text-sm text-gray-500">
              Est. {Math.ceil(text.length / 200)} min audio
            </span>
          </div>
        </div>
        
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Your extracted text will appear here..."
          className="w-full h-96 p-6 text-base leading-relaxed border-none outline-none resize-none rounded-b-xl"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        />
      </div>

      {isGenerating && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-blue-700">Generating audio file... This may take a few minutes.</span>
        </div>
      )}
    </div>
  );
};