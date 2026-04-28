export type ExerciseKind =
  | "squat"
  | "swing"
  | "pushup"
  | "plank"
  | "lunge"
  | "jumpingJack"
  | "ropeJump"
  | "row"
  | "twist"
  | "crunch"
  | "deadlift"
  | "stretch"
  | "shoulderTap"
  | "halo"
  | "march"
  | "catCow";

export type Exercise = {
  id: string;
  name: string;
  kind: ExerciseKind;
  /** seconds for time-based, undefined if rep-based */
  duration?: number;
  /** rep target if rep-based */
  reps?: number;
  cue: string;
  equipment?: string;
};

export type Block =
  | { type: "exercise"; exercise: Exercise }
  | { type: "rest"; duration: number; label?: string };

export type Routine = {
  id: string;
  name: string;
  tagline: string;
  totalMinutes: number;
  accent: "lime" | "cyan" | "amber";
  blocks: Block[];
};

const restShort = (s = 20, label = "Rest"): Block => ({ type: "rest", duration: s, label });
const restLong = (s = 60): Block => ({ type: "rest", duration: s, label: "Round break" });

// ---- Routine 1: Full Body Kettlebell ----
const fullBodyRound: Block[] = [
  { type: "exercise", exercise: { id: "kb-swing", name: "Kettlebell Swing", kind: "swing", duration: 40, cue: "Hinge at hips, snap glutes, swing to chest height.", equipment: "Kettlebell" } },
  restShort(20),
  { type: "exercise", exercise: { id: "goblet-squat", name: "Goblet Squat", kind: "squat", reps: 12, cue: "Hold KB at chest. Sit between heels, chest tall.", equipment: "Kettlebell" } },
  restShort(20),
  { type: "exercise", exercise: { id: "pushup", name: "Push-ups", kind: "pushup", reps: 10, cue: "Hands under shoulders. Lower with control.", equipment: "Mat" } },
  restShort(20),
  { type: "exercise", exercise: { id: "kb-row", name: "Bent-over Row", kind: "row", reps: 10, cue: "Flat back, pull KB to hip. Both sides.", equipment: "Kettlebell" } },
  restShort(20),
  { type: "exercise", exercise: { id: "plank", name: "Plank", kind: "plank", duration: 40, cue: "Squeeze glutes, neutral spine, breathe.", equipment: "Mat" } },
];

// ---- Routine 2: Core & Conditioning ----
const coreRound: Block[] = [
  { type: "exercise", exercise: { id: "rope", name: "Rope Skips", kind: "ropeJump", duration: 45, cue: "Light bounce on balls of feet.", equipment: "Rope" } },
  restShort(15),
  { type: "exercise", exercise: { id: "russian-twist", name: "Russian Twist", kind: "twist", reps: 20, cue: "Lean back 45°, rotate KB side to side.", equipment: "Kettlebell" } },
  restShort(15),
  { type: "exercise", exercise: { id: "crunch", name: "Crunches", kind: "crunch", reps: 15, cue: "Lift shoulder blades, exhale at the top.", equipment: "Mat" } },
  restShort(15),
  { type: "exercise", exercise: { id: "shoulder-tap", name: "Plank Shoulder Taps", kind: "shoulderTap", duration: 30, cue: "Stay rigid, tap opposite shoulder.", equipment: "Mat" } },
  restShort(15),
  { type: "exercise", exercise: { id: "halo", name: "KB Halos", kind: "halo", reps: 10, cue: "Circle KB around head, both directions.", equipment: "Kettlebell" } },
];

// ---- Routine 3: Mobility & Strength ----
const mobilityRound: Block[] = [
  { type: "exercise", exercise: { id: "march", name: "March in Place", kind: "march", duration: 40, cue: "Lift knees to hip height, swing arms.", equipment: "—" } },
  restShort(20),
  { type: "exercise", exercise: { id: "lunge", name: "Reverse Lunges", kind: "lunge", reps: 12, cue: "Step back, drop rear knee. Alternate.", equipment: "Mat" } },
  restShort(20),
  { type: "exercise", exercise: { id: "deadlift", name: "KB Deadlift", kind: "deadlift", reps: 12, cue: "Hinge at hips, KB close to shins.", equipment: "Kettlebell" } },
  restShort(20),
  { type: "exercise", exercise: { id: "cat-cow", name: "Cat-Cow Stretch", kind: "catCow", duration: 45, cue: "On all fours. Inhale arch, exhale round.", equipment: "Mat" } },
  restShort(20),
  { type: "exercise", exercise: { id: "plank-mob", name: "Plank Hold", kind: "plank", duration: 30, cue: "Solid line head to heels.", equipment: "Mat" } },
];

const buildTwoRound = (round: Block[]): Block[] => [
  ...round,
  restLong(60),
  ...round,
];

export const routines: Routine[] = [
  {
    id: "full-body",
    name: "Full Body Power",
    tagline: "Kettlebell · Mat · 20 min",
    totalMinutes: 20,
    accent: "lime",
    blocks: buildTwoRound(fullBodyRound),
  },
  {
    id: "core-cond",
    name: "Core & Conditioning",
    tagline: "Rope · Kettlebell · 20 min",
    totalMinutes: 20,
    accent: "cyan",
    blocks: buildTwoRound(coreRound),
  },
  {
    id: "mobility",
    name: "Mobility & Strength",
    tagline: "Mat · Kettlebell · 20 min",
    totalMinutes: 20,
    accent: "amber",
    blocks: buildTwoRound(mobilityRound),
  },
];

export const getRoutine = (id: string) => routines.find((r) => r.id === id);
