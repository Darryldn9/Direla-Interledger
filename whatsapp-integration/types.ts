export type LanguageCode = "en" | "zu" | "xh";

export type Message = {
    from: string;
    to: string;
    body: string;
    dateCreated: Date;
};