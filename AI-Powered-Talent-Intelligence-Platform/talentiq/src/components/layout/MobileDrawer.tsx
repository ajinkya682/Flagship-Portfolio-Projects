"use client";

import { useEffect, useState } from "react";
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
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn?: boolean;
}

export default function MobileDrawer({ isOpen, onClose, isLoggedIn }: MobileDrawerProps) {
  const pathname = usePathname() || "";
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);
  const isSolutionsActive = ['/startups', '/scaling', '/enterprise', '/agencies'].some(isActive);

  const [solutionsOpen, setSolutionsOpen] = useState(false);

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

          <div>
            <button
              onClick={() => setSolutionsOpen(!solutionsOpen)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl transition-colors group",
                isSolutionsActive || solutionsOpen ? "bg-[#EEF2FF]" : "hover:bg-neutral-50",
              )}
            >
              <div className="flex items-center gap-3">
                <Users
                  className={cn(
                    "w-5 h-5",
                    isSolutionsActive || solutionsOpen ? "text-[#3B58F6]" : "text-blue-500",
                  )}
                />
                <span
                  className={cn(
                    "font-body text-[15px]",
                    isSolutionsActive || solutionsOpen
                      ? "font-semibold text-[#3B58F6]"
                      : "font-medium text-neutral-800",
                  )}
                >
                  Solutions
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  solutionsOpen ? "rotate-180 text-[#3B58F6]" : "text-neutral-400 group-hover:text-neutral-600",
                  isSolutionsActive && !solutionsOpen ? "text-[#3B58F6]" : ""
                )}
              />
            </button>
            
            {/* Expanded Solutions Links */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                solutionsOpen ? "max-h-[240px] opacity-100 mt-1" : "max-h-0 opacity-0"
              )}
            >
              <div className="pl-11 pr-3 flex flex-col gap-1 pb-1">
                <Link
                  href="/startups"
                  onClick={onClose}
                  className={cn(
                    "py-2 px-3 rounded-lg text-[14px] font-medium transition-colors",
                    isActive("/startups") ? "text-[#3B58F6] bg-blue-50" : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                  )}
                >
                  Startups
                </Link>
                <Link
                  href="/scaling"
                  onClick={onClose}
                  className={cn(
                    "py-2 px-3 rounded-lg text-[14px] font-medium transition-colors",
                    isActive("/scaling") ? "text-[#3B58F6] bg-blue-50" : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                  )}
                >
                  Scaling Teams
                </Link>
                <Link
                  href="/enterprise"
                  onClick={onClose}
                  className={cn(
                    "py-2 px-3 rounded-lg text-[14px] font-medium transition-colors",
                    isActive("/enterprise") ? "text-[#3B58F6] bg-blue-50" : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                  )}
                >
                  Enterprise
                </Link>
                <Link
                  href="/agencies"
                  onClick={onClose}
                  className={cn(
                    "py-2 px-3 rounded-lg text-[14px] font-medium transition-colors",
                    isActive("/agencies") ? "text-[#3B58F6] bg-blue-50" : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                  )}
                >
                  Agencies
                </Link>
              </div>
            </div>
          </div>

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
            href="/careers"
            onClick={onClose}
            className={cn(
              "flex items-center justify-between p-3 rounded-xl transition-colors group",
              isActive("/careers") ? "bg-[#EEF2FF]" : "hover:bg-neutral-50",
            )}
          >
            <div className="flex items-center gap-3">
              <Users
                className={cn(
                  "w-5 h-5",
                  isActive("/careers") ? "text-[#3B58F6]" : "text-indigo-400",
                )}
              />
              <span
                className={cn(
                  "font-body text-[15px]",
                  isActive("/careers")
                    ? "font-semibold text-[#3B58F6]"
                    : "font-medium text-neutral-800",
                )}
              >
                Careers
              </span>
            </div>
            {isActive("/careers") ? (
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

          <Link
            href="/contact"
            onClick={onClose}
            className={cn(
              "flex items-center justify-between p-3 rounded-xl transition-colors group",
              isActive("/contact") ? "bg-[#EEF2FF]" : "hover:bg-neutral-50",
            )}
          >
            <div className="flex items-center gap-3">
              <MessageSquare
                className={cn(
                  "w-5 h-5",
                  isActive("/contact")
                    ? "text-[#3B58F6]"
                    : "text-indigo-400",
                )}
              />
              <span
                className={cn(
                  "font-body text-[15px]",
                  isActive("/contact")
                    ? "font-semibold text-[#3B58F6]"
                    : "font-medium text-neutral-800",
                )}
              >
                Contact
              </span>
            </div>
            {isActive("/contact") ? (
              <ChevronRight className="w-4 h-4 text-[#3B58F6]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600" />
            )}
          </Link>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-neutral-100 flex flex-col gap-3">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              onClick={onClose}
              className="flex items-center justify-center gap-2 p-4 w-full rounded-xl font-body text-[15px] font-medium text-white bg-[#3B58F6] hover:bg-[#2e45c7] transition-all shadow-md shadow-blue-500/20"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </>
  );
}
