import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.API_KEY_GEMINI;

const serviceTranslate = async (text: string): Promise<string | null> => {
  if (!geminiApiKey || !text) {
    return null;
  }

  const translate = new GoogleGenerativeAI(geminiApiKey);
  const modelo = translate.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const prompt = `Traduce este texto al español: ${text}`;
    const translatedContent = await modelo.generateContent(prompt);
    const translatedText = translatedContent.response.text();
    return translatedText.replace(/\n/g, "").replace(/ +(?=")$/, "");
  } catch (error) {
    console.log("Error translating text: ", error);
    return null;
  }
};

export { serviceTranslate };
