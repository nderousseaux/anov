import { DocumentRenderer, type DocumentRendererProps } from '@keystatic/core/renderer';
import type { ElementType, ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderers: DocumentRendererProps['renderers'] = {
  block: {
    heading: ({ level, children }) => {
      const Tag = `h${level}` as ElementType;
      const classes: Record<number, string> = {
        1: 'text-2xl md:text-3xl text-primary mt-12 mb-4',
        2: 'text-xl md:text-2xl text-primary mt-10 mb-3',
        3: 'text-lg md:text-xl text-primary/90 mt-8 mb-3',
        4: 'text-base md:text-lg text-primary/80 mt-6 mb-2 font-semibold',
      };
      return <Tag className={classes[level] ?? 'text-base text-primary mt-6 mb-2 font-semibold'} style={{ fontFamily: 'var(--font-display)' }}>{children as ReactNode}</Tag>;
    },
    paragraph: ({ children }) => (
      <p className="text-foreground/75 leading-relaxed mb-0">{children as ReactNode}</p>
    ),
    divider: () => (
      <hr className="border-primary/20 my-8" />
    ),
    list: ({ type, children }) => {
      const items = children.map((child, i) => (
        <li key={i} className="leading-relaxed">{child as ReactNode}</li>
      ));
      if (type === 'ordered') {
        return <ol className="list-decimal list-outside pl-6 mb-5 text-foreground/75">{items}</ol>;
      }
      return <ul className="list-disc list-outside pl-6 mb-5 text-foreground/75">{items}</ul>;
    },
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-primary/40 pl-4 my-5 italic text-foreground/60">{children as ReactNode}</blockquote>
    ),
  },
  inline: {
    bold: ({ children }) => <strong className="text-foreground font-medium">{children as ReactNode}</strong>,
    italic: ({ children }) => <em className="italic">{children as ReactNode}</em>,
    underline: ({ children }) => <span className="underline underline-offset-2">{children as ReactNode}</span>,
    link: ({ href, children }) => (
      <a href={href} className="text-primary underline underline-offset-2 hover:text-primary/70 transition-colors" target="_blank" rel="noopener noreferrer">
        {children as ReactNode}
      </a>
    ),
  },
} as DocumentRendererProps['renderers'];

export function LegalDocumentRenderer({ document }: Pick<DocumentRendererProps, 'document'>) {
  return <DocumentRenderer document={document} renderers={renderers} />;
}
