import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Dumbbell, Flame, Activity, Clock, Trash2, Sparkles } from "lucide-react";
import { routines, loadCustomWorkout, loadSavedCustomWorkouts, deleteSavedCustomWorkout } from "@/data/routines";
import { useHistory, computeWeeklyStreak, deleteHistoryEntry, loadWeeklyGoal, saveWeeklyGoal } from "@/lib/history";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FEATURED_IDS = ["full-body", "emom-15", "mobility"];

const accents: Record<string, { ring: string; chip: string; icon: JSX.Element }> = {
  lime: { ring: "from-primary/40 to-transparent", chip: "bg-primary/15 text-primary", icon: <Flame className="h-5 w-5" /> },
  cyan: { ring: "from-accent/40 to-transparent", chip: "bg-accent/15 text-accent", icon: <Activity className="h-5 w-5" /> },
  amber: { ring: "from-yellow-500/40 to-transparent", chip: "bg-yellow-500/15 text-yellow-400", icon: <Dumbbell className="h-5 w-5" /> },
};

const Index = () => {
  const { history, refresh } = useHistory();
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  const { thisWeek, goal, streak, fire } = computeWeeklyStreak(history);
  const progressPct = Math.min(100, (thisWeek / goal) * 100);
  const customCfg = loadCustomWorkout();
  const [savedCustoms, setSavedCustoms] = useState(loadSavedCustomWorkouts());

  // First-time onboarding: ask for weekly goal if none saved
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    if (loadWeeklyGoal() === null) setShowOnboarding(true);
  }, []);
  const handleSelectGoal = (g: number) => {
    saveWeeklyGoal(g);
    setShowOnboarding(false);
    refresh();
  };

  return (
    <div className="min-h-screen pb-12">
      <Dialog open={showOnboarding}>
        <DialogContent
          className="max-w-sm"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl">Welcome to Pulse</DialogTitle>
            <DialogDescription>Set your weekly workout goal</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[2, 3, 4, 5].map((g) => (
              <Button
                key={g}
                variant="secondary"
                className="h-16 text-lg font-semibold rounded-xl"
                onClick={() => handleSelectGoal(g)}
              >
                {g} <span className="text-sm text-muted-foreground ml-1.5">/ week</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <header className="px-6 pt-8 pb-4">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{today}</p>
        <h1 className="text-4xl font-bold mt-1.5">Pulse</h1>
        <p className="text-muted-foreground mt-1">Pick your daily workout</p>
      </header>

      {/* Stats */}
      <section className="px-6 grid grid-cols-2 gap-3 mb-6">
        <div className="glass-card p-4">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Streak</p>
          <p className="text-3xl font-bold mt-1 flex items-baseline gap-1">
            {streak}
            <span className="text-base text-muted-foreground">{streak === 1 ? "week" : "weeks"}</span>
            {fire && <span className="text-2xl ml-1" aria-label="On fire">🔥</span>}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">This week</p>
          <p className="text-3xl font-bold mt-1 flex items-baseline gap-1 tabular-nums">
            {thisWeek}<span className="text-muted-foreground">/{goal}</span>
            {thisWeek >= goal + 1 && <span className="text-2xl ml-1" aria-label="On fire">🔥</span>}
          </p>
          <div className="mt-2 h-1.5 rounded-full bg-secondary/60 overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </section>

      {/* Routines */}
      <section className="px-6">
        <Tabs defaultValue="featured" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="yours">Yours</TabsTrigger>
          </TabsList>

          {(() => {
            const renderRoutineCard = (r: typeof routines[number]) => {
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
                          <span>3 rounds</span>
                        </div>
                      </div>
                      <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                </Link>
              );
            };

            const featured = FEATURED_IDS
              .map((id) => routines.find((r) => r.id === id))
              .filter((r): r is typeof routines[number] => Boolean(r));

            return (
              <>
                <TabsContent value="featured" className="space-y-4 mt-0">
                  {featured.map(renderRoutineCard)}
                </TabsContent>

                <TabsContent value="all" className="space-y-4 mt-0">
                  {routines.map(renderRoutineCard)}
                </TabsContent>

                <TabsContent value="yours" className="space-y-4 mt-0">
                  {/* Custom workout builder entry */}
                  <Link to="/custom" className="block group active:scale-[0.99] transition">
                    <div className="glass-card relative overflow-hidden p-5 bg-gradient-to-br from-accent/20 to-transparent border-dashed">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-accent/15 text-accent">
                            <Sparkles className="h-4 w-4" /> Custom
                          </span>
                          <h2 className="text-2xl font-bold mt-3 leading-tight">
                            {savedCustoms.length > 0 ? "Build another" : "Create custom workout"}
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1.5">
                            {customCfg && savedCustoms.length === 0
                              ? `Last: ${customCfg.exerciseIds.length} exercises · ${customCfg.rounds} rounds`
                              : "Pick exercises from the library and save it."}
                          </p>
                        </div>
                        <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition" />
                      </div>
                    </div>
                  </Link>

                  {/* Saved custom workouts */}
                  {savedCustoms.map((c) => (
                    <div key={c.id} className="relative">
                      <Link to={`/routine/${c.id}`} className="block group active:scale-[0.99] transition">
                        <div className="glass-card relative overflow-hidden p-5 bg-gradient-to-br from-accent/30 to-transparent">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-accent/15 text-accent">
                                <Sparkles className="h-4 w-4" /> Saved
                              </span>
                              <h2 className="text-2xl font-bold mt-3 leading-tight truncate pr-10">{c.name}</h2>
                              <p className="text-sm text-muted-foreground mt-1.5">
                                {c.exerciseIds.length} exercises · {c.rounds} rounds
                              </p>
                            </div>
                            <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition" />
                          </div>
                        </div>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (confirm(`Delete "${c.name}"?`)) {
                            deleteSavedCustomWorkout(c.id);
                            setSavedCustoms(loadSavedCustomWorkouts());
                          }
                        }}
                        className="absolute top-3 right-3 h-8 w-8 inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                        aria-label={`Delete ${c.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </TabsContent>
              </>
            );
          })()}
        </Tabs>
      </section>

      {/* History */}
      {history.length > 0 && (
        <section className="px-6 mt-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Recent</h3>
          </div>
          <div className="space-y-2">
            {history.slice(0, 6).map((h, i) => (
              <div key={`${h.date}-${i}`} className="glass-card px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{h.routineName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(h.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })} · {Math.round(h.durationSec / 60)} min
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium tabular-nums text-primary">{h.completed}/{h.total} ✓</span>
                  <button
                    onClick={() => {
                      deleteHistoryEntry(i);
                      refresh();
                    }}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                    aria-label={`Delete ${h.routineName}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
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
