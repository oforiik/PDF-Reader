// Simple homepage without Relume Button component for now
// import { Button } from "@relume_io/relume-ui";

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
  const handleGetStarted = () => {
    // This would navigate to sign up/login page
    console.log("Navigate to sign up/login");
  };

  const handleLearnMore = () => {
    // This would scroll to features section or navigate to about page
    console.log("Navigate to learn more section");
  };

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
      {/* If you want to use a background image instead, replace the above with: */}
      {/* <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('your-image-url-here')"}}> */}
      <Header1 
        heading="Transform PDFs into Audio Files"
        description="Convert your PDF documents into high-quality audio files for easy listening. Perfect for accessibility, multitasking, or learning on the go. Sign up to get started with your first conversion."
        buttons={customButtons}
        image={{
          src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
          alt: "PDF to Audio conversion illustration"
        }}
      />
      
      {/* Additional sections can be added here */}
      <section className="px-[5%] py-16 bg-white/80 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your account to access the PDF to audio converter</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Upload PDF</h3>
              <p className="text-gray-600">Upload your PDF document to our secure platform</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Listen</h3>
              <p className="text-gray-600">Download your audio file and listen anywhere</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;