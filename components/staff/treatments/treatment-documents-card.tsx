import {
  deleteTreatmentDocument,
  uploadTreatmentDocument,
} from "@/app/(staff)/staff/treatments/actions";
import type { StaffTreatmentDocument } from "@/features/documents/types";
import type { StaffTreatmentSummary } from "@/features/treatments/types";

type TreatmentDocumentsCardProps = {
  treatment: StaffTreatmentSummary;
  documents: StaffTreatmentDocument[];
};

export function TreatmentDocumentsCard({
  treatment,
  documents,
}: TreatmentDocumentsCardProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Attachments
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
            Treatment documents
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Upload scans, reports, photos, or other files linked to this
            treatment. Patient-visible files also appear in the portal.
          </p>
        </div>
      </div>

      <form
        action={uploadTreatmentDocument}
        className="mt-5 grid gap-4 rounded-[1.6rem] border border-slate-200 bg-slate-50/80 p-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]"
      >
        <input type="hidden" name="treatment_id" value={treatment.id} />
        <input type="hidden" name="patient_id" value={treatment.patientId} />
        <input
          type="hidden"
          name="appointment_id"
          value={treatment.appointmentId ?? ""}
        />
        <div className="grid gap-2 lg:col-span-3">
          <label
            htmlFor="document_file"
            className="text-sm font-semibold text-slate-700"
          >
            File
          </label>
          <input
            id="document_file"
            name="document_file"
            type="file"
            required
            accept=".pdf,image/png,image/jpeg,image/webp"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
          />
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="document_type"
            className="text-sm font-semibold text-slate-700"
          >
            Type
          </label>
          <select
            id="document_type"
            name="document_type"
            defaultValue="report"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
          >
            <option value="xray">X-Ray</option>
            <option value="scan">Scan</option>
            <option value="report">Report</option>
            <option value="consent_form">Consent Form</option>
            <option value="photo">Photo</option>
            <option value="invoice">Invoice</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="visible_to_patient"
            className="text-sm font-semibold text-slate-700"
          >
            Portal visibility
          </label>
          <select
            id="visible_to_patient"
            name="visible_to_patient"
            defaultValue="yes"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
          >
            <option value="yes">Visible to patient</option>
            <option value="no">Staff only</option>
          </select>
        </div>
        <div className="grid gap-2 lg:col-span-3">
          <label
            htmlFor="document_notes"
            className="text-sm font-semibold text-slate-700"
          >
            Note
          </label>
          <textarea
            id="document_notes"
            name="document_notes"
            rows={3}
            placeholder="Optional note about this file"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-fit rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Upload document
        </button>
      </form>

      <div className="mt-5 space-y-3">
        {documents.length === 0 ? (
          <p className="rounded-[1.5rem] bg-slate-50 px-4 py-5 text-sm text-slate-600">
            No documents have been uploaded for this treatment yet.
          </p>
        ) : (
          documents.map((document) => (
            <article
              key={document.id}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 px-4 py-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">
                    {document.fileName}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {document.documentType.replaceAll("_", " ")}
                  </p>
                  {document.notes ? (
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {document.notes}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                      document.isVisibleToPatient
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {document.isVisibleToPatient
                      ? "Patient visible"
                      : "Staff only"}
                  </span>
                  {document.downloadUrl ? (
                    <a
                      href={document.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                      Open
                    </a>
                  ) : null}
                  <form action={deleteTreatmentDocument}>
                    <input
                      type="hidden"
                      name="document_id"
                      value={document.id}
                    />
                    <input
                      type="hidden"
                      name="treatment_id"
                      value={treatment.id}
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
