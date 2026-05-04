import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import type { GitHubRepo } from "@/lib/github";

interface Props {
  repos: GitHubRepo[];
}

export default function GitHubRepos({ repos }: Props) {
  if (repos.length === 0) return null;

  return (
    <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo, i) => (
        <motion.li
          key={repo.url}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.4,
            delay: i * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block h-full rounded-lg border border-border bg-bg-tertiary/30 p-4 hover:border-accent/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-mono text-sm text-text-primary group-hover:text-accent transition-colors flex items-center gap-2">
                <GithubIcon size={14} className="shrink-0" />
                {repo.name}
              </h3>
              {repo.stargazerCount > 0 && (
                <span className="font-mono text-xs text-text-tertiary inline-flex items-center gap-1 shrink-0">
                  <Star size={10} aria-hidden="true" />
                  {repo.stargazerCount}
                </span>
              )}
            </div>
            {repo.description && (
              <p className="mt-2 text-xs text-text-secondary leading-relaxed line-clamp-3">
                {repo.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-2 text-[11px] text-text-tertiary">
              {repo.primaryLanguage && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {repo.primaryLanguage}
                </span>
              )}
            </div>
          </a>
        </motion.li>
      ))}
    </ul>
  );
}
