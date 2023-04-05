"use client";
import { useState, useEffect } from "react";
import { ColorRing } from "react-loader-spinner";

export default function Home() {
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [inferences, setInferences] = useState<any[]>([]);
  const [activeTooltip, setActiveTooltip] = useState<number>(-1);

  const generateImage = async () => {
    setLoading(true);
    // setGeneratedImage(prompt);

    if (prompt.length === 0) {
      setLoading(false);
      return;
    }

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const { data } = await response.json();
    console.log(data);

    if (data.error) {
      window.alert("Error: " + data.error + " " + data.message);
      setLoading(false);
      return;
    }

    // API returns an array of images.
    // As we just generate 1 image, then get the URI of the first image
    const uri = data.images[0].uri;
    setGeneratedImage(uri);
    setInferences([...inferences, data]);

    setLoading(false);
  };

  const fetchImages = async () => {
    setInferences([]);

    const response = await fetch("/api/showcase", {
      method: "GET",
    });

    const { data } = await response.json();
    if (data.error) {
      window.alert("Error: " + data.error + " " + data.message);
      return;
    }

    console.log(data); // <-- List all showcase of this model

    setInferences(data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const renderShowcase = () => {
    return (
      <section className="mt-16 max-w-full">
        <h1 className="text-xl font-semibold mb-5">Community showcase</h1>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {inferences ? (
            inferences
              .slice(0)
              .reverse()
              .map((i, index) => {
                const truncatedText = i.prompt
                  .split(" ")
                  .splice(0, 20)
                  .join(" ");
                const displayText =
                  i.prompt.length > truncatedText.length
                    ? `${truncatedText}...`
                    : truncatedText;

                return (
                  <div
                    key={index}
                    className="relative"
                    onMouseEnter={() => setActiveTooltip(index)}
                    onMouseLeave={() => setActiveTooltip(-1)}
                  >
                    <img
                      src={i.images[0] && i.images[0].uri}
                      className="object-cover w-full h-full rounded-md"
                    />
                    {activeTooltip === index && (
                      <div className="absolute backdrop-blur-sm bg-black/60 w-full text-white text-sm p-2 rounded-t-md z-10 bottom-0 left-0">
                        {displayText}
                      </div>
                    )}
                  </div>
                );
              })
          ) : (
            <div className="flex items-center justify-center text-md font-semibold text-gray-300">
              No images generated for this model yet.
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="bg-black mt-10 flex items-center justify-center">
      <main className=" max-w-xl mx-auto">
        <h1 className="text-white text-3xl font-bold mb-8">
          Generate your AI Image
        </h1>

        <section className="max-w-full">
          <div className="flex items-center">
            <input
              disabled={loading}
              type="text"
              id="prompt"
              name="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="rounded-l-lg py-3 px-4 w-full text-gray-300 focus:outline-none"
              placeholder="Enter your prompt here"
            />

            <button
              disabled={loading}
              onClick={generateImage}
              className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 rounded-r-lg py-3 px-4 ml-1 font-semibold"
            >
              Generate
            </button>
          </div>
        </section>

        <section className="mt-8 max-w-full">
          {loading && (
            <div className="flex items-center justify-center border-2 border-dashed border-gray-500 rounded-md w-full p-10">
              <div className="flex flex-col">
                <ColorRing
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={[
                    "#b8c480",
                    "#B2A3B5",
                    "#F4442E",
                    "#51E5FF",
                    "#429EA6",
                  ]}
                />
                <div className="mt-2 text-md font-semibold text-gray-300">
                  Generating...
                </div>
              </div>
            </div>
          )}

          {!loading && !generatedImage && (
            <div className="flex items-center justify-center border-2 border-dashed border-gray-500 rounded-md w-full p-10">
              <div className="text-md text-gray-600">
                Image will be generated here!
              </div>
            </div>
          )}

          {!loading && generatedImage && (
            <div className="flex items-center justify-center">
              <img
                src={generatedImage}
                alt="Generated Image"
                className="w-2/3 rounded-lg hover:scale-105 duration-300"
              />
            </div>
          )}
        </section>

        {renderShowcase()}
      </main>
    </div>
  );
}