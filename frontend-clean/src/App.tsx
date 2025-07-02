import { Header1 } from "@relume_io/relume-ui";

function App() {
  return (
    <div className="p-8">
      <Header1
        heading="PDF to Audio Converter"
        description="Test of Relume component"
        buttons={[]}
        image={{ src: "", alt: "" }}
      />
      <p className="text-lg mt-4">Tailwind is working if this text is large</p>
    </div>
  );
}

export default App;