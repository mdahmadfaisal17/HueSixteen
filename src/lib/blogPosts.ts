export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  views: string;
  image: string;
  excerpt: string;
  details: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "consistent-brand-system-small-teams",
    title: "How a consistent brand system helps small teams move faster",
    category: "Brand Identity",
    date: "May 28, 2026",
    views: "12,450",
    image: "/images/home/customerStories/customer_bg_img.jpg",
    excerpt:
      "A practical look at building visual rules that keep campaigns, social content, and sales materials aligned.",
    details: [
      "Small teams usually lose time when every design starts from scratch. A clear brand system removes guesswork by defining typography, colors, components, and tone before execution begins.",
      "When these rules are documented and shared, teammates can make faster decisions while still producing work that feels unified across channels.",
      "The result is stronger consistency, fewer revision cycles, and better output quality even under tight campaign deadlines.",
    ],
  },
  {
    slug: "premium-social-posts-without-slow-production",
    title: "Designing social media posts that feel premium without slowing production",
    category: "Social Media",
    date: "May 16, 2026",
    views: "9,820",
    image: "/images/home/onlinePresence/online_img_2.jpg",
    excerpt:
      "Simple systems for creating repeatable post styles while keeping room for campaign-specific ideas.",
    details: [
      "Premium visual quality does not require a slow workflow. The key is to define modular templates that keep spacing, hierarchy, and brand style consistent.",
      "Design teams can then swap messages, imagery, and offers without rebuilding the entire layout for each post.",
      "This approach protects quality, speeds delivery, and keeps campaign visuals fresh without breaking brand consistency.",
    ],
  },
  {
    slug: "prepare-before-brand-identity-project",
    title: "What to prepare before starting a new brand identity project",
    category: "Creative Process",
    date: "April 30, 2026",
    views: "8,460",
    image: "/images/home/onlinePresence/online_img_3.jpg",
    excerpt:
      "The inputs, references, and business context that help a design project begin with stronger direction.",
    details: [
      "Brand projects move faster when strategy inputs are clear from day one. That includes business goals, audience profiles, competitor references, and positioning direction.",
      "A structured kickoff helps reduce ambiguity and makes concept development more focused and relevant.",
      "Better preparation means better decisions, smoother feedback rounds, and a stronger final identity system.",
    ],
  },
  {
    slug: "choose-typography-for-web-social",
    title: "How to choose typography that stays consistent across web and social",
    category: "Typography",
    date: "April 18, 2026",
    views: "7,930",
    image: "/images/home/onlinePresence/online_img_1.jpg",
    excerpt:
      "Build a compact type system that scales from landing pages to campaign creatives without losing brand clarity.",
    details: [
      "A compact type system should define headline, body, and utility styles with predictable spacing and contrast.",
      "When these roles are mapped clearly, content remains readable and recognizable across websites, ads, and social media.",
      "Consistency in typography improves trust and helps users quickly understand information hierarchy in every touchpoint.",
    ],
  },
  {
    slug: "checklist-before-service-campaign-launch",
    title: "A practical checklist before launching a new service campaign",
    category: "Campaign",
    date: "April 10, 2026",
    views: "6,880",
    image: "/images/home/creative/creative_bg_img.jpg",
    excerpt:
      "From visual direction to offer structure, the core checks that prevent weak execution after launch.",
    details: [
      "Before launch, verify offer clarity, audience targeting, creative alignment, and landing page readiness.",
      "Campaign assets should share one visual system and one message architecture to avoid mixed signals.",
      "A simple pre-launch checklist reduces avoidable mistakes and improves performance from day one.",
    ],
  },
  {
    slug: "align-brand-visuals-across-teams-vendors",
    title: "Keeping brand visuals aligned across teams and external vendors",
    category: "Brand Systems",
    date: "March 29, 2026",
    views: "7,120",
    image: "/images/home/innovation/innovation_bg_img.jpg",
    excerpt:
      "A simple approval and handoff process to keep every design output on-brand and production-ready.",
    details: [
      "When multiple teams and vendors create assets, inconsistency appears quickly without clear standards.",
      "Define file naming, template libraries, review checkpoints, and approval responsibilities from the start.",
      "Strong handoff rules reduce production errors and keep the brand experience consistent everywhere.",
    ],
  },
  {
    slug: "event-collateral-stage-social",
    title: "Designing event collateral that works both on stage and on social",
    category: "Event Design",
    date: "March 16, 2026",
    views: "5,970",
    image: "/images/home/onlinePresence/online_img_4.jpg",
    excerpt:
      "Use one visual language for banners, presentations, and social teasers to create a cohesive event experience.",
    details: [
      "Event branding should connect physical and digital touchpoints through one coherent visual language.",
      "That means coordinating stage visuals, slide decks, social teasers, and photo backdrops under one direction.",
      "A unified system improves audience recall and makes the event feel more premium and memorable.",
    ],
  },
  {
    slug: "mockups-in-client-presentations",
    title: "When to use mockups in client presentations and pitch decks",
    category: "Mockup",
    date: "March 03, 2026",
    views: "6,440",
    image: "/images/home/onlinePresence/online_img_2.jpg",
    excerpt:
      "Show ideas with context, improve approval speed, and reduce revision loops using the right mockup format.",
    details: [
      "Mockups help clients understand how design choices will appear in real usage contexts.",
      "Use them to present packaging, digital interfaces, merchandise, or campaign assets with stronger clarity.",
      "Right-context mockups shorten feedback cycles and increase confidence in final approvals.",
    ],
  },
  {
    slug: "reusable-social-post-structure",
    title: "Building a reusable social post structure for faster weekly output",
    category: "Social Media",
    date: "February 22, 2026",
    views: "8,010",
    image: "/images/home/onlinePresence/online_img_3.jpg",
    excerpt:
      "Create modular post layouts that keep production fast while preserving hierarchy, tone, and visual quality.",
    details: [
      "Weekly content production becomes easier when layout blocks are reusable and documented.",
      "Create a modular structure for headline, supporting copy, CTA, and visual anchor areas.",
      "With this model, teams can publish faster while preserving quality and brand consistency across campaigns.",
    ],
  },
];

export const getBlogPostBySlug = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);
