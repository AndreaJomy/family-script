/*
 * "Record & discover stories that matter"
 * Centered at y=289 of the 1512 x 982 stage, 365px wide so it breaks
 * onto two lines exactly like the design.
 */
export default function AuthHeading() {
  return (
    <h1
      className="absolute left-1/2 top-[289px] w-[min(390px,calc(100vw-48px))] -translate-x-1/2 -translate-y-1/2 text-center text-[52px] font-medium leading-[1.08]"
      style={{ fontFamily: '"futura-pt", "Futura", sans-serif' }}
    >
      <span className="text-warm-beige">Record &amp; discover</span>{" "}
      <span className="text-soft-ivory">stories that matter</span>
    </h1>
  );
}
