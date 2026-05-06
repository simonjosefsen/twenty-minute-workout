## Test: brug uploadet billede som ikon for KB Swing

Minimal ændring – kun til test på én øvelse.

### Ændringer

1. **Kopier billedet** fra `user-uploads://kettlebell-swing.png` til `src/assets/exercises/kb-swing.png`.

2. **`src/data/routines.ts`**
   - Tilføj `image?: string` til `Exercise`-typen.
   - På `kb-swing` (begge steder: i Full Body-routinen ~line 52 og i `exerciseCatalog` ~line 166), tilføj `image: "/src/assets/exercises/kb-swing.png"` via en import-reference (importér billedet øverst og brug variablen).

3. **`src/components/ExerciseAnimation.tsx`**
   - Udvid props: `image?: string`.
   - Hvis `image` er sat, render `<img src={image} />` (kvadratisk, samme `size`, `rounded-2xl`, `object-cover`) i stedet for SVG. Ellers uændret animation (fallback bevares som ønsket).

4. **`src/pages/Workout.tsx` + `src/pages/Preview.tsx`**
   - Send `image={block.exercise.image}` / `image={ex.image}` med til `<ExerciseAnimation />`.

### Hvad ændres ikke
- Ingen øvrige øvelser røres.
- Ingen animationer fjernes.
- Ingen logik, timer, EMOM, IDs, equipment eller kategorier ændres.

Resultat: KB Swing viser dit uploadede billede; alle andre øvelser ser ud som før. Når du har set det og er tilfreds, uploader du de resterende ~34 billeder, og jeg kører samme mønster for dem.