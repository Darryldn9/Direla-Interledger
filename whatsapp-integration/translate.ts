import { LanguageCode } from "./types";
import Translate from "@google-cloud/translate";

const translationClient = new Translate.v2.Translate({
    keyFilename: "./direla-gcloud-d7a480dcf02b.json",
});

export async function translate(message: string, language: LanguageCode): Promise<string> {
    const translations = await translationClient.translate(message, language);
    return translations[0];
}