"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ArrowRight,
  Menu,
  Building2,
  TrendingUp,
  Briefcase,
  Users,
} from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import MobileDrawer from "./MobileDrawer";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function MarketingNav() {
  const pathname = usePathname() || "";
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const lastScrollY = useRef(0);

  // Helper function to check if a link is active
  const isActive = (path: any) =>
    pathname === path || pathname.startsWith(`${path}/`);

  const isSolutionsActive = ['/startups', '/scaling', '/enterprise', '/agencies'].some(path => isActive(path));

  useEffect(() => {
    if (typeof window !== "undefined") {
      lastScrollY.current = window.scrollY;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>

      {/* Edge-to-Edge Full Width Container */}
      <header
        className={cn(
          "fixed top-0 left-0 w-full z-[100] transition-all duration-400 ease-in-out",
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-neutral-200/60 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]"
            : "bg-transparent",
          isVisible ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <nav className="max-w-[1200px] mx-auto px-6 md:px-10 h-20 flex justify-between items-center transition-all duration-300">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center group select-none">
            <div className="font-display text-[22px] md:text-[26px] font-extrabold tracking-tight text-[#0A101D] flex items-baseline transition-all duration-300 group-hover:opacity-80">
              Talent
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B58F6] to-[#8B5CF6]">
                IQ
              </span>
              {/* Premium glowing dot to give it a "tech startup" feel */}
              <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#10B981] ml-0.5 md:ml-1 mb-0.5 shadow-[0_0_10px_rgba(16,185,129,0.6)] transition-transform duration-300 group-hover:scale-110" />
            </div>
          </Link>
          {/* Center: Desktop Links with Dynamic Active States */}
          <div className="hidden lg:flex items-center gap-9">
            {/* Features Link */}
            <Link
              href="/features"
              className={cn(
                "relative font-body text-[15px] font-medium transition-colors hover:text-[#3B58F6]",
                isActive("/features") ? "text-[#3B58F6]" : "text-neutral-600",
              )}
            >
              Features
              {isActive("/features") && (
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#3B58F6] rounded-full shadow-[0_0_8px_rgba(59,88,246,0.6)] animate-in fade-in zoom-in duration-300" />
              )}
            </Link>

            {/* Solutions Dropdown */}
            <Popover.Root>
              <Popover.Trigger
                className={cn(
                  "group relative font-body text-[15px] flex items-center gap-1.5 focus-visible:outline-none transition-colors hover:text-[#3B58F6]",
                  isSolutionsActive
                    ? "text-[#3B58F6] font-semibold"
                    : "text-neutral-600 font-medium",
                )}
                aria-haspopup="menu"
              >
                Solutions
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180",
                    isSolutionsActive
                      ? "text-[#3B58F6]"
                      : "text-neutral-400 group-hover:text-[#3B58F6]",
                  )}
                />
                {isSolutionsActive && (
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#3B58F6] rounded-full shadow-[0_0_8px_rgba(59,88,246,0.6)] animate-in fade-in zoom-in duration-300" />
                )}
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="min-w-[280px] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-3 border border-neutral-100 z-[100] mt-5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
                  sideOffset={0}
                >
                  <Link
                    href="/startups"
                    className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-neutral-50 transition-colors group/item"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover/item:bg-blue-100 transition-colors">
                      <Building2 className="w-5 h-5 text-[#3B58F6]" />
                    </div>
                    <div className="flex flex-col justify-center h-10">
                      <div className="text-[14px] font-bold text-neutral-900 leading-none mb-1">
                        Startups
                      </div>
                      <div className="text-[13px] text-neutral-500 leading-none">
                        Build strong foundations
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/scaling"
                    className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-neutral-50 transition-colors group/item"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center group-hover/item:bg-emerald-100 transition-colors">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="flex flex-col justify-center h-10">
                      <div className="text-[14px] font-bold text-neutral-900 leading-none mb-1">
                        Scaling Teams
                      </div>
                      <div className="text-[13px] text-neutral-500 leading-none">
                        Hire faster as you grow
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/enterprise"
                    className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-neutral-50 transition-colors group/item"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center group-hover/item:bg-purple-100 transition-colors">
                      <Briefcase className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="flex flex-col justify-center h-10">
                      <div className="text-[14px] font-bold text-neutral-900 leading-none mb-1">
                        Enterprise
                      </div>
                      <div className="text-[13px] text-neutral-500 leading-none">
                        Advanced security & control
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/agencies"
                    className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-neutral-50 transition-colors group/item"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center group-hover/item:bg-amber-100 transition-colors">
                      <Users className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex flex-col justify-center h-10">
                      <div className="text-[14px] font-bold text-neutral-900 leading-none mb-1">
                        Agencies
                      </div>
                      <div className="text-[13px] text-neutral-500 leading-none">
                        Manage multiple clients
                      </div>
                    </div>
                  </Link>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            {/* Pricing Link */}
            <Link
              href="/pricing"
              className={cn(
                "relative font-body text-[15px] font-medium transition-colors hover:text-[#3B58F6]",
                isActive("/pricing") ? "text-[#3B58F6]" : "text-neutral-600",
              )}
            >
              Pricing
              {isActive("/pricing") && (
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#3B58F6] rounded-full shadow-[0_0_8px_rgba(59,88,246,0.6)] animate-in fade-in zoom-in duration-300" />
              )}
            </Link>

            {/* Customers Link */}
            <Link
              href="/customers"
              className={cn(
                "relative font-body text-[15px] font-medium transition-colors hover:text-[#3B58F6]",
                isActive("/customers") ? "text-[#3B58F6]" : "text-neutral-600",
              )}
            >
              Customers
              {isActive("/customers") && (
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#3B58F6] rounded-full shadow-[0_0_8px_rgba(59,88,246,0.6)] animate-in fade-in zoom-in duration-300" />
              )}
            </Link>

            {/* Resources Link */}
            <Link
              href="/resources"
              className={cn(
                "relative font-body text-[15px] font-medium transition-colors hover:text-[#3B58F6]",
                isActive("/resources") ? "text-[#3B58F6]" : "text-neutral-600",
              )}
            >
              Resources
              {isActive("/resources") && (
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#3B58F6] rounded-full shadow-[0_0_8px_rgba(59,88,246,0.6)] animate-in fade-in zoom-in duration-300" />
              )}
            </Link>

            {/* Contact Link */}
            <Link
              href="/contact"
              className={cn(
                "relative font-body text-[15px] font-medium transition-colors hover:text-[#3B58F6]",
                isActive("/contact") ? "text-[#3B58F6]" : "text-neutral-600",
              )}
            >
              Contact
              {isActive("/contact") && (
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#3B58F6] rounded-full shadow-[0_0_8px_rgba(59,88,246,0.6)] animate-in fade-in zoom-in duration-300" />
              )}
            </Link>
          </div>

          {/* Right: Buttons & Mobile Menu Toggle */}
          <div className="flex items-center gap-5">
            <div className="hidden lg:flex items-center gap-6">
              <Link
                href="/login"
                className="font-body text-[15px] font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="h-[42px] px-6 inline-flex items-center justify-center gap-2 font-body text-[14px] font-semibold text-white bg-[#3B58F6] hover:bg-[#2e45c7] rounded-full shadow-[0_4px_14px_rgba(59,88,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,88,246,0.4)] hover:-translate-y-0.5 transition-all duration-200"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-4">
              <Link
                href="/login"
                className="font-body text-[14px] font-medium text-neutral-800"
              >
                Log in
              </Link>
              <button
                className="p-2.5 bg-[#3B58F6] text-white rounded-xl shadow-md hover:bg-[#2e45c7] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3B58F6]"
                onClick={() => setMobileDrawerOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />
    </>
  );
}
