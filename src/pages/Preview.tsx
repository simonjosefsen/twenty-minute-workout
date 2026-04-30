import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Play, Repeat, Coffee, ArrowUp, ArrowDown } from "lucide-react";
import { getRoutine, setSessionExerciseOrder, clearSessionExerciseOrder } from "@/data/routines";
import { ExerciseAnimation } from "@/components/ExerciseAnimation";

const formatDuration = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
};

const Preview = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const routine = getRoutine(id);

  if (!routine) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-muted-foreground">Routine not found.</p>
      </div>
    );
  }

  const exerciseCount = routine.blocks.filter((b) => b.type === "exercise").length;
  const totalSec = routine.blocks.reduce((acc, b) => {
    if (b.type === "rest") return acc + b.duration;
    return acc + (b.exercise.duration ?? 30);
  }, 0);

  // Split blocks into rounds based on the long "Round break" rest
  const rounds: typeof routine.blocks[] = [[]];
  routine.blocks.forEach((b) => {
    if (b.type === "rest" && b.label === "Round break") {
      rounds.push([]);
    } else {
      rounds[rounds.length - 1].push(b);
    }
  });

  return (
    <div className="min-h-screen pb-32">
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="h-10 w-10 rounded-full glass-card flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Preview</p>
        <div className="w-10" />
      </header>

      <section className="px-6">
        <h1 className="text-3xl font-bold leading-tight">{routine.name}</h1>
        <p className="text-muted-foreground mt-1">{routine.tagline}</p>
        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> ~{Math.round(totalSec / 60)} min</span>
          <span>{exerciseCount} exercises</span>
          <span>{rounds.length} rounds</span>
        </div>
      </section>

      <section className="px-6 mt-6 space-y-6">
        {rounds.map((round, ri) => (
          <div key={ri}>
            <div className="flex items-center gap-2 mb-3">
              <Repeat className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Round {ri + 1}
              </h2>
            </div>
            <ol className="space-y-2">
              {round.map((block, i) => {
                if (block.type === "rest") {
                  return (
                    <li
                      key={i}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-dashed border-border/60 text-muted-foreground"
                    >
                      <Coffee className="h-4 w-4" />
                      <span className="text-sm flex-1">{block.label ?? "Rest"}</span>
                      <span className="text-xs tabular-nums">{formatDuration(block.duration)}</span>
                    </li>
                  );
                }
                const ex = block.exercise;
                return (
                  <li key={i} className="glass-card p-3 flex items-center gap-3">
                    <div className="h-14 w-20 shrink-0 rounded-xl bg-secondary/50 overflow-hidden flex items-center justify-center">
                      <ExerciseAnimation kind={ex.kind} size={110} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold leading-tight truncate">{ex.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{ex.cue}</p>
                    </div>
                    <span className="text-xs font-medium tabular-nums text-primary shrink-0">
                      {ex.reps ? `${ex.reps} reps` : `${ex.duration}s`}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </section>

      {/* Sticky start button */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-6 pt-4 bg-gradient-to-t from-background via-background/95 to-transparent">
        <Link
          to={`/workout/${routine.id}`}
          className="w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 shadow-[var(--shadow-glow)] active:scale-[0.98] transition"
        >
          <Play className="h-5 w-5 fill-current" />
          Start workout
        </Link>
      </div>
    </div>
  );
};

export default Preview;
