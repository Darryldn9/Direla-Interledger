import { Twilio } from "twilio";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";
import { ConversationInstance } from "twilio/lib/rest/conversations/v1/conversation";
import dotenv from "dotenv";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { LanguageCode, Message } from "./types";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { translate } from "./translate";
dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

const changeLanguageTool = async (phone: string, languageCode: string) => {
    const { error } = await supabase
        .from("users")
        .update({
            preferred_language: languageCode,
        })
        .eq("phone", phone);

    if(error) {
        return error.message;
    }
    
    const message = "Successfully changed your language!"
    return languageCode === "en" ? message : await translate(message, languageCode as LanguageCode);
}

class WhatsAppClient {
    private client: Twilio;
    private openAIClient: OpenAI;

    constructor(accountSid: string, authToken: string) {
        this.client = new Twilio(accountSid, authToken);
        this.openAIClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async sendMessage(message: string, to: string): Promise<MessageInstance> {
        if (!to || !message) {
            throw new Error("Recipient phone number and message are required");
        }
        
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("phone", to.replace("whatsapp:", ""))
            .single();
        
        if (error) {
            console.log(`Error retrieving user: ${error.message}`);
            throw new Error(error.message);
        }
        
        let language: string;

        switch (data?.preferred_language) {
            case "en":
                language = "English";
                break;
            case "zu":
                language = "Zulu";
                break;
            case "xh":
                language = "Xhosa";
                break;
            default:
                language = "English";
        }

        console.log(`Sending message to ${to} in ${language}`);

        return await this.client.messages.create({
            body: await translate(message, data?.preferred_language as LanguageCode),
            from: "whatsapp:+14155238886",
            to: `whatsapp:${to.replace("whatsapp:", "")}`,
        });
    }

    async respondToMessage(message: string, to: string) {//}: Promise<MessageInstance> {
        const messages = await this.getMessages(to);
        console.log(`Retrieved messages (first 3): ${JSON.stringify(messages.slice(0,3))}`);
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("phone", to.replace("whatsapp:", ""))
            .single();
        
            
            if (error) {
                throw new Error(error.message);
            }
            
            let language: string;

        switch (data?.preferred_language) {
            case "en":
                language = "English";
                break;
            case "zu":
                language = "Zulu";
                break;
            case "xh":
                language = "Xhosa";
                break;
            default:
                language = "English";
        }

        console.log(`Preferred language: ${language}`);

        const systemPrompt = `
        You are a helpful, friendly support assistant for Direla, a digital payments platform empowering South African informal retail.

        Core Purpose:
        Direla helps customers and spaza shops go cashless by enabling simple, low-cost digital payments and financial tools that are accessible to all.

        Customer Offering:

        Customers can use a digital wallet to store and spend money at local spaza shops.

        Payments can be made via WhatsApp, QR code scan, or NFC tap-to-pay (on supported devices).

        Customers may access community microlending, with small loans restricted for use at specific partner merchants.

        A customer's repayment history contributes to an informal credit record, helping build financial credibility.

        Merchant Offering:

        Merchants can turn any smartphone into a POS terminal to accept WhatsApp, QR, and NFC payments from customers.

        The system is designed to reduce cash risks, lower fees, and support simple digital sales tracking.

        Chatbot Guidelines:

        Always use clear, respectful, and simple language, tailored for South African informal market users.

        Emphasize convenience, safety, and affordability when explaining any feature.

        If users ask how to get started, guide them to download the Direla app or use the WhatsApp payment option.

        Reinforce that no complex banking setup is needed, and that transactions are handled securely through the Direla wallet.

        You are currently in a conversation with a user.
        You are to respond to the user's message based on the conversation history.
        Respond in: ${language} by default, or in the same language as the last message from the user.
        `;
        const response = await this.openAIClient.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                ...messages.map((message) => ({
                    role: message.from === "whatsapp:+14155238886" ? "user" : "assistant",
                    content: message.body,
                })),
                {
                    role: "user",
                    content: message,
                },
            ] as ChatCompletionMessageParam[],
            tools: [
                {
                    type: "function",
                    function: {
                        name: "changeLanguage",
                        description: "Change the language of the conversation",
                        parameters: {
                            type: "object",
                            properties: {
                                languageCode: { type: "string", description: "The language code to change to (en -> English, zu -> Zulu, xh -> Xhosa)" },
                            },
                        },
                    },
                },
            ]
        });

        if(response.choices[0].message.tool_calls) {
            const toolCall = response.choices[0].message.tool_calls[0];
            console.log(`Tool call: ${JSON.stringify(toolCall)}`);
            const toolArgs = JSON.parse(toolCall.function.arguments);
            const toolResult = await changeLanguageTool(data?.phone, toolArgs.languageCode);
            console.log(`Tool result: ${JSON.stringify(toolResult)}`);
            return await this.sendMessage(toolResult, data?.phone);
        }

        console.log(`Response: ${response.choices[0].message.content}`);

        const responseMessage = response.choices[0].message.content;

        if (!responseMessage) {
            throw new Error("No response message from OpenAI");
        }
        return await this.sendMessage(responseMessage, data?.phone);
    }

    async getMessages(to: string) : Promise<Message[]> {
        const messages = await this.client.messages.list({
            to: `whatsapp:${to}`,
            limit: 10,
        });
        
        return messages.map((message) => ({
            from: message.from,
            to: message.to,
            body: message.body,
            dateCreated: message.dateCreated,
        }));
    }
}

export default WhatsAppClient;