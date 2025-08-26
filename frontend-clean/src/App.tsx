// src/App.tsx
import React, { useState } from 'react';

// Import the components (you'll need to create separate files for these)
import { MainApp } from './components/MainApp';

type ImageProps = {
  src: string;
  alt?: string;
};

type CustomButtonProps = {
  title: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
};

type Props = {
  heading: string;
  description: string;
  buttons: CustomButtonProps[];
  image: ImageProps;
};

export type Header1Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header1 = (props: Header1Props) => {
  const { heading, description, buttons, image } = {
    ...Header1Defaults,
    ...props,
  };
  
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-x-20 gap-y-12 md:gap-y-16 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="mb-5 text-4xl font-bold md:mb-6 md:text-6xl lg:text-7xl text-gray-900">{heading}</h1>
            <p className="text-lg md:text-xl text-gray-600">{description}</p>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              {buttons.map((button, index) => (
                <button
                  key={index}
                  onClick={button.onClick}
                  className={`px-6 py-3 font-medium rounded-lg transition-colors ${
                    button.variant === "primary"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border border-gray-300 hover:border-gray-400 text-gray-700 bg-white hover:bg-gray-50"
                  }`}
                >
                  {button.title}
                </button>
              ))}
            </div>
          </div>
          <div>
            <img src={image.src} className="w-full object-cover rounded-lg" alt={image.alt} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Header1Defaults: Props = {
  heading: "Transform PDFs into Audio Files",
  description:
    "Convert your PDF documents into high-quality audio files for easy listening. Perfect for accessibility, multitasking, or learning on the go. Sign up to get started with your first conversion.",
  buttons: [
    { title: "Get Started", variant: "primary" }, 
    { title: "Learn More", variant: "secondary" }
  ],
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "PDF to Audio conversion illustration",
  },
};

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleGetStarted = () => {
    // Skip authentication for now - go directly to app
    setIsAuthenticated(true);
    setCurrentView('app');
  };

  const handleLearnMore = () => {
    // Scroll to features section or show more info
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignIn = () => {
    // Skip authentication for now - go directly to app
    setIsAuthenticated(true);
    setCurrentView('app');
  };

  const handleSignUp = () => {
    // Skip authentication for now - go directly to app
    setIsAuthenticated(true);
    setCurrentView('app');
  };

  // If user is in the app, show the main application
  if (currentView === 'app') {
    return <MainApp />;
  }

  // Otherwise show the landing page
  const customButtons = [
    { 
      title: "Get Started", 
      variant: "primary" as const,
      onClick: handleGetStarted
    },
    { 
      title: "Learn More", 
      variant: "secondary" as const,
      onClick: handleLearnMore
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold text-gray-900">PDF2Audio</span>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSignIn}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={handleSignUp}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Header1 
        heading="Transform PDFs into Audio Files"
        description="Convert your PDF documents into high-quality audio files for easy listening. Perfect for accessibility, multitasking, or learning on the go. Sign up to get started with your first conversion."
        buttons={customButtons}
        image={{
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
          alt: "PDF to Audio conversion illustration"
        }}
      />
      
      {/* Features section */}
      <section id="features" className="px-[5%] py-16 bg-white/80 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Upload PDF</h3>
              <p className="text-gray-600">Upload your PDF document to our secure platform</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Select Pages</h3>
              <p className="text-gray-600">Choose which pages to include in your audio file</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Edit Text</h3>
              <p className="text-gray-600">Review and edit the extracted text before conversion</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">4</span>
              </div>
              <h3 className="font-semibold mb-2">Listen</h3>
              <p className="text-gray-600">Download your audio file and listen anywhere</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features highlight */}
      <section className="px-[5%] py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Why Choose PDF2Audio?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div className="p-6">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Secure & Private</h3>
              <p className="text-blue-100">Your documents are processed securely and deleted after conversion</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Fast Processing</h3>
              <p className="text-blue-100">Advanced algorithms ensure quick and accurate text extraction</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12 5.5L9 19z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">High Quality Audio</h3>
              <p className="text-blue-100">Crystal clear voice synthesis with natural pronunciation</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-[5%] py-16 bg-white">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of users who have already converted their PDFs to audio. 
            It's free to try with your first document.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors"
          >
            Start Converting Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">PDF2Audio</h3>
            <p className="text-gray-400">Converting documents to audio, making content accessible for everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;