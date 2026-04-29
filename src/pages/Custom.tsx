import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  exerciseCatalog,
  saveCustomWorkout,
  loadCustomWorkout,
  type ExerciseCategory,
} from "@/data/routines";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CATS: { id: ExerciseCategory; label: string }[] = [
  { id: "strength", label: "Strength" },
  { id: "cardio", label: "Cardio" },
  { id: "static", label: "Static" },
];

const Custom = () => {
  const navigate = useNavigate();
  const existing = loadCustomWorkout();

  const [selected, setSelected] = useState<Set<string>>(
    new Set(existing?.exerciseIds ?? [])
  );
  const [rounds, setRounds] = useState<number>(existing?.rounds ?? 2);
  const [perRound, setPerRound] = useState<number>(
    existing?.exerciseIds.length ?? 5
  );
  const [activeCat, setActiveCat] = useState<ExerciseCategory>("strength");

  const grouped = useMemo(() => {
    const m: Record<ExerciseCategory, typeof exerciseCatalog> = {
      strength: [],
      cardio: [],
      static: [],
    };
    exerciseCatalog.forEach((e) => m[e.category].push(e));
    return m;
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= perRound) {
          toast.message(`Limit reached`, {
            description: `You picked ${perRound} per round. Increase the count or deselect one.`,
          });
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  };

  const canStart = selected.size > 0 && rounds > 0;

  const handleStart = () => {
    if (!canStart) return;
    const cfg = {
      id: "custom",
      name: "Custom Workout",
      exerciseIds: Array.from(selected),
      rounds,
      restBetween: 20,
      restRound: 60,
    };
    saveCustomWorkout(cfg);
    navigate(`/routine/custom`);
  };

  const Stepper = ({
    value,
    onChange,
    min = 1,
    max = 99,
    label,
  }: {
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    label: string;
  }) => (
    <div className="glass-card p-4 flex-1">
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <Button
          variant="secondary"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-3xl font-bold tabular-nums">{value}</span>
        <Button
          variant="secondary"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-32">
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <Link
          to="/"
          className="h-10 w-10 rounded-full glass-card flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Custom
        </p>
        <div className="w-10" />
      </header>

      <section className="px-6">
        <h1 className="text-3xl font-bold leading-tight">Build a workout</h1>
        <p className="text-muted-foreground mt-1">
          Pick your exercises, rounds, and go.
        </p>
      </section>

      <section className="px-6 mt-6 flex gap-3">
        <Stepper
          label="Per round"
          value={perRound}
          onChange={setPerRound}
          min={1}
          max={12}
        />
        <Stepper
          label="Rounds"
          value={rounds}
          onChange={setRounds}
          min={1}
          max={6}
        />
      </section>

      <section className="px-6 mt-6">
        <p className="text-xs text-muted-foreground mb-3">
          Selected{" "}
          <span className="text-foreground font-semibold">
            {selected.size}/{perRound}
          </span>
        </p>

        <div className="flex gap-2 mb-4">
          {CATS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium transition",
                activeCat === c.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <ul className="space-y-2">
          {grouped[activeCat].map((ex) => {
            const isOn = selected.has(ex.id);
            return (
              <li key={ex.id}>
                <button
                  onClick={() => toggle(ex.id)}
                  className={cn(
                    "w-full text-left glass-card p-3 flex items-center gap-3 transition",
                    isOn && "ring-2 ring-primary"
                  )}
                >
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full border flex items-center justify-center shrink-0",
                      isOn
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border"
                    )}
                  >
                    {isOn && <Check className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold leading-tight truncate">
                      {ex.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {ex.cue}
                    </p>
                  </div>
                  <span className="text-xs font-medium tabular-nums text-primary shrink-0">
                    {ex.reps ? `${ex.reps} reps` : `${ex.duration}s`}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="fixed bottom-0 left-0 right-0 px-6 pb-6 pt-4 bg-gradient-to-t from-background via-background/95 to-transparent">
        <button
          disabled={!canStart}
          onClick={handleStart}
          className="w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 shadow-[var(--shadow-glow)] active:scale-[0.98] transition disabled:opacity-50"
        >
          <Play className="h-5 w-5 fill-current" />
          {existing ? "Save & preview" : "Create & preview"}
        </button>
      </div>
    </div>
  );
};

export default Custom;
