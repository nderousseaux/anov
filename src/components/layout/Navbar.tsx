"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Facebook, Instagram } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { NavbarDropdown } from "./NavbarDropdown";

// TikTok SVG icon component (not available in lucide-react)
function TiktokIcon({
  className,
  size,
  ...props
}: { className?: string; size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}
import type { FooterContent } from "./Footer";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";

export function Navbar({
  footerContent,
}: {
  footerContent?: FooterContent | null;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOnHero, setIsOnHero] = useState(false);
  const logoUrl = "/assets/img-logo.svg";
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const { t } = useLanguage();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isHomePage) {
      setIsOnHero(false);
      return;
    }

    const updateHeroState = () => {
      const heroSection =
        document.getElementById("hero") ??
        document.querySelector("main section");
      if (!heroSection) {
        setIsOnHero(false);
        return;
      }

      const heroHeight = heroSection.getBoundingClientRect().height;
      const transitionThreshold = heroHeight * 0.25;
      setIsOnHero(window.scrollY < transitionThreshold);
    };

    updateHeroState();
    const frameId = window.requestAnimationFrame(updateHeroState);
    window.addEventListener("scroll", updateHeroState, { passive: true });
    window.addEventListener("resize", updateHeroState);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateHeroState);
      window.removeEventListener("resize", updateHeroState);
    };
  }, [isHomePage]);

  useEffect(() => {
    if (pathname !== "/") return;
    const hash = window.location.hash;
    if (!hash) return;

    const sectionId = hash.replace("#", "");
    const element = document.getElementById(sectionId);
    if (!element) return;

    const yOffset = -80;
    const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, [pathname]);

  const scrollToSection = (sectionId: string) => {
    // Close mobile menu
    setMobileMenuOpen(false);

    // If not on home page, navigate to home first
    if (pathname !== "/") {
      router.push(`/#${sectionId}`);
      return;
    }

    // Scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const isActive = (path: string) => pathname === path;

  // Un seul endroit pour activer/désactiver les items des deux menus
  type NavItem =
    | { type: "section"; label: string; section: string }
    | { type: "link"; label: string; href: string }
    | { type: "cta"; label: string; href: string }
    | { type: "separator" }
    | {
        type: "dropdown";
        label: string;
        items: { label: string; href: string }[];
      };

  const navItems: NavItem[] = [
    { type: "section", label: t.nav.ourStory, section: "history" },
    { type: "section", label: t.nav.gallery, section: "gallery" },
    { type: "separator" },
    { type: "link", label: t.nav.theMenu, href: "/menu" },
    {
      type: "dropdown",
      label: t.nav.boutique,
      items: [
        { label: t.nav.products, href: "/boutique" },
        { label: t.nav.giftCards, href: "/cheques-cadeaux" },
      ],
    },
    { type: "cta", label: t.nav.reserve, href: "/reservation" },
  ];

  const menuItemClass =
    "relative font-medium inline-flex items-center text-[1.1rem] tracking-[0.01em] text-foreground transition-all duration-300 ease-out hover:text-primary focus-visible:outline-none after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-center after:scale-x-0 after:bg-primary/80 after:transition-transform after:duration-300 hover:after:scale-x-100";

  const activeMenuItemClass = "text-primary after:scale-x-100";

  const reservationButtonClass =
    "rounded-full border-2 border-primary/80 bg-transparent text-primary px-6 py-2.5 tracking-[0.03em] shadow-sm transition-all duration-300 ease-out hover:scale-[1.01] hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md";

  const isTransparent = isHomePage && isOnHero && !mobileMenuOpen;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? "bg-transparent border-b border-transparent"
          : "bg-background/95 backdrop-blur-sm border-b border-primary/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            href="/"
            className={`cursor-pointer flex items-center transition-opacity duration-300 pt-2 ${isTransparent ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            aria-hidden={isTransparent}
          >
            <Image
              src={logoUrl}
              alt="Logo l'anøv"
              width={150}
              height={56}
              className="h-12 sm:h-14 w-auto sm:-translate-y-2 -translate-y-1"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            {navItems.map((item, i) => {
              if (item.type === "separator")
                return (
                  <span
                    key={i}
                    className="text-primary/30 select-none"
                    aria-hidden
                  >
                    |
                  </span>
                );
              if (item.type === "section")
                return (
                  <button
                    key={i}
                    onClick={() => scrollToSection(item.section)}
                    className={menuItemClass}
                  >
                    {item.label}
                  </button>
                );
              if (item.type === "link")
                return (
                  <Link
                    key={i}
                    href={item.href}
                    className={`${menuItemClass} ${isActive(item.href) ? activeMenuItemClass : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              if (item.type === "cta")
                return (
                  <Link key={i} href={item.href}>
                    <Button className={reservationButtonClass}>
                      {item.label}
                    </Button>
                  </Link>
                );
              if (item.type === "dropdown")
                return (
                  <NavbarDropdown
                    key={i}
                    label={item.label}
                    items={item.items}
                  />
                );
            })}
            <LanguageSelector />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-primary z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-6">
            <div className="flex flex-col space-y-4">
              {navItems.map((item, i) => {
                if (item.type === "separator")
                  return (
                    <hr key={i} className="border-primary/20" aria-hidden />
                  );
                if (item.type === "section")
                  return (
                    <button
                      key={i}
                      onClick={() => scrollToSection(item.section)}
                      className="text-foreground hover:text-primary transition-colors duration-300 text-left py-2"
                    >
                      {item.label}
                    </button>
                  );
                if (item.type === "link")
                  return (
                    <Link
                      key={i}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`transition-colors duration-300 text-left py-2 ${isActive(item.href) ? "text-primary" : "text-foreground hover:text-primary"}`}
                    >
                      {item.label}
                    </Link>
                  );
                if (item.type === "cta")
                  return (
                    <Link
                      key={i}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full rounded-full border-2 border-primary/80 bg-transparent text-primary py-3 tracking-[0.03em] shadow-sm transition-all duration-300 ease-out hover:scale-[1.01] hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md">
                        {item.label}
                      </Button>
                    </Link>
                  );
                if (item.type === "dropdown")
                  return (
                    <div key={i} className="py-2">
                      <span className="text-foreground font-medium mb-2 block">
                        {item.label}
                      </span>
                      <div className="flex flex-col space-y-2 pl-4">
                        {item.items.map((subItem, j) => (
                          <Link
                            key={j}
                            href={subItem.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`transition-colors duration-300 text-left ${isActive(subItem.href) ? "text-primary" : "text-foreground hover:text-primary"}`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
              })}

              {/* Réseaux sociaux + sélecteur de langue */}
              {footerContent && (
                <div className="pt-2 flex gap-3">
                  {footerContent.facebookUrl && (
                    <a
                      href={footerContent.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-card p-2.5 rounded-lg border border-primary/30 hover:border-primary hover:bg-secondary transition-all duration-300 group"
                      aria-label="Facebook"
                    >
                      <Facebook className="text-primary" size={20} />
                    </a>
                  )}
                  {footerContent.instagramUrl && (
                    <a
                      href={footerContent.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-card p-2.5 rounded-lg border border-primary/30 hover:border-primary hover:bg-secondary transition-all duration-300 group"
                      aria-label="Instagram"
                    >
                      <Instagram className="text-primary" size={20} />
                    </a>
                  )}
                  {footerContent.tiktokUrl && (
                    <a
                      href={footerContent.tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-card p-2.5 rounded-lg border border-primary/30 hover:border-primary hover:bg-secondary transition-all duration-300 group"
                      aria-label="TikTok"
                    >
                      <TiktokIcon className="text-primary" size={20} />
                    </a>
                  )}
                </div>
              )}
              <div className="pt-1">
                <LanguageSelector />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
