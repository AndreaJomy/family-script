import Link from "next/link";

export default function ResetPasswordSuccess() {
  return (
    <div className="pointer-events-auto absolute left-1/2 top-[365px] flex w-[min(405px,calc(100vw-48px))] -translate-x-1/2 flex-col gap-5 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-[#d9efc2] text-[30px] text-[#d9efc2]" aria-hidden="true">
        ✓
      </div>
      <h2 className="futura-light text-[22px] text-soft-ivory">Password updated</h2>
      <p className="futura-light text-[16px] leading-6 text-soft-ivory/85">
        Your password was changed successfully. You can now log in with your new password.
      </p>
      <Link
        href="/sign-in"
        className="futura-light flex h-12 items-center justify-center rounded-full bg-soft-ivory text-[16px] text-dark-burgundy hover:opacity-90 focus-visible:ring-2 focus-visible:ring-antique-gold"
      >
        Return to login
      </Link>
    </div>
  );
}
