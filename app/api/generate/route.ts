import { Leap } from "@leap-ai/sdk";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return new Response("Hello, Next.js!");
}

export async function POST(request: Request) {
  const res = await request.json();
  const prompt = res.prompt;

  const apiKey = process.env.LEAP_API_KEY as string;

  if (!prompt || prompt.length === 0 || !apiKey) {
    return NextResponse.json(
      { error: "Invalid request. Check key and prompt." },
      { status: 400 }
    );
  }

  const MODEL_ID = "7575ea52-3d4f-400f-9ded-09f7b1b1a5b8"; // Model: OpenJourney v1
  const IMAGE_WIDTH = 512;
  const IMAGE_HEIGHT = 512;
  const NUMBER_OF_IMAGES = 1;

  const leap = new Leap(apiKey);
  const { data, error } = await leap.generate.generateImage({
    modelId: MODEL_ID,
    prompt: `${prompt} mdjrny-v4 style`,
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    numberOfImages: NUMBER_OF_IMAGES,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  console.log("YOUR PROMPT: ", prompt); // -> This will show in your Server Terminal

  return NextResponse.json({ data }, { status: 200 });
}