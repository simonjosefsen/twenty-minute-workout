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

export type ExerciseCategory = "static" | "cardio" | "strength" | "postpartum";

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

const buildRounds = (round: Block[], n = 3): Block[] => {
  const out: Block[] = [];
  for (let i = 0; i < n; i++) {
    if (i > 0) out.push(restLong(60));
    out.push(...round);
  }
  return out;
};

export const routines: Routine[] = [
  {
    id: "full-body",
    name: "Full Body Power",
    tagline: "Kettlebell · Mat · 20 min",
    totalMinutes: 20,
    accent: "lime",
    blocks: buildRounds(fullBodyRound),
  },
  {
    id: "core-cond",
    name: "Core & Conditioning",
    tagline: "Rope · Kettlebell · 20 min",
    totalMinutes: 20,
    accent: "cyan",
    blocks: buildRounds(coreRound),
  },
  {
    id: "mobility",
    name: "Mobility & Strength",
    tagline: "Mat · Kettlebell · 20 min",
    totalMinutes: 20,
    accent: "amber",
    blocks: buildRounds(mobilityRound),
  },
  {
    id: "emom-15-full-body",
    name: "EMOM 15 – Daily CrossFit (no equipment)",
    tagline: "Bodyweight · 15 min · 3 rounds",
    totalMinutes: 15,
    accent: "lime",
    blocks: (() => {
      const round: Block[] = [
        { type: "exercise", exercise: { id: "emom-fb-squat", name: "Squats (20 reps)", kind: "squat", duration: 60, cue: "Complete 20 reps, then rest the remainder of the minute.", equipment: "—" } },
        { type: "exercise", exercise: { id: "emom-fb-pushup", name: "Push-ups (12–15 reps)", kind: "pushup", duration: 60, cue: "Complete 12–15 reps, then rest the remainder of the minute.", equipment: "—" } },
        { type: "exercise", exercise: { id: "emom-fb-lunge", name: "Reverse Lunges (20 reps total)", kind: "lunge", duration: 60, cue: "20 reps total, alternating legs. Rest the remainder of the minute.", equipment: "—" } },
        { type: "exercise", exercise: { id: "emom-fb-ab", name: "Bent Knee Ab (15–20 reps)", kind: "crunch", duration: 60, cue: "Complete 15–20 reps, then rest the remainder of the minute.", equipment: "Mat" } },
        { type: "exercise", exercise: { id: "emom-fb-burpee", name: "Burpees (8–12 reps)", kind: "generic", duration: 60, cue: "Complete 8–12 reps, then rest the remainder of the minute.", equipment: "—" } },
      ];
      const out: Block[] = [];
      for (let i = 0; i < 3; i++) out.push(...round);
      return out;
    })(),
  },
  {
    id: "emom-15",
    name: "EMOM 15 – No Equipment",
    tagline: "Bodyweight · 15 min · 5 rounds",
    totalMinutes: 15,
    accent: "amber",
    blocks: (() => {
      const round: Block[] = [
        { type: "exercise", exercise: { id: "emom-pushup", name: "Push-ups (12 reps)", kind: "pushup", duration: 60, cue: "Complete 12 reps, then rest the remainder of the minute.", equipment: "—" } },
        { type: "exercise", exercise: { id: "emom-squat", name: "Air Squats (20 reps)", kind: "squat", duration: 60, cue: "Complete 20 reps, then rest the remainder of the minute.", equipment: "—" } },
        { type: "exercise", exercise: { id: "emom-situp", name: "Sit-ups (15 reps)", kind: "generic", duration: 60, cue: "Complete 15 reps, then rest the remainder of the minute.", equipment: "Mat" } },
      ];
      const out: Block[] = [];
      for (let i = 0; i < 5; i++) out.push(...round);
      return out;
    })(),
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

  // ---- Postpartum (gentle, no equipment, no jumping) ----
  { id: "pp-deep-breathing", name: "Deep Breathing", kind: "generic", duration: 45, cue: "Lie on your back with bent knees. Breathe slowly into your belly and gently activate your core on the exhale.", equipment: "—", category: "postpartum" },
  { id: "pp-pelvic-tilts", name: "Pelvic Tilts", kind: "generic", reps: 10, cue: "Lie on your back with bent knees. Slowly tilt your pelvis to gently flatten your lower back into the floor, then release.", equipment: "—", category: "postpartum" },
  { id: "pp-glute-bridge", name: "Glute Bridge", kind: "generic", reps: 10, cue: "Lie on your back with bent knees. Press through your feet and lift your hips, then lower slowly.", equipment: "—", category: "postpartum" },
  { id: "pp-heel-slides", name: "Heel Slides", kind: "generic", reps: 10, cue: "Lie on your back with bent knees. Slowly slide one heel away from you, then bring it back. Switch sides.", equipment: "—", category: "postpartum" },
  { id: "pp-bird-dog", name: "Bird Dog", kind: "generic", reps: 10, cue: "Start on hands and knees. Extend opposite arm and leg while keeping your hips stable.", equipment: "—", category: "postpartum" },
  { id: "pp-dead-bug", name: "Dead Bug", kind: "generic", reps: 10, cue: "Lie on your back with arms and legs raised. Slowly lower opposite arm and leg while keeping your lower back supported.", equipment: "—", category: "postpartum" },
  { id: "pp-side-leg-lift", name: "Side-Lying Leg Lift", kind: "generic", reps: 12, cue: "Lie on your side and slowly lift the top leg, then lower with control.", equipment: "—", category: "postpartum" },
  { id: "pp-cat-cow", name: "Cat-Cow Stretch", kind: "catCow", duration: 45, cue: "Start on hands and knees. Slowly round and arch your back with your breath.", equipment: "—", category: "postpartum" },
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

// ---- Saved (named) custom workouts library ----
const SAVED_KEY = "pulse.customs.v1";

export const loadSavedCustomWorkouts = (): CustomWorkoutConfig[] => {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? (JSON.parse(raw) as CustomWorkoutConfig[]) : [];
  } catch {
    return [];
  }
};

export const saveSavedCustomWorkouts = (list: CustomWorkoutConfig[]) => {
  localStorage.setItem(SAVED_KEY, JSON.stringify(list));
};

export const addSavedCustomWorkout = (cfg: CustomWorkoutConfig): CustomWorkoutConfig => {
  const list = loadSavedCustomWorkouts();
  // Replace existing with same id, otherwise prepend
  const idx = list.findIndex((c) => c.id === cfg.id);
  if (idx >= 0) list[idx] = cfg;
  else list.unshift(cfg);
  saveSavedCustomWorkouts(list);
  return cfg;
};

export const deleteSavedCustomWorkout = (id: string) => {
  const list = loadSavedCustomWorkouts().filter((c) => c.id !== id);
  saveSavedCustomWorkouts(list);
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

// ---- Session-only exercise order override (cleared on reload) ----
const SESSION_ORDER_PREFIX = "pulse.session-order.";

export const setSessionExerciseOrder = (routineId: string, exerciseIds: string[]) => {
  try {
    sessionStorage.setItem(SESSION_ORDER_PREFIX + routineId, JSON.stringify(exerciseIds));
  } catch {
    // ignore
  }
};

export const clearSessionExerciseOrder = (routineId: string) => {
  try {
    sessionStorage.removeItem(SESSION_ORDER_PREFIX + routineId);
  } catch {
    // ignore
  }
};

const loadSessionExerciseOrder = (routineId: string): string[] | null => {
  try {
    const raw = sessionStorage.getItem(SESSION_ORDER_PREFIX + routineId);
    return raw ? (JSON.parse(raw) as string[]) : null;
  } catch {
    return null;
  }
};

/**
 * Reorder a routine's exercise blocks per round to match the given exercise id order.
 * Rest blocks remain in place. The order list represents one round of exercises.
 */
const applyExerciseOrder = (routine: Routine, order: string[]): Routine => {
  // Split blocks into rounds by "Round break"
  const rounds: Block[][] = [[]];
  routine.blocks.forEach((b) => {
    if (b.type === "rest" && b.label === "Round break") {
      rounds.push([]);
    } else {
      rounds[rounds.length - 1].push(b);
    }
  });

  const reorderedRounds = rounds.map((round) => {
    const exercises = round.filter((b): b is Extract<Block, { type: "exercise" }> => b.type === "exercise");
    const byId = new Map(exercises.map((e) => [e.exercise.id, e]));
    const newExercises: typeof exercises = [];
    order.forEach((id) => {
      const found = byId.get(id);
      if (found) newExercises.push(found);
    });
    // Append any exercises not in order list (safety)
    exercises.forEach((e) => {
      if (!order.includes(e.exercise.id)) newExercises.push(e);
    });
    // Rebuild round: walk original, replacing exercises sequentially with newExercises
    let ei = 0;
    return round.map((b) => (b.type === "exercise" ? newExercises[ei++] ?? b : b));
  });

  const blocks: Block[] = [];
  reorderedRounds.forEach((r, i) => {
    if (i > 0) blocks.push({ type: "rest", duration: 60, label: "Round break" });
    blocks.push(...r);
  });

  return { ...routine, blocks };
};

export const getRoutine = (id: string): Routine | undefined => {
  let routine: Routine | undefined;
  const found = routines.find((r) => r.id === id);
  if (found) routine = found;
  else if (id === "custom") {
    const cfg = loadCustomWorkout();
    if (cfg) routine = buildCustomRoutine(cfg) ?? undefined;
  } else if (id.startsWith("custom-")) {
    const cfg = loadSavedCustomWorkouts().find((c) => c.id === id);
    if (cfg) routine = buildCustomRoutine(cfg) ?? undefined;
  }
  if (!routine) return undefined;

  const order = loadSessionExerciseOrder(id);
  if (order && order.length > 0) {
    return applyExerciseOrder(routine, order);
  }
  return routine;
};

