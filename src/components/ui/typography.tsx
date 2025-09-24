import { ReactNode, createElement } from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

// Ana başlık bileşenleri
export function DisplayHeading({ children, className, as = 'h1' }: TypographyProps) {
  return createElement(as, { className: cn('heading-display', className) }, children);
}

export function H1({ children, className, as = 'h1' }: TypographyProps) {
  return createElement(as, { className: cn('heading-1', className) }, children);
}

export function H2({ children, className, as = 'h2' }: TypographyProps) {
  return createElement(as, { className: cn('heading-2', className) }, children);
}

export function H3({ children, className, as = 'h3' }: TypographyProps) {
  return createElement(as, { className: cn('heading-3', className) }, children);
}

export function H4({ children, className, as = 'h4' }: TypographyProps) {
  return createElement(as, { className: cn('heading-4', className) }, children);
}

export function H5({ children, className, as = 'h5' }: TypographyProps) {
  return createElement(as, { className: cn('heading-5', className) }, children);
}

export function H6({ children, className, as = 'h6' }: TypographyProps) {
  return createElement(as, { className: cn('heading-6', className) }, children);
}

// Metin bileşenleri
export function BodyLarge({ children, className, as = 'p' }: TypographyProps) {
  return createElement(as, { className: cn('body-large', className) }, children);
}

export function BodyText({ children, className, as = 'p' }: TypographyProps) {
  return createElement(as, { className: cn('body-base', className) }, children);
}

export function BodySmall({ children, className, as = 'p' }: TypographyProps) {
  return createElement(as, { className: cn('body-small', className) }, children);
}

export function BodyXS({ children, className, as = 'p' }: TypographyProps) {
  return createElement(as, { className: cn('body-xs', className) }, children);
}

// Özel metin bileşenleri
export function Caption({ children, className, as = 'span' }: TypographyProps) {
  return createElement(as, { className: cn('caption', className) }, children);
}

export function Label({ children, className, as = 'label' }: TypographyProps) {
  return createElement(as, { className: cn('label', className) }, children);
}

export function Overline({ children, className, as = 'span' }: TypographyProps) {
  return createElement(as, { className: cn('overline', className) }, children);
}

// Kod bileşenleri
interface CodeProps extends TypographyProps {
  inline?: boolean;
}

export function Code({ children, className, inline = true }: CodeProps) {
  if (inline) {
    return (
      <code className={cn('code-inline', className)}>
        {children}
      </code>
    );
  }
  
  return (
    <pre className={cn('code-block', className)}>
      <code>{children}</code>
    </pre>
  );
}

// Link bileşeni
interface LinkProps extends TypographyProps {
  href?: string;
  target?: string;
  rel?: string;
}

export function Link({ children, className, href, target, rel, as = 'a' }: LinkProps) {
  return createElement(as, {
    className: cn('link', className),
    href,
    target,
    rel
  }, children);
}

// Gradient metin bileşeni
export function GradientText({ children, className, as = 'span' }: TypographyProps) {
  return createElement(as, { className: cn('text-gradient', className) }, children);
}

// Metin yardımcı bileşenleri
export function TextBalance({ children, className, as = 'span' }: TypographyProps) {
  return createElement(as, { className: cn('text-balance', className) }, children);
}

export function TextPretty({ children, className, as = 'span' }: TypographyProps) {
  return createElement(as, { className: cn('text-pretty', className) }, children);
}

// Typography sistemi için yardımcı hook
export function useTypographyScale() {
  return {
    display: 'heading-display',
    h1: 'heading-1',
    h2: 'heading-2',
    h3: 'heading-3',
    h4: 'heading-4',
    h5: 'heading-5',
    h6: 'heading-6',
    bodyLarge: 'body-large',
    body: 'body-base',
    bodySmall: 'body-small',
    bodyXS: 'body-xs',
    caption: 'caption',
    label: 'label',
    overline: 'overline'
  };
}