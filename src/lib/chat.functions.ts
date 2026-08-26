import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(30),
});

const SYSTEM_PROMPT = `You are FarmPay AI, an assistant that helps Indian farmers understand government agriculture schemes (PM-KISAN, PMFBY, PM-KUSUM, KCC, Soil Health Card, PMKSY micro-irrigation, Agriculture Infrastructure Fund, Natural Farming Mission and similar).
Answer in short, plain language a smallholder farmer can follow. Use compact bullet points where helpful.
Always mention eligibility conditions, required documents (Aadhaar, land records, bank passbook etc.) and the official portal when relevant.
Say clearly when rules vary by state and advise confirming at the local Krishi Vigyan Kendra or CSC.`;

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { reply: "The AI assistant is not configured yet." };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.5-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages],
      }),
    });

    if (res.status === 429)
      return { reply: "Too many requests right now — please try again in a moment." };
    if (!res.ok) {
      console.error("AI gateway error", res.status, await res.text());
      return { reply: "Sorry, I couldn't reach the assistant. Please try again." };
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return {
      reply: json.choices?.[0]?.message?.content ?? "Sorry, I have no answer for that.",
    };
  });
