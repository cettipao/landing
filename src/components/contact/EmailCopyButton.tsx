import { useState } from "react";
import { Mail, Copy, Check } from "lucide-react";

interface Props {
  email: string;
  copyLabel: string;
  copiedLabel: string;
}

export default function EmailCopyButton({
  email,
  copyLabel,
  copiedLabel,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback: open mailto so the user still has a path forward.
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      <a
        href={`mailto:${email}`}
        className="font-mono text-base md:text-lg text-text-primary hover:text-accent transition-colors inline-flex items-center gap-2"
      >
        <Mail size={18} aria-hidden="true" />
        {email}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? copiedLabel : copyLabel}
        className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-border text-text-tertiary hover:text-accent hover:border-accent transition-colors"
      >
        {copied ? (
          <Check size={14} aria-hidden="true" />
        ) : (
          <Copy size={14} aria-hidden="true" />
        )}
      </button>
      {/* Pulled out of the flex layout so the email + copy button stay
          centered whether or not the status is visible. */}
      <span
        role="status"
        aria-live="polite"
        className={
          "pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-xs transition-opacity " +
          (copied ? "text-success opacity-100" : "opacity-0")
        }
      >
        {copiedLabel}
      </span>
    </div>
  );
}
