import * as Markdoc from "@markdoc/markdoc";
import React, { type ElementType } from "react";
import type { Config } from "@markdoc/markdoc";

// Composants React personnalisés pour le rendu
const components = {
  Heading: ({
    level,
    children,
  }: {
    level: number;
    children: React.ReactNode;
  }) => {
    const Tag = `h${level}` as ElementType;
    const classes: Record<number, string> = {
      1: "text-2xl md:text-3xl text-primary mt-12 mb-4 font-display",
      2: "text-xl md:text-2xl text-primary mt-10 mb-3 font-display",
      3: "text-lg md:text-xl text-primary/90 mt-8 mb-3 font-display",
      4: "text-base md:text-lg text-primary/80 mt-6 mb-2 font-semibold font-display",
    };
    return (
      <Tag
        className={
          classes[level] ??
          "text-base text-primary mt-6 mb-2 font-semibold font-display"
        }
      >
        {children}
      </Tag>
    );
  },
  Paragraph: ({ children }: { children: React.ReactNode }) => (
    <p className="text-foreground/75 leading-relaxed mb-4">{children}</p>
  ),
  List: ({
    ordered,
    children,
  }: {
    ordered: boolean;
    children: React.ReactNode;
  }) => {
    const Tag = ordered ? "ol" : "ul";
    const listClass = ordered ? "list-decimal" : "list-disc";
    return (
      <Tag
        className={`${listClass} list-outside pl-6 mb-5 text-foreground/75 space-y-2`}
      >
        {children}
      </Tag>
    );
  },
  ListItem: ({ children }: { children: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a
      href={href}
      className="text-primary underline underline-offset-2 hover:text-primary/70 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  Strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="text-foreground font-semibold">{children}</strong>
  ),
  Em: ({ children }: { children: React.ReactNode }) => (
    <em className="italic">{children}</em>
  ),
  Blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-primary/40 pl-6 my-6 italic text-foreground/70">
      {children}
    </blockquote>
  ),
  Hr: () => <hr className="border-primary/20 my-8" />,
};

// Configuration Markdoc personnalisée
const config: Config = {
  nodes: {
    heading: {
      render: "Heading",
      attributes: {
        level: { type: Number, required: true },
      },
    },
    paragraph: {
      render: "Paragraph",
    },
    list: {
      render: "List",
      attributes: {
        ordered: { type: Boolean },
      },
    },
    item: {
      render: "ListItem",
    },
    link: {
      render: "Link",
      attributes: {
        href: { type: String, required: true },
      },
    },
    strong: {
      render: "Strong",
    },
    em: {
      render: "Em",
    },
    blockquote: {
      render: "Blockquote",
    },
    hr: {
      render: "Hr",
    },
  },
};

export function LegalDocumentRenderer({
  document,
}: {
  document?: { node?: unknown };
}) {
  if (!document?.node) return null;

  // Transform Markdoc AST avec la configuration personnalisée
  // Note: Markdoc types are complex - using type assertion
  const content = Markdoc.transform(
    document.node as import("@markdoc/markdoc").Node,
    config,
  );
  const rendered = Markdoc.renderers.react(content, React, { components });

  return <div className="space-y-1">{rendered}</div>;
}
