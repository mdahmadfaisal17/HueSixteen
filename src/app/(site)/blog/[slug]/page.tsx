import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, registerBlogView } from "@/lib/server/contentRepository";
import { sanitizeRichText } from "@/lib/server/sanitizeRichText";

type BlogDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: BlogDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return {
      title: "Insight Not Found",
      description: "The requested Hue Sixteen insight could not be found.",
    };
  }

  const descriptionSource = post.excerpt || post.details?.[0] || post.content || "";
  const description = descriptionSource.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      images: post.image ? [{ url: post.image, alt: post.title }] : undefined,
    },
    twitter: {
      title: post.title,
      description,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { slug } = await params;
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for") || "";
  const userAgent = headerStore.get("user-agent") || "unknown-agent";
  const language = headerStore.get("accept-language") || "unknown-language";
  const visitorIp = forwardedFor.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "unknown-ip";
  const fingerprint = `${visitorIp}::${userAgent}::${language}`;

  const post = (await registerBlogView(slug, fingerprint)) || (await getBlogBySlug(slug));

  if (!post) {
    notFound();
  }

  const hasRichContent = typeof post.content === "string" && /<\/?[a-z][\s\S]*>/i.test(post.content);
  const safeContent = sanitizeRichText(post.content || "");

  return (
    <main>
      <section className="2xl:pt-44 pt-40 2xl:pb-20 pb-11">
        <div className="container max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-full border border-dark_black border-opacity-20 px-5 py-2 text-sm hover:bg-dark_black hover:text-white transition-colors"
          >
            Back to Insights
          </Link>

          <div className="mt-8 flex flex-col gap-5">
            <h1 className="text-4xl leading-tight md:text-5xl md:leading-tight 2xl:text-6xl 2xl:leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-purple_blue">
              <p>{post.category}</p>
              <p>{post.date}</p>
              <p>Total Views: {post.views}</p>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl">
            <Image
              src={post.image}
              alt={post.title}
              width={1200}
              height={720}
              className="w-full aspect-[1200/720] object-cover"
              unoptimized={true}
            />
          </div>

          <article className="mt-10 opacity-80 leading-relaxed [&_h1]:text-4xl [&_h1]:font-semibold [&_h1]:leading-tight [&_h1]:mb-3 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:mb-3 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:mb-1 [&_strong]:font-semibold [&_em]:italic [&_mark]:bg-purple_blue/20 [&_mark]:px-1 [&_mark]:rounded-sm">
            {hasRichContent ? (
              <div dangerouslySetInnerHTML={{ __html: safeContent }} />
            ) : (
              <div className="flex flex-col gap-5">
                {post.details.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}
