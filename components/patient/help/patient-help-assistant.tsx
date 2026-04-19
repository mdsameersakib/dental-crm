"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";

import { PatientAssistantResponse } from "./patient-assistant-response";

type PatientAssistantState = {
  responseId: string | null;
  question: string;
  answer: string | null;
  error: string | null;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type PatientHelpAssistantProps = {
  action: (
    state: PatientAssistantState,
    formData: FormData,
  ) => Promise<PatientAssistantState>;
};

const initialState: PatientAssistantState = {
  responseId: null,
  question: "",
  answer: null,
  error: null,
};

const suggestionPrompts = [
  "Which dentist is best for teeth cleaning and general checkups?",
  "What aftercare should I follow after my recent treatment?",
  "Which dentist should I consider for braces or alignment concerns?",
  "When are dentists usually available for follow-up visits?",
] as const;

export function PatientHelpAssistant({ action }: PatientHelpAssistantProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draftQuestion, setDraftQuestion] = useState("");
  const handledResponseIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      !state.responseId ||
      handledResponseIdRef.current === state.responseId
    ) {
      return;
    }

    handledResponseIdRef.current = state.responseId;

    if (state.question && state.answer && !state.error) {
      const assistantAnswer = state.answer;
      setMessages((current) => [
        ...current,
        {
          id: `${state.responseId}-user`,
          role: "user",
          content: state.question,
        },
        {
          id: `${state.responseId}-assistant`,
          role: "assistant",
          content: assistantAnswer,
        },
      ]);
      setDraftQuestion("");
    }
  }, [state]);

  const historyJson = useMemo(
    () =>
      JSON.stringify(
        messages.slice(-6).map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ),
    [messages],
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_320px]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          Patient Assistant
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold text-slate-900">
          Ask about services, dentists, and aftercare
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          The assistant uses clinic information, your own recent treatment
          notes, and published dentist availability to guide you. Final booking
          confirmation still comes from staff.
        </p>

        <div className="mt-6 rounded-[1.8rem] border border-slate-200 bg-slate-50/70 p-4">
          {messages.length === 0 ? (
            <div className="rounded-[1.4rem] bg-white px-4 py-5 text-sm leading-7 text-slate-600">
              Start a conversation and the assistant will respond here like a
              chat. Only a short recent history window is sent, so token usage
              stays controlled.
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={
                    message.role === "user"
                      ? "ml-auto max-w-[85%] rounded-[1.4rem] bg-[var(--color-primary)] px-4 py-3 text-sm leading-7 text-white shadow-sm"
                      : "max-w-[90%] rounded-[1.4rem] bg-white px-4 py-4 shadow-sm"
                  }
                >
                  <p
                    className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                      message.role === "user"
                        ? "text-white/80"
                        : "text-teal-700"
                    }`}
                  >
                    {message.role === "user" ? "You" : "Assistant"}
                  </p>
                  <div className="mt-2">
                    {message.role === "user" ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <PatientAssistantResponse text={message.content} />
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <form action={formAction} className="mt-6 grid gap-4">
          <input type="hidden" name="history_json" value={historyJson} />
          <div className="grid gap-2">
            <label
              htmlFor="question"
              className="text-sm font-semibold text-slate-700"
            >
              Your question
            </label>
            <textarea
              id="question"
              name="question"
              rows={5}
              required
              value={draftQuestion}
              onChange={(event) => setDraftQuestion(event.target.value)}
              placeholder="Ask about clinic services, pricing, dentist suggestions, follow-up timing, or your aftercare guidance."
              className="rounded-[1.6rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex w-fit items-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(0,101,101,0.18)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Thinking..." : "Ask Assistant"}
          </button>
        </form>

        {state.error ? (
          <p className="mt-5 rounded-[1.4rem] border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
            {state.error}
          </p>
        ) : null}
      </section>

      <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          Suggested prompts
        </p>
        <div className="mt-4 space-y-3">
          {suggestionPrompts.map((prompt) => (
            <form key={prompt} action={formAction}>
              <input type="hidden" name="history_json" value={historyJson} />
              <input type="hidden" name="question" value={prompt} />
              <button
                type="submit"
                className="w-full rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-medium leading-6 text-slate-700 transition hover:border-slate-300 hover:bg-white"
              >
                {prompt}
              </button>
            </form>
          ))}
        </div>
        <p className="mt-5 rounded-[1.4rem] bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-800">
          For urgent pain, swelling, bleeding, or emergency symptoms, contact
          the clinic directly instead of relying on the assistant.
        </p>
      </aside>
    </div>
  );
}
