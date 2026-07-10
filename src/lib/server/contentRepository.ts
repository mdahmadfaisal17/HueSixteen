import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { sanitizeRichText } from "@/lib/server/sanitizeRichText";

export type StoredBlog = {
  _id?: ObjectId;
  slug: string;
  title: string;
  category: string;
  date: string;
  views: string;
  image: string;
  excerpt: string;
  details: string[];
  status: "Published" | "Draft";
  content: string;
};

export type StoredBlogSummary = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  views: string;
  image: string;
  excerpt: string;
  status: "Published" | "Draft";
};

export type StoredPortfolio = {
  _id?: ObjectId;
  title: string;
  category: string;
  featuredSlot: string;
  link: string;
  projectLink: string;
  created: string;
  image: string;
  tag: string[];
};

export type StoredLead = {
  _id?: ObjectId;
  fullName: string;
  email: string;
  whatsappNumber: string;
  service: string;
  budget: string;
  contactMethod: string;
  projectDescription: string;
  createdAt: string;
};

type StoredBlogView = {
  _id?: ObjectId;
  slug: string;
  fingerprint: string;
  createdAt: Date;
  expiresAt: Date;
};

const BLOGS_COLLECTION = "blogs";
const PORTFOLIOS_COLLECTION = "portfolios";
const LEADS_COLLECTION = "leads";
const BLOG_VIEWS_COLLECTION = "blog_views";
const BLOG_VIEW_DEDUPE_WINDOW_MS = 60 * 60 * 1000;

const defaultPortfolios: StoredPortfolio[] = [];

const legacyDummyPortfolioTitles = ["FlowBank", "Academy.co", "Genome", "Hotto"];

const defaultBlogs: StoredBlog[] = [];

const defaultLeads: StoredLead[] = [
  {
    fullName: "Nova Labs",
    email: "hello@novalabs.com",
    whatsappNumber: "+1 555 014 221",
    service: "Brand Identity Design",
    budget: "$1,500 - $5,000",
    contactMethod: "WhatsApp",
    projectDescription: "A clean identity system for a new agency launch with flexible presentation assets.",
    createdAt: new Date().toISOString(),
  },
  {
    fullName: "Atlas Studio",
    email: "contact@atlasstudio.com",
    whatsappNumber: "+1 555 017 884",
    service: "Social Media Design",
    budget: "$500 - $1,500",
    contactMethod: "Email",
    projectDescription: "Social media templates and launch visuals for an upcoming brand campaign.",
    createdAt: new Date().toISOString(),
  },
  {
    fullName: "Pulse Health",
    email: "team@pulsehealth.com",
    whatsappNumber: "+1 555 019 433",
    service: "Event Branding Design",
    budget: "$5,000+",
    contactMethod: "WhatsApp",
    projectDescription: "A branded event kit including signage, social promos, and on-site materials.",
    createdAt: new Date().toISOString(),
  },
];

const serialize = <T extends { _id?: ObjectId }>(doc: T) => {
  const { _id, ...rest } = doc;
  return {
    ...rest,
    id: _id?.toString(),
  };
};

let seedReady = false;
let seedPromise: Promise<void> | null = null;

const ensureSeeded = async () => {
  if (seedReady) {
    return;
  }

  if (!seedPromise) {
    seedPromise = (async () => {
      const db = await getDatabase();

      const blogsCollection = db.collection<StoredBlog>(BLOGS_COLLECTION);
      const portfoliosCollection = db.collection<StoredPortfolio>(PORTFOLIOS_COLLECTION);
      const leadsCollection = db.collection<StoredLead>(LEADS_COLLECTION);
      const blogViewsCollection = db.collection<StoredBlogView>(BLOG_VIEWS_COLLECTION);

      await Promise.all([
        blogsCollection.createIndex({ slug: 1 }, { unique: true, name: "blog_slug_unique" }),
        leadsCollection.createIndex({ email: 1, createdAt: -1 }, { name: "lead_email_created" }),
        blogViewsCollection.createIndex({ slug: 1, fingerprint: 1 }, { name: "blog_view_slug_fingerprint" }),
        blogViewsCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: "blog_view_expires_ttl" }),
      ]);

      const [blogCount, portfolioCount, leadsCount] = await Promise.all([
        blogsCollection.countDocuments(),
        portfoliosCollection.countDocuments(),
        leadsCollection.countDocuments(),
      ]);

      if (blogCount === 0 && defaultBlogs.length > 0) {
        await blogsCollection.insertMany(defaultBlogs);
      }

      if (portfolioCount === 0 && defaultPortfolios.length > 0) {
        await portfoliosCollection.insertMany(defaultPortfolios);
      }

      if (portfolioCount > 0) {
        const portfolioDocs = await portfoliosCollection.find({}, { projection: { title: 1 } }).toArray();
        const hasOnlyLegacyDummyPortfolios =
          portfolioDocs.length > 0 &&
          portfolioDocs.length <= legacyDummyPortfolioTitles.length &&
          portfolioDocs.every((doc) => legacyDummyPortfolioTitles.includes(doc.title));

        if (hasOnlyLegacyDummyPortfolios) {
          await portfoliosCollection.deleteMany({ title: { $in: legacyDummyPortfolioTitles } });
        }
      }

      if (leadsCount === 0) {
        await leadsCollection.insertMany(defaultLeads);
      }

      seedReady = true;
    })().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }

  await seedPromise;
};

export const getBlogs = async () => {
  await ensureSeeded();
  const db = await getDatabase();
  const docs = await db
    .collection<StoredBlog>(BLOGS_COLLECTION)
    .find({})
    .sort({ _id: -1 })
    .toArray();

  return docs.map(serialize);
};

export const getBlogSummaries = async (options?: { publishedOnly?: boolean }): Promise<StoredBlogSummary[]> => {
  await ensureSeeded();
  const db = await getDatabase();
  const publishedOnly = options?.publishedOnly ?? false;
  const docs = await db
    .collection<StoredBlog>(BLOGS_COLLECTION)
    .find(
      publishedOnly ? { status: "Published" } : {},
      {
        projection: {
          slug: 1,
          title: 1,
          category: 1,
          date: 1,
          views: 1,
          image: 1,
          excerpt: 1,
          status: 1,
        },
      },
    )
    .sort({ _id: -1 })
    .toArray();

  return docs.map((doc) => ({
    ...(serialize(doc) as Omit<StoredBlogSummary, "excerpt"> & { excerpt?: string }),
    excerpt: (doc.excerpt || "").trim(),
  }));
};

export const getBlogBySlug = async (slug: string) => {
  await ensureSeeded();
  const db = await getDatabase();
  const doc = await db.collection<StoredBlog>(BLOGS_COLLECTION).findOne({ slug });

  return doc ? serialize(doc) : null;
};

export const getPublishedBlogBySlug = async (slug: string) => {
  await ensureSeeded();
  const db = await getDatabase();
  const doc = await db.collection<StoredBlog>(BLOGS_COLLECTION).findOne({ slug, status: "Published" });

  return doc ? serialize(doc) : null;
};

export const registerBlogView = async (slug: string, fingerprint: string) => {
  await ensureSeeded();

  if (!slug.trim() || !fingerprint.trim()) {
    return null;
  }

  const db = await getDatabase();
  const blogsCollection = db.collection<StoredBlog>(BLOGS_COLLECTION);
  const blogViewsCollection = db.collection<StoredBlogView>(BLOG_VIEWS_COLLECTION);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + BLOG_VIEW_DEDUPE_WINDOW_MS);

  const publishedBlog = await blogsCollection.findOne({ slug, status: "Published" });

  if (!publishedBlog) {
    return null;
  }

  const recentView = await blogViewsCollection.findOne({
    slug,
    fingerprint,
    expiresAt: { $gt: now },
  });

  if (recentView) {
    const existing = await blogsCollection.findOne({ slug, status: "Published" });
    return existing ? serialize(existing) : null;
  }

  await blogViewsCollection.insertOne({
    slug,
    fingerprint,
    createdAt: now,
    expiresAt,
  });

  await blogsCollection.updateOne(
    { slug, status: "Published" },
    [
      {
        $set: {
          views: {
            $toString: {
              $add: [
                {
                  $convert: {
                    input: "$views",
                    to: "int",
                    onError: 0,
                    onNull: 0,
                  },
                },
                1,
              ],
            },
          },
        },
      },
    ],
  );

  const updated = await blogsCollection.findOne({ slug, status: "Published" });
  return updated ? serialize(updated) : null;
};

export const createBlog = async (payload: Partial<StoredBlog>) => {
  const db = await getDatabase();
  const collection = db.collection<StoredBlog>(BLOGS_COLLECTION);

  const baseSlug = (payload.slug || payload.title || "new-blog")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const existing = await collection.findOne({ slug: baseSlug });
  const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;

  const sanitizedContent = sanitizeRichText(payload.content || payload.excerpt || "");
  const details = payload.details && payload.details.length > 0
    ? payload.details
    : sanitizedContent
        .split(/\n\s*\n/)
        .map((line: string) => line.trim())
        .filter(Boolean);

  const createdDoc: StoredBlog = {
    slug,
    title: payload.title || "Untitled Blog",
    category: payload.category || "General",
    date:
      payload.date ||
      new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    views: payload.views || "0",
    image: payload.image || "/images/home/customerStories/customer_bg_img.jpg",
    excerpt: payload.excerpt || details[0] || "New blog content is ready.",
    details,
    status: payload.status || "Draft",
    content: sanitizedContent || details.join("\n\n"),
  };

  const result = await collection.insertOne(createdDoc);

  return serialize({ ...createdDoc, _id: result.insertedId });
};

export const updateBlogBySlug = async (slug: string, payload: Partial<StoredBlog>) => {
  const db = await getDatabase();
  const collection = db.collection<StoredBlog>(BLOGS_COLLECTION);

  const existing = await collection.findOne({ slug });

  if (!existing) {
    return null;
  }

  const nextContentSource = payload.content ?? existing.content ?? "";
  const sanitizedContent = sanitizeRichText(nextContentSource);
  const nextSlug = payload.slug && payload.slug !== slug ? payload.slug : existing.slug;
  const details = payload.details && payload.details.length > 0
    ? payload.details
    : sanitizedContent
        .split(/\n\s*\n/)
        .map((line: string) => line.trim())
        .filter(Boolean);

  const updatedDoc: StoredBlog = {
    ...existing,
    slug: nextSlug,
    title: payload.title ?? existing.title,
    category: payload.category ?? existing.category,
    date: payload.date ?? existing.date,
    views: payload.views ?? existing.views,
    image: payload.image ?? existing.image,
    excerpt: payload.excerpt ?? details[0] ?? existing.excerpt,
    details,
    status: payload.status ?? existing.status,
    content: sanitizedContent || details.join("\n\n"),
  };

  await collection.updateOne({ _id: existing._id }, { $set: updatedDoc });

  return serialize(updatedDoc);
};

export const deleteBlogBySlug = async (slug: string) => {
  const db = await getDatabase();
  const result = await db.collection<StoredBlog>(BLOGS_COLLECTION).deleteOne({ slug });

  return result.deletedCount > 0;
};

export const getPortfolios = async () => {
  await ensureSeeded();
  const db = await getDatabase();
  const docs = await db
    .collection<StoredPortfolio>(PORTFOLIOS_COLLECTION)
    .find({})
    .sort({ _id: -1 })
    .toArray();

  return docs.map(serialize);
};

export const createPortfolio = async (payload: Partial<StoredPortfolio>) => {
  const db = await getDatabase();
  const collection = db.collection<StoredPortfolio>(PORTFOLIOS_COLLECTION);

  const createdDoc: StoredPortfolio = {
    title: payload.title || "Untitled Project",
    category: payload.category || "General",
    featuredSlot: payload.featuredSlot || "Slot 01",
    link: payload.link || payload.projectLink || "/portfolio/new-project",
    projectLink: payload.projectLink || payload.link || "/portfolio/new-project",
    created:
      payload.created ||
      new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    image: payload.image || "/images/home/customerStories/customer_bg_img.jpg",
    tag: payload.tag && payload.tag.length > 0 ? payload.tag : [payload.category || "General"],
  };

  const result = await collection.insertOne(createdDoc);

  return serialize({ ...createdDoc, _id: result.insertedId });
};

export const updatePortfolioById = async (id: string, payload: Partial<StoredPortfolio>) => {
  const db = await getDatabase();
  const collection = db.collection<StoredPortfolio>(PORTFOLIOS_COLLECTION);

  if (!ObjectId.isValid(id)) {
    return null;
  }

  const _id = new ObjectId(id);
  const existing = await collection.findOne({ _id });

  if (!existing) {
    return null;
  }

  const updatedDoc: StoredPortfolio = {
    ...existing,
    title: payload.title ?? existing.title,
    category: payload.category ?? existing.category,
    featuredSlot: payload.featuredSlot ?? existing.featuredSlot,
    link: payload.link ?? payload.projectLink ?? existing.link,
    projectLink: payload.projectLink ?? payload.link ?? existing.projectLink,
    created: payload.created ?? existing.created,
    image: payload.image ?? existing.image,
    tag: payload.tag && payload.tag.length > 0 ? payload.tag : [payload.category ?? existing.category],
  };

  await collection.updateOne({ _id }, { $set: updatedDoc });

  return serialize({ ...updatedDoc, _id });
};

export const deletePortfolioById = async (id: string) => {
  const db = await getDatabase();

  if (!ObjectId.isValid(id)) {
    return false;
  }

  const _id = new ObjectId(id);
  const result = await db.collection<StoredPortfolio>(PORTFOLIOS_COLLECTION).deleteOne({ _id });

  return result.deletedCount > 0;
};

export const getLeads = async () => {
  await ensureSeeded();
  const db = await getDatabase();
  const docs = await db
    .collection<StoredLead>(LEADS_COLLECTION)
    .find({})
    .sort({ _id: -1 })
    .toArray();

  return docs.map(serialize);
};

export const createLead = async (payload: Partial<StoredLead>) => {
  const db = await getDatabase();
  const collection = db.collection<StoredLead>(LEADS_COLLECTION);

  const createdDoc: StoredLead = {
    fullName: payload.fullName || "Unknown Client",
    email: payload.email || "",
    whatsappNumber: payload.whatsappNumber || "",
    service: payload.service || "General Inquiry",
    budget: payload.budget || "",
    contactMethod: payload.contactMethod || "Email",
    projectDescription: payload.projectDescription || "",
    createdAt: payload.createdAt || new Date().toISOString(),
  };

  const result = await collection.insertOne(createdDoc);

  return serialize({ ...createdDoc, _id: result.insertedId });
};
