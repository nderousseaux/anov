"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { SUPPORTED_LOCALES, LOCALE_LABELS, LOCALE_NAMES } from "@/lib/langs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSelector({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`gap-1.5 text-foreground/80 hover:text-white focus-visible:outline-none cursor-pointer ${className ?? ""}`}
          aria-label="Changer de langue"
        >
          <Globe size={15} strokeWidth={1.8} />
          <span className="text-sm font-medium tracking-wide">
            {LOCALE_LABELS[locale]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[130px]">
        {SUPPORTED_LOCALES.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => setLocale(loc)}
            className={`cursor-pointer gap-2 ${loc === locale ? "text-primary font-medium" : ""}`}
          >
            <span className="w-7 text-xs font-mono">{LOCALE_LABELS[loc]}</span>
            <span>{LOCALE_NAMES[loc]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
