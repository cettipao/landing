import { motion } from "framer-motion";

interface Props {
  text: string;
  className?: string;
}

/**
 * Letter-by-letter reveal — fades and slides each glyph up with a small
 * stagger. Whole words stay together so they break correctly on small screens.
 */
export default function RevealHeading({ text, className }: Props) {
  const words = text.split(" ");

  return (
    <h1 className={className} aria-label={text}>
      {words.map((word, wIndex) => (
        <span
          key={`${word}-${wIndex}`}
          className="inline-block whitespace-nowrap"
        >
          {Array.from(word).map((char, cIndex) => (
            <motion.span
              key={`${char}-${cIndex}`}
              className="inline-block"
              initial={{ y: "0.6em", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.05 * (wIndex * 4 + cIndex),
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              aria-hidden="true"
            >
              {char}
            </motion.span>
          ))}
          {wIndex < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </h1>
  );
}
