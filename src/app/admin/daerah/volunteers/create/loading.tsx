export default function CreateVolunteerLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-32 bg-slate-200 rounded-md" />
        <div className="h-8 w-64 bg-slate-200 rounded-md" />
        <div className="h-4 w-96 bg-slate-200 rounded-md" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-6">
        <div className="h-6 w-48 bg-slate-200 rounded-md" />
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="h-14 sm:col-span-2 bg-slate-100 rounded-xl" />
          <div className="h-14 bg-slate-100 rounded-xl" />
          <div className="h-14 bg-slate-100 rounded-xl" />
          <div className="h-14 sm:col-span-2 bg-slate-100 rounded-xl" />
          <div className="h-24 sm:col-span-2 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
