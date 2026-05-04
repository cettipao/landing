import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const localeSchema = z.enum(["en", "es"]).default("en");

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      stack: z.array(z.string()).default([]),
      role: z.string().optional(),
      repoUrl: z.string().url().optional(),
      demoUrl: z.string().url().optional(),
      caseStudyUrl: z.string().url().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      featured: z.boolean().default(false),
      order: z.number().default(0),
      publishedAt: z.coerce.date().optional(),
      locale: localeSchema,
    }),
});

const experience = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/experience" }),
  schema: ({ image }) =>
    z.object({
      company: z.string(),
      role: z.string(),
      location: z.string().optional(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date().nullable().optional(),
      current: z.boolean().default(false),
      logo: image().optional(),
      summary: z.string(),
      highlights: z.array(z.string()).default([]),
      stack: z.array(z.string()).default([]),
      url: z.string().url().optional(),
      order: z.number().default(0),
      locale: localeSchema,
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      locale: localeSchema,
    }),
});

export const collections = { projects, experience, blog };
