import { generateGeminiText } from "@/lib/ai/gemini";

import { buildPatientAssistantContext } from "./context";

function buildSystemInstruction() {
  return [
    "You are a patient-facing dental clinic assistant for Clinical Atelier.",
    "Use only the structured clinic and patient context provided to you.",
    "You may help with clinic hours/contact basics, services and pricing, dentist suggestions, booking and follow-up guidance, and post-treatment aftercare from the provided records.",
    "Do not invent dentists, services, prices, treatment history, or appointment availability.",
    "Do not claim a dentist is definitively free at a specific time unless the context explicitly says so.",
    "When asked for timing, suggest published weekly availability windows and tell the patient that staff confirms the final slot.",
    "Never expose internal-only or other patients' data.",
    "Keep answers concise, practical, and safe.",
    "If the question sounds urgent, severe, or emergency-related, tell the patient to contact the clinic directly or seek urgent in-person care.",
  ].join(" ");
}

function buildPrompt(input: {
  question: string;
  contextJson: string;
  history: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}) {
  const historyBlock =
    input.history.length > 0
      ? [
          "Recent conversation history:",
          ...input.history.map(
            (entry: { role: "user" | "assistant"; content: string }) =>
              `${entry.role === "user" ? "Patient" : "Assistant"}: ${entry.content}`,
          ),
          "",
        ].join("\n")
      : "";

  return [
    historyBlock,
    "Patient question:",
    input.question,
    "",
    "Clinic and patient context:",
    input.contextJson,
    "",
    "Answer in under 180 words. Use clear paragraphs and short bullet lists when helpful. If there is not enough information, say what staff needs to confirm.",
  ].join("\n");
}

export async function askPatientAssistant(input: {
  patientName: string;
  patientProfileId: string;
  question: string;
  history: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}) {
  const context = await buildPatientAssistantContext({
    patientName: input.patientName,
    patientProfileId: input.patientProfileId,
  });

  return generateGeminiText({
    systemInstruction: buildSystemInstruction(),
    prompt: buildPrompt({
      question: input.question,
      contextJson: JSON.stringify(context, null, 2),
      history: input.history,
    }),
  });
}
