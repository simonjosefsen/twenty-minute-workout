import type { ExerciseKind } from "@/data/routines";

type Props = { kind: ExerciseKind; size?: number };

/**
 * Animated SVG figure for each exercise. Pure CSS keyframe animations
 * defined in index.css. Uses currentColor for theming.
 */
export const ExerciseAnimation = ({ kind, size = 220 }: Props) => {
  const stroke = "hsl(var(--primary))";
  const body = "hsl(var(--foreground))";
  const muted = "hsl(var(--muted-foreground))";

  // Floor line + sun, shared backdrop
  const Floor = () => (
    <>
      <circle cx="160" cy="40" r="22" fill="hsl(var(--primary) / 0.18)" />
      <line x1="10" y1="180" x2="310" y2="180" stroke={muted} strokeWidth="2" strokeDasharray="4 6" />
    </>
  );

  const head = (cx: number, cy: number, r = 14) => (
    <circle cx={cx} cy={cy} r={r} fill={body} />
  );

  return (
    <svg
      viewBox="0 0 320 200"
      width={size}
      height={size * 0.625}
      className="drop-shadow-[0_10px_30px_rgba(198,255,61,0.15)]"
    >
      <Floor />
      {kind === "squat" && (
        <g style={{ animation: "squat 1.4s ease-in-out infinite", transformOrigin: "160px 180px" }}>
          {head(160, 70)}
          <line x1="160" y1="84" x2="160" y2="125" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="160" y1="125" x2="140" y2="160" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="160" y1="125" x2="180" y2="160" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="140" y1="160" x2="140" y2="180" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="180" y1="160" x2="180" y2="180" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="160" y1="100" x2="135" y2="115" stroke={body} strokeWidth="5" strokeLinecap="round" />
          <line x1="160" y1="100" x2="185" y2="115" stroke={body} strokeWidth="5" strokeLinecap="round" />
          <rect x="148" y="108" width="24" height="16" rx="3" fill={stroke} />
        </g>
      )}

      {kind === "swing" && (
        <g>
          {head(160, 60)}
          <line x1="160" y1="74" x2="160" y2="130" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="160" y1="130" x2="142" y2="170" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="160" y1="130" x2="178" y2="170" stroke={body} strokeWidth="6" strokeLinecap="round" />
          {/* swinging arm + KB */}
          <g style={{ transformOrigin: "160px 90px", animation: "swing 1.2s ease-in-out infinite" }}>
            <line x1="160" y1="90" x2="160" y2="150" stroke={body} strokeWidth="5" strokeLinecap="round" />
            <circle cx="160" cy="160" r="12" fill={stroke} />
            <rect x="155" y="146" width="10" height="8" fill={body} />
          </g>
        </g>
      )}

      {kind === "pushup" && (
        <g style={{ animation: "pushup 1.4s ease-in-out infinite", transformOrigin: "160px 150px" }}>
          {head(90, 130)}
          <line x1="100" y1="135" x2="240" y2="155" stroke={body} strokeWidth="8" strokeLinecap="round" />
          <line x1="120" y1="138" x2="115" y2="170" stroke={body} strokeWidth="5" strokeLinecap="round" />
          <line x1="220" y1="152" x2="225" y2="175" stroke={body} strokeWidth="5" strokeLinecap="round" />
          <line x1="115" y1="170" x2="225" y2="175" stroke={muted} strokeWidth="2" />
        </g>
      )}

      {kind === "plank" && (
        <g style={{ animation: "plank-breath 2s ease-in-out infinite", transformOrigin: "160px 150px" }}>
          {head(80, 130)}
          <line x1="92" y1="135" x2="240" y2="155" stroke={body} strokeWidth="8" strokeLinecap="round" />
          <line x1="105" y1="138" x2="100" y2="170" stroke={body} strokeWidth="5" strokeLinecap="round" />
          <line x1="225" y1="152" x2="235" y2="175" stroke={body} strokeWidth="5" strokeLinecap="round" />
        </g>
      )}

      {kind === "lunge" && (
        <g style={{ animation: "lunge 1.6s ease-in-out infinite" }}>
          {head(140, 70)}
          <line x1="140" y1="84" x2="150" y2="125" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="150" y1="125" x2="120" y2="155" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="120" y1="155" x2="115" y2="180" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="150" y1="125" x2="195" y2="155" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="195" y1="155" x2="195" y2="180" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="150" y1="100" x2="125" y2="115" stroke={body} strokeWidth="5" strokeLinecap="round" />
          <line x1="150" y1="100" x2="170" y2="115" stroke={body} strokeWidth="5" strokeLinecap="round" />
        </g>
      )}

      {kind === "jumpingJack" && (
        <g style={{ animation: "jump 0.6s ease-in-out infinite", transformOrigin: "160px 180px" }}>
          {head(160, 60)}
          <line x1="160" y1="74" x2="160" y2="130" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="160" y1="85" x2="120" y2="60" stroke={body} strokeWidth="5" strokeLinecap="round" />
          <line x1="160" y1="85" x2="200" y2="60" stroke={body} strokeWidth="5" strokeLinecap="round" />
          <line x1="160" y1="130" x2="135" y2="175" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="160" y1="130" x2="185" y2="175" stroke={body} strokeWidth="6" strokeLinecap="round" />
        </g>
      )}

      {kind === "ropeJump" && (
        <g>
          <g style={{ animation: "jump 0.5s ease-in-out infinite", transformOrigin: "160px 180px" }}>
            {head(160, 70)}
            <line x1="160" y1="84" x2="160" y2="135" stroke={body} strokeWidth="6" strokeLinecap="round" />
            <line x1="160" y1="100" x2="138" y2="120" stroke={body} strokeWidth="5" strokeLinecap="round" />
            <line x1="160" y1="100" x2="182" y2="120" stroke={body} strokeWidth="5" strokeLinecap="round" />
            <line x1="160" y1="135" x2="150" y2="170" stroke={body} strokeWidth="6" strokeLinecap="round" />
            <line x1="160" y1="135" x2="170" y2="170" stroke={body} strokeWidth="6" strokeLinecap="round" />
          </g>
          <g style={{ transformOrigin: "160px 110px", animation: "rope 0.5s ease-in-out infinite" }}>
            <path d="M 138 120 Q 160 30 182 120" stroke={stroke} strokeWidth="3" fill="none" />
          </g>
        </g>
      )}

      {kind === "row" && (
        <g>
          {head(110, 80)}
          <line x1="118" y1="92" x2="180" y2="115" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="180" y1="115" x2="200" y2="155" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="200" y1="155" x2="200" y2="180" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="180" y1="115" x2="160" y2="155" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="160" y1="155" x2="160" y2="180" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <g style={{ animation: "row 1.2s ease-in-out infinite" }}>
            <line x1="150" y1="105" x2="170" y2="150" stroke={body} strokeWidth="5" strokeLinecap="round" />
            <circle cx="170" cy="155" r="11" fill={stroke} />
          </g>
        </g>
      )}

      {kind === "twist" && (
        <g>
          {head(160, 95)}
          <line x1="160" y1="108" x2="160" y2="155" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="160" y1="155" x2="135" y2="178" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="160" y1="155" x2="185" y2="178" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <g style={{ transformOrigin: "160px 120px", animation: "twist 1.2s ease-in-out infinite" }}>
            <line x1="135" y1="125" x2="185" y2="125" stroke={body} strokeWidth="5" strokeLinecap="round" />
            <circle cx="195" cy="125" r="10" fill={stroke} />
          </g>
        </g>
      )}

      {kind === "crunch" && (
        <g>
          <line x1="120" y1="170" x2="220" y2="170" stroke={muted} strokeWidth="2" />
          <g style={{ transformOrigin: "210px 165px", animation: "crunch 1.3s ease-in-out infinite" }}>
            {head(140, 150)}
            <line x1="150" y1="155" x2="210" y2="165" stroke={body} strokeWidth="7" strokeLinecap="round" />
          </g>
          <line x1="210" y1="165" x2="240" y2="135" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="240" y1="135" x2="265" y2="170" stroke={body} strokeWidth="6" strokeLinecap="round" />
        </g>
      )}

      {kind === "deadlift" && (
        <g style={{ animation: "deadlift 1.4s ease-in-out infinite", transformOrigin: "160px 180px" }}>
          {head(160, 70)}
          <line x1="160" y1="84" x2="155" y2="130" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="155" y1="130" x2="140" y2="175" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="155" y1="130" x2="175" y2="175" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="160" y1="100" x2="155" y2="145" stroke={body} strokeWidth="5" strokeLinecap="round" />
          <circle cx="155" cy="155" r="12" fill={stroke} />
        </g>
      )}

      {kind === "stretch" && (
        <g style={{ animation: "stretch 2s ease-in-out infinite", transformOrigin: "160px 150px" }}>
          {head(130, 95)}
          <line x1="138" y1="105" x2="170" y2="140" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="170" y1="140" x2="140" y2="175" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="170" y1="140" x2="210" y2="175" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="138" y1="115" x2="105" y2="90" stroke={body} strokeWidth="5" strokeLinecap="round" />
          <line x1="138" y1="115" x2="170" y2="80" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
        </g>
      )}

      {kind === "shoulderTap" && (
        <g>
          {head(80, 130)}
          <line x1="92" y1="135" x2="240" y2="155" stroke={body} strokeWidth="8" strokeLinecap="round" />
          <line x1="225" y1="152" x2="235" y2="175" stroke={body} strokeWidth="5" strokeLinecap="round" />
          <g style={{ transformOrigin: "110px 138px", animation: "twist 1s ease-in-out infinite" }}>
            <line x1="110" y1="138" x2="135" y2="120" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
          </g>
        </g>
      )}

      {kind === "halo" && (
        <g>
          {head(160, 80)}
          <line x1="160" y1="94" x2="160" y2="145" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="160" y1="145" x2="140" y2="180" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <line x1="160" y1="145" x2="180" y2="180" stroke={body} strokeWidth="6" strokeLinecap="round" />
          <g style={{ transformOrigin: "160px 80px", animation: "swing 2s linear infinite" }}>
            <circle cx="190" cy="80" r="11" fill={stroke} />
          </g>
        </g>
      )}

      {kind === "march" && (
        <g>
          {head(160, 60)}
          <line x1="160" y1="74" x2="160" y2="130" stroke={body} strokeWidth="6" strokeLinecap="round" />
          {/* arms swinging opposite */}
          <g style={{ transformOrigin: "160px 90px", animation: "march-r 0.7s ease-in-out infinite" }}>
            <line x1="160" y1="90" x2="160" y2="125" stroke={body} strokeWidth="5" strokeLinecap="round" />
          </g>
          <g style={{ transformOrigin: "160px 90px", animation: "march-l 0.7s ease-in-out infinite" }}>
            <line x1="160" y1="90" x2="160" y2="125" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
          </g>
          {/* legs lifting alternating */}
          <g style={{ transformOrigin: "160px 130px", animation: "march-l 0.7s ease-in-out infinite" }}>
            <line x1="160" y1="130" x2="160" y2="178" stroke={body} strokeWidth="6" strokeLinecap="round" />
          </g>
          <g style={{ transformOrigin: "160px 130px", animation: "march-r 0.7s ease-in-out infinite" }}>
            <line x1="160" y1="130" x2="160" y2="178" stroke={body} strokeWidth="6" strokeLinecap="round" />
          </g>
        </g>
      )}

      {kind === "catCow" && (
        <g style={{ animation: "cat-cow 2s ease-in-out infinite", transformOrigin: "180px 150px" }}>
          {head(120, 130)}
          {/* back as arched line */}
          <path d="M 130 135 Q 180 120 230 140" stroke={body} strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* front arms */}
          <line x1="135" y1="138" x2="138" y2="175" stroke={body} strokeWidth="5" strokeLinecap="round" />
          {/* back legs */}
          <line x1="225" y1="142" x2="228" y2="175" stroke={body} strokeWidth="5" strokeLinecap="round" />
          <line x1="138" y1="175" x2="228" y2="175" stroke={muted} strokeWidth="2" />
        </g>
      )}
    </svg>
  );
};

export default ExerciseAnimation;
