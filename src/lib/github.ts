/**
 * Build-time fetchers for GitHub data.
 *
 *   - getFeaturedRepos: pinned repos (GraphQL, requires token) → starred-then-
 *     recent fallback (REST, no token needed).
 *   - getContributions: yearly contribution calendar (GraphQL, requires token).
 *     Returns null when no token is available so the UI can degrade gracefully.
 *
 * Both functions swallow errors and return safe defaults — the build always
 * keeps going, even offline or without a token (useful for `astro dev`).
 */

const GITHUB_USER = "cettipao";
const GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

export interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  primaryLanguage: string | null;
  stargazerCount: number;
  topics: string[];
  updatedAt: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionDay[][];
  from: string;
  to: string;
}

// ---------------------------------------------------------------------------
// Token resolution
// ---------------------------------------------------------------------------

function getToken(): string | undefined {
  // process.env covers the production build and CI (where GITHUB_TOKEN is
  // auto-injected). import.meta.env covers `astro dev`, which loads the
  // local .env into Vite's env but not into process.env.
  return (
    process.env["GH_USER_TOKEN"] ??
    process.env["GITHUB_TOKEN"] ??
    import.meta.env["GH_USER_TOKEN"] ??
    import.meta.env["GITHUB_TOKEN"]
  );
}

async function graphql<T>(token: string, query: string, variables: object) {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "paolocetti.com-build",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: unknown[] };
  if (json.errors?.length) {
    throw new Error(`GitHub GraphQL: ${JSON.stringify(json.errors)}`);
  }
  if (!json.data) throw new Error("GitHub GraphQL: empty response");
  return json.data;
}

// ---------------------------------------------------------------------------
// Featured repos
// ---------------------------------------------------------------------------

const FEATURED_QUERY = /* GraphQL */ `
  query Featured($login: String!) {
    user(login: $login) {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            homepageUrl
            stargazerCount
            updatedAt
            primaryLanguage {
              name
            }
            repositoryTopics(first: 10) {
              nodes {
                topic {
                  name
                }
              }
            }
          }
        }
      }
      repositories(
        first: 12
        ownerAffiliations: OWNER
        isFork: false
        privacy: PUBLIC
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        nodes {
          name
          description
          url
          homepageUrl
          stargazerCount
          isArchived
          updatedAt
          primaryLanguage {
            name
          }
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
        }
      }
    }
  }
`;

interface FeaturedResponse {
  user: {
    pinnedItems: { nodes: GraphQLRepoNode[] };
    repositories: { nodes: (GraphQLRepoNode & { isArchived: boolean })[] };
  };
}

interface GraphQLRepoNode {
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  updatedAt: string;
  primaryLanguage: { name: string } | null;
  repositoryTopics: { nodes: Array<{ topic: { name: string } }> };
}

const normalize = (n: GraphQLRepoNode): GitHubRepo => ({
  name: n.name,
  description: n.description,
  url: n.url,
  homepageUrl: n.homepageUrl,
  primaryLanguage: n.primaryLanguage?.name ?? null,
  stargazerCount: n.stargazerCount,
  topics: n.repositoryTopics.nodes.map((t) => t.topic.name),
  updatedAt: n.updatedAt,
});

interface RestRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
  updated_at: string;
  fork: boolean;
  archived: boolean;
}

async function fetchRestStarsSorted(): Promise<GitHubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "paolocetti.com-build",
      },
    },
  );
  if (!res.ok) throw new Error(`GitHub REST ${res.status}`);
  const repos = (await res.json()) as RestRepo[];
  return repos
    .filter((r) => !r.fork && !r.archived)
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    })
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      homepageUrl: r.homepage,
      primaryLanguage: r.language,
      stargazerCount: r.stargazers_count,
      topics: r.topics ?? [],
      updatedAt: r.updated_at,
    }));
}

export async function getFeaturedRepos(): Promise<GitHubRepo[]> {
  const token = getToken();
  try {
    if (token) {
      const data = await graphql<FeaturedResponse>(token, FEATURED_QUERY, {
        login: GITHUB_USER,
      });
      const pinned = data.user.pinnedItems.nodes.map(normalize);
      if (pinned.length > 0) return pinned;
      // No pinned items — fall back to top-starred non-archived repos
      return data.user.repositories.nodes
        .filter((r) => !r.isArchived)
        .slice(0, 6)
        .map(normalize);
    }
    return await fetchRestStarsSorted();
  } catch (err) {
    console.warn("[github] featured repos fetch failed:", err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Contribution calendar
// ---------------------------------------------------------------------------

const CONTRIBUTIONS_QUERY = /* GraphQL */ `
  query Contributions($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

interface ContributionsResponse {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: Array<{
            date: string;
            contributionCount: number;
            contributionLevel:
              | "NONE"
              | "FIRST_QUARTILE"
              | "SECOND_QUARTILE"
              | "THIRD_QUARTILE"
              | "FOURTH_QUARTILE";
          }>;
        }>;
      };
    };
  };
}

const LEVEL_MAP = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
} as const;

export async function getContributions(): Promise<ContributionCalendar | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const data = await graphql<ContributionsResponse>(
      token,
      CONTRIBUTIONS_QUERY,
      { login: GITHUB_USER },
    );
    const cal = data.user.contributionsCollection.contributionCalendar;
    const weeks = cal.weeks.map((w) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: LEVEL_MAP[d.contributionLevel],
      })),
    );
    const allDays = weeks.flat();
    const from = allDays[0]?.date ?? "";
    const to = allDays[allDays.length - 1]?.date ?? "";
    return {
      totalContributions: cal.totalContributions,
      weeks,
      from,
      to,
    };
  } catch (err) {
    console.warn("[github] contributions fetch failed:", err);
    return null;
  }
}
