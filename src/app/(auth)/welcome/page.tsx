import { JoinOptionCard, Stage } from "@/app/components/auth";

/* ============================================================
   WELCOME SCREEN   (/welcome)

   Figma: FS_Website_Wireframing -> Welcome Screen (1303:982)
============================================================ */

export default function WelcomePage() {
  return (
    <Stage>
      {/* "Select how you'd like to join and get started." */}
      <p className="futura-light absolute left-1/2 top-[376px] w-[min(403px,calc(100vw-48px))] -translate-x-1/2 -translate-y-1/2 text-center text-[22px] leading-7 text-antique-gold">
        Select how you&rsquo;d like to join and get started.
      </p>

      {/* Three cards, 240px wide, 30px apart, centered. */}
      <div className="absolute left-1/2 top-[514px] flex -translate-x-1/2 items-center gap-[30px]" role="list">
        <JoinOptionCard
          type="family"
          title="FAMILY"
          description="Bring your family closer"
        />
        <JoinOptionCard
          type="friends"
          title="FRIENDS"
          description="Stay connected with your people"
        />
        <JoinOptionCard
          type="institution"
          title="INSTITUTION"
          description="Connect with your community"
        />
      </div>
    </Stage>
  );
}
