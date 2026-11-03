import { ResetPasswordForm, Stage } from "@/app/components/auth";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <Stage>
        <div className="pointer-events-auto absolute left-1/2 top-[365px] w-[min(405px,calc(100vw-48px))] -translate-x-1/2 text-center">
          <h2 className="futura-light text-[22px] text-soft-ivory">Invalid reset link</h2>
          <p className="futura-light mt-4 text-[16px] leading-6 text-soft-ivory/85">
            This password reset link is missing or invalid.
          </p>
        </div>
      </Stage>
    );
  }

  return (
    <Stage>
      <ResetPasswordForm token={token} />
    </Stage>
  );
}
