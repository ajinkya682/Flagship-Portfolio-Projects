"use client";

import { Users, UserCheck, BarChart2, Star, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import PersonaCard from "./PersonaCard";

export default function PersonasSection() {
  const personas = [
    {
      icon: Users,
      iconColor: "#3B58F6", // Brand Blue
      iconBg: "#EFF6FF",
      title: "Recruiters",
      pain: "Before TalentOS: drowning in 400+ resumes per role.",
      solution: "Now: score, rank, and explain automatically.",
      bullets: [
        "Score every applicant in seconds",
        "Filter by match, not just keywords",
        "Spend time on the top 10% only",
      ],
    },
    {
      icon: UserCheck,
      iconColor: "#10B981", // Emerald
      iconBg: "#ECFDF5",
      title: "Hiring Managers",
      pain: "Before TalentOS: guessing which candidates matter.",
      solution: "Now: see data-backed recommendations.",
      bullets: [
        "Understand why each score was given",
        "Compare finalists side-by-side",
        "Submit scorecards from one place",
      ],
    },
    {
      icon: BarChart2,
      iconColor: "#8B5CF6", // Purple
      iconBg: "#F5F3FF",
      title: "HR Leaders",
      pain: "Before TalentOS: no visibility until it was too late.",
      solution: "Now: full pipeline analytics in real-time.",
      bullets: [
        "Track team performance and speed",
        "Identify bottlenecks before they compound",
        "Prove ROI on every open role",
      ],
    },
    {
      icon: Star,
      iconColor: "#F59E0B", // Amber
      iconBg: "#FFFBEB",
      title: "Candidates",
      pain: "Before TalentOS: applying blind and hearing nothing.",
      solution: "Now: tracked and notified at every stage.",
      bullets: [
        "Real-time application status",
        "Professional application portal",
        "Clear communication at every step",
      ],
    },
  ];

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Delay between each card animating in
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="bg-[#FAFAFA] py-20 md:py-28 lg:py-32 relative overflow-hidden">
      {/* Subtle Ambient Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] md:w-[1000px] h-[400px] md:h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3B58F6]/10 via-transparent to-transparent blur-[100px] pointer-events-none z-0" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-10 relative z-10">
        {/* Animated Header Section */}
        <motion.div
          className="max-w-[700px] mx-auto text-center flex flex-col items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          {/* Premium Badge Pill */}
          <div className="inline-flex items-center gap-2 h-8 bg-white border border-neutral-200/80 rounded-full px-3.5 shadow-sm mb-6">
            <Briefcase className="w-3.5 h-3.5 text-[#3B58F6]" />
            <span className="font-body text-[11px] md:text-[12px] font-bold text-neutral-600 tracking-wider uppercase">
              Built for your whole team
            </span>
          </div>

          <h2 className="font-display text-[32px] md:text-[40px] lg:text-[48px] font-extrabold text-[#0A101D] mt-2 leading-[1.15] tracking-tight">
            One platform, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B58F6] to-[#8B5CF6]">
              every perspective.
            </span>
          </h2>

          <p className="font-body text-[16px] md:text-[18px] lg:text-[20px] text-neutral-600 mt-5 md:mt-6 leading-relaxed max-w-[600px]">
            TalentOS gives everyone exactly what they need to hire faster, from
            high-level pipeline analytics down to the candidate portal.
          </p>
        </motion.div>

        {/* Fully Responsive Grid 
          - Mobile: 1 column
          - Tablet: 2 columns
          - Desktop: 4 columns
        */}
        <motion.div
          className="mt-16 md:mt-20 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {personas.map((p, i) => (
            <motion.div key={i} variants={itemVariants} className="h-full">
              <PersonaCard {...p} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
