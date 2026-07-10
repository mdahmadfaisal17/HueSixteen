import Image from "next/image";
import Link from "next/link";
import Solutions from "@/components/Home/Solution";
import { getBlogSummaries } from "@/lib/server/contentRepository";

const buildCardPreviewText = (excerpt?: string) => {
  const normalizedExcerpt = (excerpt || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalizedExcerpt;
};

async function BlogPage() {
  const blogPosts = await getBlogSummaries({ publishedOnly: true });

  if (blogPosts.length === 0) {
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

      <section className="2xl:pb-20 pb-11">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
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
                      {buildCardPreviewText(post.excerpt)}
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
