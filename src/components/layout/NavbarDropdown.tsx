"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface DropdownItem {
  label: string;
  href: string;
}

export function NavbarDropdown({
  label,
  items,
}: {
  label: string;
  items: DropdownItem[];
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative font-medium inline-flex items-center text-[1.1rem] tracking-[0.01em] text-foreground transition-all duration-300 ease-out hover:text-primary focus-visible:outline-none after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-center after:scale-x-0 after:bg-primary/80 after:transition-transform after:duration-300 hover:after:scale-x-100"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown
          size={16}
          className={`ml-1 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Desktop Dropdown */}
      <div
        className={`absolute top-full left-0 mt-2 min-w-[180px] bg-background border border-primary/20 rounded-lg shadow-lg overflow-hidden transition-all duration-200 ease-out origin-top z-50 ${
          open
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex flex-col py-2">
          {items.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              onClick={() => {
                // Prevent default navigation, handled by click
                if (
                  item.href === "/boutique" ||
                  item.href === "/cheques-cadeaux"
                ) {
                  // Allow navigation to proceed
                }
              }}
              className={`px-4 py-2.5 text-sm transition-colors duration-150 text-foreground hover:bg-primary/5 hover:text-foreground`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
