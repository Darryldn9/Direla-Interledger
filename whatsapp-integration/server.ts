import express from "express";
import WhatsAppClient from "./whatsapp";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { LanguageCode } from "./types";
import { createClient } from "@supabase/supabase-js";
import MessagingResponse from "twilio/lib/twiml/MessagingResponse";
import bodyParser from "body-parser";
import { translate } from "./translate";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    origin: "*",
    methods: ["POST", "GET","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

const whatsappClient = new WhatsAppClient(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
);

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WhatsApp Integration API",
      version: "1.0.0",
      description: "API documentation for WhatsApp Integration",
    },
  },
  apis: ["./server.ts"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /:
 *   get:
 *     summary: Welcome endpoint
 *     responses:
 *       200:
 *         description: Returns a welcome message.
 */

app.get("/", (req, res) => {
    console.log(`ping from ${req.headers.origin} ${req.ip}`); 
    res.send("Hello World");
});

/**
 * @openapi
 * /send:
 *   post:
 *     summary: Send a message via WhatsApp
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The message to be sent.
 *               to:
 *                 type: string
 *                 description: The recipient's phone number in E.164 format.
 *     responses:
 *       200:
 *         description: Message sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sid:
 *                   type: string
 *                   description: The unique identifier for the sent message.
 *                 status:
 *                   type: string
 *                   description: The status of the sent message.
 *       400:
 *         description: Bad request, invalid input.
 *       500:
 *         description: Internal server error.
 */

app.post("/send", async (req, res) => {
    const { message, to } = req.body;
    const messageInstance = await whatsappClient.sendMessage(message, to);

    res.send(messageInstance);
});

/**
 * @openapi
 * /otp:
 *   post:
 *     summary: Send an OTP via WhatsApp
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: The recipient's phone number in E.164 format.
 *               otp:
 *                 type: string
 *                 description: The OTP to be sent.
 *               amount:
 *                 type: string
 *                 description: The amount of the transaction, prefixed with currency code.
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sid:
 *                   type: string
 *                   description: The unique identifier for the sent message.
 *                 status:
 *                   type: string
 *                   description: The status of the sent message.
 */
app.post("/otp", async (req, res) => {
    const { paymentTo, paymentFrom, otp, amount } = req.body;
    console.log(paymentTo, paymentFrom, otp, amount);
    
    // Use paymentFrom because they are receiving the OTP
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("phone", paymentFrom)
        .single();

    if (error) {
        res.status(500).send(error);
    }

    if (!data) {
        res.status(404).send("User not found");
    }
    
    const preferredLanguage: LanguageCode = data.preferred_language;

    const translatedMessage = await translate(`
Hi,
You are about to send ${amount} to ${paymentTo}.
`, preferredLanguage);

    const messageInstance = await whatsappClient.sendMessage(
        translatedMessage,
        paymentFrom
    );
    res.send(messageInstance);
});

app.post("/incoming-payment", async (req, res) => {
    const { paymentTo, paymentFrom, amount, description, confirmationOtp } = req.body;
    console.log(paymentTo, paymentFrom, amount, description, confirmationOtp);
    await whatsappClient.sendMessage(
        `Hi,
You are about to send ${amount} to ${paymentTo}${description ? ` for ${description}` : ""}.
Please enter the OTP to complete the transaction.
`, paymentFrom);

    res.send({
        ok: true,
    });
})

app.post("/incoming-payment-link", async (req, res) => {
    const { qrData, displayInfo, phoneNumber } = req.body;
    const { paymentId, currency, amount } = JSON.parse(qrData);
    console.log(paymentId, currency, amount);
    const { merchantName, description } = displayInfo;

    await whatsappClient.sendMessage(
        `Hi,
${merchantName} is requesting ${amount} ${currency} from you${description ? ` for ${description}` : ""}.
Please use the link below to pay: ${paymentId}
`, phoneNumber);

    // const { amount } = displayInfo;
    // const { id: link } = payment;
    // console.log(link, amount);

    res.send({
        ok: true,
    });
})
app.post("/new-message", async (req, res) => {
    const msgFrom = req.body.From;
    const msgBody = req.body.Body;

    console.log(`Incoming message from ${msgFrom}: ${msgBody}`);

    if(!Number.isNaN(Number(msgBody))) {
        // Assume that the user has entered the OTP
        console.log("OTP entered");
        await whatsappClient.sendMessage(
            `Hi,
Transaction confirmed.
Thank you for using Direla!
`, msgFrom);

        res.send({
            ok: true,
        });
        return;
    }
  
    await whatsappClient.respondToMessage(msgBody, msgFrom);
    console.log("Responded to message");

    res.send({
        ok: true,
    });
});

app.listen(5001, () => {
    console.log("Server is running on port 5001");
});

app.post("/payment-complete", async (req, res) => {
    const { amount, currency } = req.body;

    await whatsappClient.sendMessage(
        `Hi,
Successfully completed payment for ${currency} ${amount}.
Thank you for using Direla!
`, `+27659130193`);

    res.send({
        ok: true,
    });
})