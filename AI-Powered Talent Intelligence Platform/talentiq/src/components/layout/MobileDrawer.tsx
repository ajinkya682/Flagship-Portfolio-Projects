"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  LayoutGrid,
  Users,
  Tag,
  Star,
  BookOpen,
  ChevronRight,
  ChevronDown,
  LogIn,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname() || "";
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Dark Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[200] bg-neutral-900/20 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Floating Card Drawer */}
      <div
        className={cn(
          "fixed inset-x-4 top-0 bottom-0 right-0 left-0 bg-white shadow-2xl  z-[200] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col overflow-hidden max-w-[400px] mx-auto",
          isOpen
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-8 opacity-0 scale-95 pointer-events-none",
        )}
      >
        {/* Header with Close Button */}
        <div className="p-4 flex justify-end border-b border-neutral-100">
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Detailed Menu Items with Dynamic Active States */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
          <Link
            href="/features"
            onClick={onClose}
            className={cn(
              "flex items-center justify-between p-3 rounded-xl transition-colors group",
              isActive("/features") ? "bg-[#EEF2FF]" : "hover:bg-neutral-50",
            )}
          >
            <div className="flex items-center gap-3">
              <LayoutGrid
                className={cn(
                  "w-5 h-5",
                  isActive("/features") ? "text-[#3B58F6]" : "text-emerald-500",
                )}
              />
              <span
                className={cn(
                  "font-body text-[15px]",
                  isActive("/features")
                    ? "font-semibold text-[#3B58F6]"
                    : "font-medium text-neutral-800",
                )}
              >
                Features
              </span>
            </div>
            {isActive("/features") ? (
              <ChevronRight className="w-4 h-4 text-[#3B58F6]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600" />
            )}
          </Link>

          <Link
            href="/solutions"
            onClick={onClose}
            className={cn(
              "flex items-center justify-between p-3 rounded-xl transition-colors group",
              isActive("/solutions") ? "bg-[#EEF2FF]" : "hover:bg-neutral-50",
            )}
          >
            <div className="flex items-center gap-3">
              <Users
                className={cn(
                  "w-5 h-5",
                  isActive("/solutions") ? "text-[#3B58F6]" : "text-blue-500",
                )}
              />
              <span
                className={cn(
                  "font-body text-[15px]",
                  isActive("/solutions")
                    ? "font-semibold text-[#3B58F6]"
                    : "font-medium text-neutral-800",
                )}
              >
                Solutions
              </span>
            </div>
            {isActive("/solutions") ? (
              <ChevronDown className="w-4 h-4 text-[#3B58F6]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600" />
            )}
          </Link>

          <Link
            href="/pricing"
            onClick={onClose}
            className={cn(
              "flex items-center justify-between p-3 rounded-xl transition-colors group",
              isActive("/pricing") ? "bg-[#EEF2FF]" : "hover:bg-neutral-50",
            )}
          >
            <div className="flex items-center gap-3">
              <Tag
                className={cn(
                  "w-5 h-5",
                  isActive("/pricing") ? "text-[#3B58F6]" : "text-purple-500",
                )}
              />
              <span
                className={cn(
                  "font-body text-[15px]",
                  isActive("/pricing")
                    ? "font-semibold text-[#3B58F6]"
                    : "font-medium text-neutral-800",
                )}
              >
                Pricing
              </span>
            </div>
            {isActive("/pricing") ? (
              <ChevronRight className="w-4 h-4 text-[#3B58F6]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600" />
            )}
          </Link>

          <Link
            href="/customers"
            onClick={onClose}
            className={cn(
              "flex items-center justify-between p-3 rounded-xl transition-colors group",
              isActive("/customers") ? "bg-[#EEF2FF]" : "hover:bg-neutral-50",
            )}
          >
            <div className="flex items-center gap-3">
              <Star
                className={cn(
                  "w-5 h-5",
                  isActive("/customers") ? "text-[#3B58F6]" : "text-amber-500",
                )}
              />
              <span
                className={cn(
                  "font-body text-[15px]",
                  isActive("/customers")
                    ? "font-semibold text-[#3B58F6]"
                    : "font-medium text-neutral-800",
                )}
              >
                Customers
              </span>
            </div>
            {isActive("/customers") ? (
              <ChevronRight className="w-4 h-4 text-[#3B58F6]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600" />
            )}
          </Link>

          <Link
            href="/resources"
            onClick={onClose}
            className={cn(
              "flex items-center justify-between p-3 rounded-xl transition-colors group",
              isActive("/resources") ? "bg-[#EEF2FF]" : "hover:bg-neutral-50",
            )}
          >
            <div className="flex items-center gap-3">
              <BookOpen
                className={cn(
                  "w-5 h-5",
                  isActive("/resources")
                    ? "text-[#3B58F6]"
                    : "text-emerald-400",
                )}
              />
              <span
                className={cn(
                  "font-body text-[15px]",
                  isActive("/resources")
                    ? "font-semibold text-[#3B58F6]"
                    : "font-medium text-neutral-800",
                )}
              >
                Resources
              </span>
            </div>
            {isActive("/resources") ? (
              <ChevronRight className="w-4 h-4 text-[#3B58F6]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600" />
            )}
          </Link>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-neutral-100 flex flex-col gap-3">
          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <LogIn className="w-5 h-5 text-[#3B58F6]" />
              <span className="font-body text-[15px] font-medium">Log in</span>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500" />
          </Link>

          <Link
            href="/register"
            onClick={onClose}
            className="flex items-center justify-between p-4 w-full rounded-xl font-body text-[15px] font-medium text-white bg-[#3B58F6] hover:bg-[#2e45c7] transition-all shadow-md shadow-blue-500/20"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
