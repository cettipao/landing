import { motion } from "framer-motion";
import type { StackCategory } from "@/data/portfolio";
import type { Locale } from "@i18n/ui";

interface Props {
  categories: StackCategory[];
  locale: Locale;
}

export default function StackGrid({ categories, locale }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat, ci) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.5,
            delay: ci * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="rounded-lg border border-border bg-bg-tertiary/40 p-5 hover:border-accent/40 transition-colors"
        >
          <h3 className="font-mono text-xs uppercase tracking-wider text-accent">
            {cat.title[locale]}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {cat.items.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.35,
                  delay: ci * 0.06 + i * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-mono text-xs px-2.5 py-1 rounded border border-border text-text-secondary bg-bg-primary/40 hover:border-accent hover:text-accent transition-colors cursor-default"
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
