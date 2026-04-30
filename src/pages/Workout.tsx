import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Pause, Play, SkipForward, Plus, Minus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ExerciseAnimation from "@/components/ExerciseAnimation";
import { getRoutine } from "@/data/routines";
import { saveHistoryEntry } from "@/lib/history";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const Workout = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const routine = useMemo(() => getRoutine(id), [id]);

  const [index, setIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0); // seconds since block start
  const [running, setRunning] = useState(true);
  const [reps, setReps] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const startedAtRef = useRef<number>(Date.now());

  // Simple "pling" sound using Web Audio API
  const playPling = () => {
    try {
      const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(880, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.5);
      setTimeout(() => ctx.close(), 600);
    } catch {
      // ignore
    }
  };
  

  if (!routine) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Button onClick={() => navigate("/")}>Back home</Button>
      </div>
    );
  }

  const block = routine.blocks[index];
  const totalBlocks = routine.blocks.length;
  const exerciseBlocks = routine.blocks.filter((b) => b.type === "exercise");
  const exerciseIndex = routine.blocks.slice(0, index + 1).filter((b) => b.type === "exercise").length;
  const isExercise = block.type === "exercise";
  const targetSeconds = block.type === "rest" ? block.duration : block.exercise.duration;
  const isTimed = typeof targetSeconds === "number";
  const remaining = isTimed ? Math.max(0, (targetSeconds as number) - elapsed) : null;

  // Reset block-local state when block changes
  useEffect(() => {
    setElapsed(0);
    setReps(0);
    const cur = routine.blocks[index];
    const isTimedExercise = cur.type === "exercise" && typeof cur.exercise.duration === "number";
    // Timed exercises always wait for the user to press Start.
    if (isTimedExercise) {
      setRunning(false);
    } else {
      setRunning(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Play pling only when a timed exercise's timer naturally reaches 0
  useEffect(() => {
    const cur = routine.blocks[index];
    if (
      cur.type === "exercise" &&
      typeof cur.exercise.duration === "number" &&
      isTimed &&
      remaining === 0 &&
      running
    ) {
      playPling();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, isTimed, running, index]);

  // Tick
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  // Auto-advance for timed blocks
  useEffect(() => {
    if (isTimed && remaining === 0 && running) {
      handleNext(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, isTimed, running]);

  const finish = () => {
    const totalSec = Math.round((Date.now() - startedAtRef.current) / 1000);
    saveHistoryEntry({
      routineId: routine.id,
      routineName: routine.name,
      date: new Date().toISOString(),
      durationSec: totalSec,
      completed: completed.size,
      total: exerciseBlocks.length,
    });
    toast.success("Workout complete 💪", { description: `${completed.size}/${exerciseBlocks.length} exercises checked.` });
    navigate("/done", { state: { completed: completed.size, total: exerciseBlocks.length, durationSec: totalSec, routineName: routine.name } });
  };

  const handleNext = (autoCheck = false) => {
    if (isExercise && (autoCheck || true)) {
      // Mark current exercise as completed when we move on (timer auto-advance or user skip)
      if (autoCheck) {
        setCompleted((prev) => new Set(prev).add(index));
      }
    }
    if (index >= totalBlocks - 1) return finish();
    setIndex((i) => i + 1);
  };

  const handleCheck = () => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
    // advance after a short beat
    setTimeout(() => {
      if (index >= totalBlocks - 1) finish();
      else setIndex((i) => i + 1);
    }, 220);
  };

  const overallProgress = ((index + (isTimed && remaining !== null ? 1 - remaining / (targetSeconds as number) : 0)) / totalBlocks) * 100;

  // Color accent per routine
  const accentBg =
    routine.accent === "cyan" ? "from-accent/30" : routine.accent === "amber" ? "from-yellow-500/25" : "from-primary/30";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-5 pt-5 pb-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} aria-label="Exit workout">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{routine.name}</p>
          <p className="text-sm font-medium">
            Exercise {Math.min(exerciseIndex, exerciseBlocks.length)} / {exerciseBlocks.length}
          </p>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatTime(Math.round((Date.now() - startedAtRef.current) / 1000))}
        </span>
      </header>

      <div className="px-5">
        <Progress value={overallProgress} className="h-1.5" />
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-between px-5 py-6 animate-fade-in">
        {block.type === "rest" ? (
          <RestView remaining={remaining ?? 0} total={block.duration} label={block.label} />
        ) : (
          <>
            <div className={cn("w-full max-w-md mt-2 rounded-3xl bg-gradient-to-b to-transparent p-6 glass-card", accentBg)}>
              <div className="flex items-center justify-center">
                <ExerciseAnimation kind={block.exercise.kind} size={260} />
              </div>
            </div>

            <div className="text-center mt-6 mb-2 max-w-md">
              <h1 className="text-3xl font-bold leading-tight">{block.exercise.name}</h1>
              <p className="text-sm text-muted-foreground mt-2">{block.exercise.cue}</p>
              {block.exercise.equipment && (
                <span className="inline-block mt-3 text-[11px] uppercase tracking-widest text-muted-foreground">
                  {block.exercise.equipment}
                </span>
              )}
            </div>

            {/* Timer or Rep counter */}
            {isTimed ? (
              <TimerCircle remaining={remaining ?? 0} total={targetSeconds as number} />
            ) : (
              <RepCounter target={block.exercise.reps ?? 10} value={reps} setValue={setReps} />
            )}
          </>
        )}

        {/* Controls */}
        <div className="w-full max-w-md mt-6 flex items-center gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="rounded-full h-14 w-14 p-0"
            onClick={() => setRunning((r) => !r)}
            aria-label={running ? "Pause" : "Resume"}
          >
            {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>

          {isExercise ? (
            isTimed && !running && elapsed === 0 ? (
              <Button
                size="lg"
                className="flex-1 rounded-full h-14 text-base font-semibold pulse-ring"
                onClick={() => setRunning(true)}
              >
                <Play className="h-5 w-5 mr-2" /> Start
              </Button>
            ) : (
              <Button
                size="lg"
                className="flex-1 rounded-full h-14 text-base font-semibold pulse-ring"
                onClick={handleCheck}
              >
                <Check className="h-5 w-5 mr-2" /> Done
              </Button>
            )
          ) : (
            <Button
              size="lg"
              className="flex-1 rounded-full h-14 text-base font-semibold"
              onClick={() => handleNext(true)}
            >
              <SkipForward className="h-5 w-5 mr-2" /> Skip rest
            </Button>
          )}

          <Button
            variant="secondary"
            size="lg"
            className="rounded-full h-14 w-14 p-0"
            onClick={() => handleNext(false)}
            aria-label="Skip"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
      </main>

      {/* Up next */}
      {index < totalBlocks - 1 && (
        <footer className="px-5 pb-6">
          <div className="glass-card px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Up next</p>
              <p className="text-sm font-medium mt-0.5">
                {(() => {
                  const nb = routine.blocks[index + 1];
                  return nb.type === "exercise" ? nb.exercise.name : nb.label ?? "Rest";
                })()}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">{index + 2} / {totalBlocks}</span>
          </div>
        </footer>
      )}
    </div>
  );
};

const TimerCircle = ({ remaining, total }: { remaining: number; total: number }) => {
  const r = 78;
  const C = 2 * Math.PI * r;
  const pct = total === 0 ? 0 : remaining / total;
  const offset = C * (1 - pct);
  return (
    <div className="relative w-[200px] h-[200px] flex items-center justify-center mt-4">
      <svg width="200" height="200" className="-rotate-90">
        <circle cx="100" cy="100" r={r} stroke="hsl(var(--muted))" strokeWidth="10" fill="none" />
        <circle
          cx="100"
          cy="100"
          r={r}
          stroke="hsl(var(--primary))"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-5xl font-bold tabular-nums">{remaining}</div>
        <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">seconds</div>
      </div>
    </div>
  );
};

const RepCounter = ({ target, value, setValue }: { target: number; value: number; setValue: (v: number) => void }) => {
  return (
    <div className="mt-4 flex flex-col items-center gap-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Target {target} reps</p>
      <div className="flex items-center gap-5">
        <Button variant="secondary" size="icon" className="h-14 w-14 rounded-full" onClick={() => setValue(Math.max(0, value - 1))}>
          <Minus className="h-5 w-5" />
        </Button>
        <button
          onClick={() => setValue(value + 1)}
          className="h-32 w-32 rounded-full bg-primary text-primary-foreground text-5xl font-bold tabular-nums shadow-[var(--shadow-glow)] active:scale-95 transition"
          aria-label="Tap to add rep"
        >
          {value}
        </button>
        <Button variant="secondary" size="icon" className="h-14 w-14 rounded-full" onClick={() => setValue(value + 1)}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      <button onClick={() => setValue(0)} className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-1">
        <RotateCcw className="h-3 w-3" /> Reset
      </button>
    </div>
  );
};

const RestView = ({ remaining, total, label }: { remaining: number; total: number; label?: string }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full">
      <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-6">{label ?? "Rest"}</p>
      <TimerCircle remaining={remaining} total={total} />
      <p className="mt-8 text-sm text-muted-foreground max-w-xs text-center">
        Breathe. Shake out your arms. Reset your grip.
      </p>
    </div>
  );
};

export default Workout;
