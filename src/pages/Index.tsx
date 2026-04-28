import { Link } from "react-router-dom";
import { ChevronRight, Dumbbell, Flame, Activity, Clock } from "lucide-react";
import { routines } from "@/data/routines";
import { useHistory } from "@/lib/history";
import { cn } from "@/lib/utils";

const accents: Record<string, { ring: string; chip: string; icon: JSX.Element }> = {
  lime: { ring: "from-primary/40 to-transparent", chip: "bg-primary/15 text-primary", icon: <Flame className="h-5 w-5" /> },
  cyan: { ring: "from-accent/40 to-transparent", chip: "bg-accent/15 text-accent", icon: <Activity className="h-5 w-5" /> },
  amber: { ring: "from-yellow-500/40 to-transparent", chip: "bg-yellow-500/15 text-yellow-400", icon: <Dumbbell className="h-5 w-5" /> },
};

const Index = () => {
  const { history } = useHistory();
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  const streak = (() => {
    if (history.length === 0) return 0;
    const days = new Set(history.map((h) => new Date(h.date).toDateString()));
    let count = 0;
    const d = new Date();
    while (days.has(d.toDateString())) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  })();

  return (
    <div className="min-h-screen pb-12">
      <header className="px-6 pt-8 pb-4">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{today}</p>
        <h1 className="text-4xl font-bold mt-1.5">Pulse</h1>
        <p className="text-muted-foreground mt-1">Pick your 20-minute session.</p>
      </header>

      {/* Stats */}
      <section className="px-6 grid grid-cols-2 gap-3 mb-6">
        <div className="glass-card p-4">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Streak</p>
          <p className="text-3xl font-bold mt-1">{streak}<span className="text-base text-muted-foreground ml-1">days</span></p>
        </div>
        <div className="glass-card p-4">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Sessions</p>
          <p className="text-3xl font-bold mt-1">{history.length}</p>
        </div>
      </section>

      {/* Routines */}
      <section className="px-6 space-y-4">
        {routines.map((r) => {
          const a = accents[r.accent];
          return (
            <Link
              key={r.id}
              to={`/routine/${r.id}`}
              className="block group active:scale-[0.99] transition"
            >
              <div className={cn("glass-card relative overflow-hidden p-5 bg-gradient-to-br", a.ring)}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full", a.chip)}>
                      {a.icon} {r.tagline.split("·")[0].trim()}
                    </span>
                    <h2 className="text-2xl font-bold mt-3 leading-tight">{r.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1.5">{r.tagline}</p>
                    <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {r.totalMinutes} min</span>
                      <span>{r.blocks.filter((b) => b.type === "exercise").length} exercises</span>
                      <span>2 rounds</span>
                    </div>
                  </div>
                  <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* History */}
      {history.length > 0 && (
        <section className="px-6 mt-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Recent</h3>
          </div>
          <div className="space-y-2">
            {history.slice(0, 6).map((h, i) => (
              <div key={i} className="glass-card px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{h.routineName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(h.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })} · {Math.round(h.durationSec / 60)} min
                  </p>
                </div>
                <span className="text-xs font-medium tabular-nums text-primary">{h.completed}/{h.total} ✓</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="px-6 mt-12 text-center">
        <p className="text-[11px] text-muted-foreground">
          Tip: On iPhone, tap Share → "Add to Home Screen" to install Pulse.
        </p>
      </footer>
    </div>
  );
};

export default Index;
