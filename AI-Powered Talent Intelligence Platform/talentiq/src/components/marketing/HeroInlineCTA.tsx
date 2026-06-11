import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroInlineCTAProps {
  href?: string;
  className?: string;
}

export default function HeroInlineCTA({
  href = "/register",
  className = '',
}: HeroInlineCTAProps) {
  return (
    <Link
      href={href}
      className={cn(
        "ml-3 inline-flex items-center gap-[6px] px-3 py-1.5 rounded-full bg-accent-50 border border-accent-100 text-[14px] md:text-[16px] font-semibold text-accent-600 align-middle shadow-sm hover:shadow-md transition-all cursor-pointer group",
        className,
      )}
    >
      Start Free Trial
      <ArrowRight className="w-3.5 h-3.5" />
    </Link>
  );
}
