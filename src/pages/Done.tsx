import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

type State = { completed?: number; total?: number; durationSec?: number; routineName?: string };

const Done = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const s: State = (state as State) ?? {};

  useEffect(() => {
    if (!s.routineName) navigate("/", { replace: true });
  }, [s.routineName, navigate]);

  const minutes = Math.round((s.durationSec ?? 0) / 60);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center animate-fade-in">
      <div className="relative">
        <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center pulse-ring">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
      </div>
      <h1 className="text-4xl font-bold mt-8">Workout complete</h1>
      <p className="text-muted-foreground mt-2">{s.routineName}</p>

      <div className="mt-10 grid grid-cols-2 gap-3 w-full max-w-sm">
        <div className="glass-card p-5">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Duration</p>
          <p className="text-3xl font-bold mt-1">{minutes}<span className="text-sm text-muted-foreground ml-1">min</span></p>
        </div>
        <div className="glass-card p-5">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Completed</p>
          <p className="text-3xl font-bold mt-1">{s.completed ?? 0}<span className="text-sm text-muted-foreground">/{s.total ?? 0}</span></p>
        </div>
      </div>

      <Button size="lg" className="mt-10 rounded-full h-14 px-10 text-base font-semibold" onClick={() => navigate("/")}>
        Back to home
      </Button>
    </div>
  );
};

export default Done;
