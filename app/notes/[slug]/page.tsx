import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { site } from "@/data/site";
import { BackButton } from "@/components/BackButton";
import { ScrollTop } from "@/components/ScrollTop";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return site.writing.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = site.writing.find((entry) => entry.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} — Marco Su`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function NotePage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = site.writing.find((entry) => entry.slug === slug);
  if (!post) notFound();

  const others = site.writing.filter((entry) => entry.slug !== post.slug).slice(0, 3);

  return (
    <main className="article">
      <ScrollTop />
      <div className="article-bar">
        <BackButton />
        <span className="article-brand">{site.initials} / Notes</span>
      </div>

      <article className="article-body">
        <header className="article-head">
          <div className="article-meta">
            <span className="article-tag">{post.tag}</span>
            <span>{post.date}</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="text-balance">{post.title}</h1>
          <p className="article-lede text-pretty">{post.excerpt}</p>
        </header>

        <div className="article-prose">
          {post.body.map((paragraph, index) => (
            <p key={index} className="text-pretty">
              {paragraph}
            </p>
          ))}
        </div>

        <footer className="article-sign">
          <span>Marco Su</span>
          <span>{site.location}</span>
        </footer>
      </article>

      <nav className="article-more" aria-label="More notes">
        <span className="article-more-label">More notes</span>
        <ul>
          {others.map((entry) => (
            <li key={entry.slug}>
              <Link href={`/notes/${entry.slug}`} className="focus-ring">
                <span className="article-more-index">{entry.index}</span>
                <span className="article-more-title">{entry.title}</span>
                <span className="article-more-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/#about" className="article-home focus-ring">
          ← All of it lives on the home page
        </Link>
      </nav>
    </main>
  );
}
