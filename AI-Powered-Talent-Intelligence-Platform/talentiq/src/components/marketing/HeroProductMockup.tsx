import Image from "next/image";

export default function HeroProductMockup() {
  return (
    <div className="relative w-full rounded-[24px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-neutral-200/60 overflow-hidden transform transition-all duration-500 hover:duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] bg-white group">
      {/* Light Sheen Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none z-10" />

      {/* Product Image */}
      <Image
        src="/images/hero-product.png"
        alt="TalentIQ Dashboard"
        width={1200}
        height={850}
        priority
        className="w-full h-auto object-contain block relative z-0"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
