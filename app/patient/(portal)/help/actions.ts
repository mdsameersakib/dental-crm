"use server";

import { askPatientAssistant } from "@/features/patient-portal/chatbot/assistant";
import { requirePatientProfile } from "@/lib/auth/session";

type PatientAssistantState = {
  responseId: string | null;
  question: string;
  answer: string | null;
  error: string | null;
};

type PatientAssistantHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

function parseHistory(rawValue: FormDataEntryValue | null) {
  if (typeof rawValue !== "string" || !rawValue.trim()) {
    return [] as PatientAssistantHistoryItem[];
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (entry): entry is PatientAssistantHistoryItem =>
          typeof entry === "object" &&
          entry !== null &&
          (entry.role === "user" || entry.role === "assistant") &&
          typeof entry.content === "string",
      )
      .slice(-6);
  } catch {
    return [];
  }
}

export async function askPatientHelpAssistant(
  _previousState: PatientAssistantState,
  formData: FormData,
): Promise<PatientAssistantState> {
  const profile = await requirePatientProfile("/patient/help");
  const question = String(formData.get("question") ?? "").trim();
  const history = parseHistory(formData.get("history_json"));

  if (!question) {
    return {
      responseId: crypto.randomUUID(),
      question,
      answer: null,
      error: "Enter a question before asking the assistant.",
    };
  }

  if (question.length > 500) {
    return {
      responseId: crypto.randomUUID(),
      question,
      answer: null,
      error: "Keep the question under 500 characters.",
    };
  }

  const fullName =
    `${profile.firstName} ${profile.lastName}`.trim() || "Patient";

  try {
    const response = await askPatientAssistant({
      patientName: fullName,
      patientProfileId: profile.patientProfileId,
      question,
      history,
    });

    return {
      responseId: crypto.randomUUID(),
      question,
      answer: response.text,
      error: null,
    };
  } catch {
    return {
      responseId: crypto.randomUUID(),
      question,
      answer: null,
      error:
        "The assistant is unavailable right now. Please try again in a moment or contact staff directly.",
    };
  }
}
