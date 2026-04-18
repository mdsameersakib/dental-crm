type PatientPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PatientPageHeader({
  eyebrow,
  title,
  description,
}: PatientPageHeaderProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
        {eyebrow}
      </p>
      <div className="space-y-2">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}
