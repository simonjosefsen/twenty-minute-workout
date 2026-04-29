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
  | "catCow"
  | "generic";

export type ExerciseCategory = "static" | "cardio" | "strength";

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

// ---- Catalog of selectable exercises for Custom Workout ----
export type CatalogExercise = Exercise & { category: ExerciseCategory };

export const exerciseCatalog: CatalogExercise[] = [
  // Strength (existing)
  { id: "kb-swing", name: "Kettlebell Swing", kind: "swing", duration: 40, cue: "Hinge at hips, snap glutes.", equipment: "Kettlebell", category: "strength" },
  { id: "goblet-squat", name: "Goblet Squat", kind: "squat", reps: 12, cue: "Hold KB at chest. Sit between heels.", equipment: "Kettlebell", category: "strength" },
  { id: "pushup", name: "Push-ups", kind: "pushup", reps: 10, cue: "Hands under shoulders. Lower with control.", equipment: "Mat", category: "strength" },
  { id: "kb-row", name: "Bent-over Row", kind: "row", reps: 10, cue: "Flat back, pull KB to hip.", equipment: "Kettlebell", category: "strength" },
  { id: "kb-deadlift", name: "KB Deadlift", kind: "deadlift", reps: 12, cue: "Hinge at hips, KB close to shins.", equipment: "Kettlebell", category: "strength" },
  { id: "lunge", name: "Reverse Lunges", kind: "lunge", reps: 12, cue: "Step back, drop rear knee. Alternate.", equipment: "Mat", category: "strength" },
  { id: "halo", name: "KB Halos", kind: "halo", reps: 10, cue: "Circle KB around head.", equipment: "Kettlebell", category: "strength" },
  // Static (holds + mobility)
  { id: "plank", name: "Plank", kind: "plank", duration: 40, cue: "Squeeze glutes, neutral spine.", equipment: "Mat", category: "static" },
  { id: "cat-cow", name: "Cat-Cow Stretch", kind: "catCow", duration: 45, cue: "Inhale arch, exhale round.", equipment: "Mat", category: "static" },
  { id: "stretch", name: "Standing Stretch", kind: "stretch", duration: 30, cue: "Open up the body.", equipment: "—", category: "static" },
  // Cardio
  { id: "rope", name: "Rope Skips", kind: "ropeJump", duration: 45, cue: "Light bounce on balls of feet.", equipment: "Rope", category: "cardio" },
  { id: "march", name: "March in Place", kind: "march", duration: 40, cue: "Lift knees to hip height.", equipment: "—", category: "cardio" },
  { id: "jumping-jack", name: "Jumping Jacks", kind: "jumpingJack", duration: 40, cue: "Light, rhythmic.", equipment: "—", category: "cardio" },
  // Core (existing → strength bucket)
  { id: "russian-twist", name: "Russian Twist", kind: "twist", reps: 20, cue: "Lean back 45°, rotate side to side.", equipment: "Kettlebell", category: "strength" },
  { id: "crunch", name: "Crunches", kind: "crunch", reps: 15, cue: "Lift shoulder blades, exhale at top.", equipment: "Mat", category: "strength" },
  { id: "shoulder-tap", name: "Plank Shoulder Taps", kind: "shoulderTap", duration: 30, cue: "Stay rigid, tap opposite shoulder.", equipment: "Mat", category: "strength" },

  // ---- New exercises (placeholder visuals) ----
  { id: "back-bends", name: "Back Bends", kind: "generic", duration: 30, cue: "Hands on lower back, gently arch backward.", equipment: "—", category: "static" },
  { id: "sit-ups", name: "Sit Ups", kind: "generic", reps: 15, cue: "Full range, exhale on the way up.", equipment: "Mat", category: "strength" },
  { id: "bw-lunge", name: "Bodyweight Lunge", kind: "generic", reps: 12, cue: "Step forward, drop rear knee. Alternate.", equipment: "—", category: "strength" },
  { id: "bench-dip", name: "Dip, on bench", kind: "generic", reps: 10, cue: "Hands on bench, elbows back, dip down.", equipment: "Bench", category: "strength" },
  { id: "oh-crunch", name: "Hands Overhead Crunch", kind: "generic", reps: 15, cue: "Arms extended overhead, crunch up.", equipment: "Mat", category: "strength" },
  { id: "rot-mt-climber", name: "Rotating Mountain Climber", kind: "generic", duration: 30, cue: "Drive knee toward opposite elbow.", equipment: "Mat", category: "cardio" },
  { id: "leg-raise", name: "Floor Leg Raise", kind: "generic", reps: 12, cue: "Lower legs slowly, keep low back pressed down.", equipment: "Mat", category: "strength" },
  { id: "ab-pendulum", name: "Bent Knees Ab Pendulum", kind: "generic", reps: 16, cue: "Knees bent, swing legs side to side under control.", equipment: "Mat", category: "strength" },
];

export const getCatalogExercise = (id: string) => exerciseCatalog.find((e) => e.id === id);

// ---- Custom workout persistence ----
const CUSTOM_KEY = "pulse.custom.v1";

export type CustomWorkoutConfig = {
  id: string; // "custom"
  name: string;
  exerciseIds: string[]; // per round
  rounds: number;
  restBetween: number; // seconds between exercises
  restRound: number; // seconds between rounds
};

export const loadCustomWorkout = (): CustomWorkoutConfig | null => {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    return raw ? (JSON.parse(raw) as CustomWorkoutConfig) : null;
  } catch {
    return null;
  }
};

export const saveCustomWorkout = (cfg: CustomWorkoutConfig) => {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(cfg));
};

export const buildCustomRoutine = (cfg: CustomWorkoutConfig): Routine | null => {
  const exercises = cfg.exerciseIds
    .map((id) => getCatalogExercise(id))
    .filter((e): e is CatalogExercise => Boolean(e));
  if (exercises.length === 0) return null;

  const round: Block[] = [];
  exercises.forEach((ex, i) => {
    round.push({ type: "exercise", exercise: ex });
    if (i < exercises.length - 1) round.push(restShort(cfg.restBetween));
  });

  const blocks: Block[] = [];
  for (let r = 0; r < cfg.rounds; r++) {
    if (r > 0) blocks.push(restLong(cfg.restRound));
    blocks.push(...round);
  }

  // Rough duration estimate
  const totalSec = blocks.reduce(
    (acc, b) => acc + (b.type === "rest" ? b.duration : b.exercise.duration ?? 30),
    0
  );

  return {
    id: cfg.id,
    name: cfg.name,
    tagline: `Custom · ${exercises.length} ex · ${cfg.rounds} rounds`,
    totalMinutes: Math.max(1, Math.round(totalSec / 60)),
    accent: "cyan",
    blocks,
  };
};

export const getRoutine = (id: string): Routine | undefined => {
  const found = routines.find((r) => r.id === id);
  if (found) return found;
  if (id === "custom") {
    const cfg = loadCustomWorkout();
    if (cfg) return buildCustomRoutine(cfg) ?? undefined;
  }
  return undefined;
};
