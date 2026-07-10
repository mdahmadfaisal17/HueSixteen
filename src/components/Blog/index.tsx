import Image from "next/image";
import Link from "next/link";
import Solutions from "@/components/Home/Solution";
import { getBlogs } from "@/lib/server/contentRepository";
import { sanitizeRichText } from "@/lib/server/sanitizeRichText";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const buildCardPreviewHtml = (content?: string, fallback?: string) => {
  const source = (content || fallback || "").trim();

  if (!source) {
    return "";
  }

  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(source);

  if (!hasHtml) {
    return escapeHtml(source)
      .replace(/^\s*[-*]\s+/gm, "• ")
      .replace(/\n/g, "<br />");
  }

  // Keep inline styles (strong/em/mark) and flatten block tags for a compact card preview.
  return sanitizeRichText(source)
    .replace(/<h[1-3][^>]*>/gi, "<br /><strong>")
    .replace(/<\/h[1-3]>/gi, "</strong><br />")
    .replace(/<li[^>]*>/gi, "<br />• ")
    .replace(/<\/li>/gi, "")
    .replace(/<\/?(p|div)[^>]*>/gi, "<br />")
    .replace(/<\/?(ul|ol)[^>]*>/gi, "")
    .replace(/\s*(<br\s*\/?>)\s*/gi, "$1")
    .replace(/(<br\s*\/?>){3,}/gi, "<br /><br />")
    .replace(/^(<br\s*\/?>)+/gi, "")
    .replace(/(<br\s*\/?>)+$/gi, "")
    .trim();
};

const buildCardPreviewText = (post: {
  content?: string;
  details?: string[];
  excerpt?: string;
}) => {
  const contentText = (post.content || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (contentText.length > 0) {
    return contentText;
  }

  if (Array.isArray(post.details) && post.details.length > 0) {
    return post.details[0];
  }

  return post.excerpt || "";
};

async function BlogPage() {
  const blogPosts = await getBlogs();
  const featuredPosts = blogPosts.slice(0, 3);
  const morePosts = blogPosts.slice(3);

  if (featuredPosts.length === 0) {
    return (
      <main>
        <section className="2xl:pt-44 pt-40 2xl:pb-20 pb-11">
          <div className="container">
            <p className="text-center opacity-70">No insights found.</p>
          </div>
        </section>
        <Solutions />
      </main>
    );
  }

  return (
    <main>
      <section className="2xl:pt-44 pt-40 2xl:pb-20 pb-11">
        <div className="container">
          <div className="flex flex-col gap-6 w-full mx-auto text-center items-center">
            <h1 className="max-w-[16ch] text-3xl leading-tight sm:text-4xl md:max-w-none md:text-6xl md:leading-tight 2xl:text-8xl 2xl:leading-[112px]">
              <span className="block whitespace-normal md:whitespace-nowrap">Insights That Inspire</span>
              <span className="block whitespace-normal md:whitespace-nowrap">Better Brands</span>
            </h1>
            <p className="max-w-2xl opacity-70">
              Explore practical insights, branding strategies, design trends, and creative ideas that help businesses make smarter decisions, strengthen their identity, and build memorable brand experiences.
            </p>
          </div>
        </div>
      </section>

      <section className="2xl:py-20 py-11">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-stretch">
            <article className="group rounded-3xl overflow-hidden bg-dark_black h-full">
              <Link href={`/blog/${featuredPosts[0].slug}`} className="h-full flex flex-col">
                <div className="relative overflow-hidden aspect-[850/520] shrink-0">
                  <Image
                    src={featuredPosts[0].image}
                    alt={featuredPosts[0].title}
                    width={850}
                    height={520}
                    className="w-full h-full object-cover"
                    unoptimized={true}
                  />
                </div>
                <div className="p-7 md:p-10 flex flex-col gap-4 flex-1 overflow-hidden">
                  <div className="flex flex-wrap gap-y-2 gap-x-6">
                    <p className="text-paleYellow text-sm">{featuredPosts[0].category}</p>
                    <p className="text-paleYellow text-sm">{featuredPosts[0].date}</p>
                  </div>
                  <h3
                    className="text-white"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {featuredPosts[0].title}
                  </h3>
                  <div
                    className="text-white opacity-70 text-lg md:text-xl leading-9 flex-1 [&_strong]:font-semibold [&_em]:italic [&_mark]:bg-purple_blue/25 [&_mark]:px-1 [&_mark]:rounded-sm"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 11,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: buildCardPreviewHtml(featuredPosts[0].content, featuredPosts[0].excerpt),
                    }}
                  />
                </div>
              </Link>
            </article>

            <div className="grid grid-cols-1 gap-6 h-full">
              {featuredPosts.slice(1).map((post, index) => (
                <Link
                  key={`${post.slug}-${post.id ?? index}`}
                  href={`/blog/${post.slug}`}
                  className="block rounded-3xl border border-dark_black border-opacity-10 overflow-hidden bg-white"
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={625}
                    height={260}
                    className="w-full aspect-[850/520] object-cover"
                    unoptimized={true}
                  />
                  <div className="p-6 flex flex-col gap-3">
                    <div className="flex flex-wrap gap-y-2 gap-x-6">
                      <p className="text-purple_blue text-sm">{post.category}</p>
                      <p className="text-purple_blue text-sm">{post.date}</p>
                    </div>
                    <h4
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {post.title}
                    </h4>
                    <p
                      className="opacity-70"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {buildCardPreviewText(post)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="2xl:pb-20 pb-11">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {morePosts.map((post, index) => (
              <Link
                key={`${post.slug}-${post.id ?? index}`}
                href={`/blog/${post.slug}`}
                className="block rounded-3xl border border-dark_black border-opacity-10 overflow-hidden bg-white"
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  width={850}
                  height={520}
                  className="w-full aspect-[850/520] object-cover"
                  unoptimized={true}
                />
                <div className="p-6 flex flex-col gap-3">
                  <div className="flex flex-wrap gap-y-2 gap-x-6">
                    <p className="text-purple_blue text-sm">{post.category}</p>
                    <p className="text-purple_blue text-sm">{post.date}</p>
                  </div>
                  <h4
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.title}
                  </h4>
                  <p
                    className="opacity-70"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {buildCardPreviewText(post)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Solutions />
    </main>
  );
}

export default BlogPage;
