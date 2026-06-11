import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-[24px] text-center">
      <h1 className="font-display text-[80px] md:text-[120px] font-extrabold text-primary-500 leading-none">
        404
      </h1>
      <h2 className="font-display text-[24px] md:text-[32px] font-bold text-neutral-900 mt-[16px]">
        Page not found
      </h2>
      <p className="font-body text-[14px] md:text-[16px] text-neutral-600 mt-[12px] max-w-[400px]">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might
        have been moved or deleted.
      </p>

      <Link
        href="/"
        className="mt-[32px] h-[48px] px-[32px] bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg flex items-center justify-center transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
