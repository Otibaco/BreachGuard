export default function AdminHeader({ title, description, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-heading text-xl font-bold text-text-primary sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-text-muted sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 self-start sm:self-auto">{actions}</div>}
    </div>
  );
}
