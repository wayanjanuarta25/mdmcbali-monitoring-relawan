export default function VolunteersLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* HEADER SKELETON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-slate-200 rounded-md" />
          <div className="h-8 w-60 bg-slate-200 rounded-md" />
          <div className="h-4 w-96 bg-slate-200 rounded-md" />
        </div>
        <div className="h-10 w-40 bg-slate-200 rounded-xl" />
      </div>

      {/* STATS SKELETON */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-slate-200 bg-white p-5 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-slate-100 rounded-md" />
              <div className="size-8 bg-slate-100 rounded-lg" />
            </div>
            <div className="h-7 w-16 bg-slate-200 rounded-md" />
          </div>
        ))}
      </div>

      {/* TABLE SKELETON */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="h-10 w-full sm:w-72 bg-slate-100 rounded-xl" />
        <div className="space-y-3 pt-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
