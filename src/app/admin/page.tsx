"use client";

import {
  Bell,
  ChevronDown,
  ChevronRight,
  Filter,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Plus,
  LogOut,
  Settings,
  Shield,
  Sparkles,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Cropper, { Area } from "react-easy-crop";
import { blogPosts } from "@/lib/blogPosts";

type EditorFormatAction = "bold" | "italic" | "highlight" | "h1" | "h2" | "h3" | "point" | "clear";

const editorTools: Array<{ label: string; action: EditorFormatAction }> = [
  { label: "Bold", action: "bold" },
  { label: "Italic", action: "italic" },
  { label: "Highlights", action: "highlight" },
  { label: "H1", action: "h1" },
  { label: "H2", action: "h2" },
  { label: "H3", action: "h3" },
  { label: "Point", action: "point" },
  { label: "Clear all styles", action: "clear" },
];

const formatStateDefaults: Record<EditorFormatAction, boolean> = {
  bold: false,
  italic: false,
  highlight: false,
  h1: false,
  h2: false,
  h3: false,
  point: false,
  clear: false,
};

const plainToRichHtml = (content: string) => {
  if (/<\/?[a-z][\s\S]*>/i.test(content)) {
    return content;
  }

  const escaped = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const inlineFormatted = escaped
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/==(.*?)==/g, "<mark>$1</mark>");

  const lines = inlineFormatted.split("\n");
  return lines
    .map((line) => {
      if (/^###\s+/.test(line)) {
        return `<h3>${line.replace(/^###\s+/, "")}</h3>`;
      }

      if (/^##\s+/.test(line)) {
        return `<h2>${line.replace(/^##\s+/, "")}</h2>`;
      }

      if (/^#\s+/.test(line)) {
        return `<h1>${line.replace(/^#\s+/, "")}</h1>`;
      }

      if (/^[-*]\s+/.test(line)) {
        return `<div>&bull; ${line.replace(/^[-*]\s+/, "")}</div>`;
      }

      return line.length > 0 ? `<div>${line}</div>` : "<div><br></div>";
    })
    .join("");
};

const PORTFOLIO_IMAGE_ASPECT_RATIO = 625 / 410;
const PORTFOLIO_EXPORT_WIDTH = 1250;
const PORTFOLIO_EXPORT_HEIGHT = 820;
const BLOG_IMAGE_ASPECT_RATIO = 850 / 520;
const BLOG_EXPORT_WIDTH = 850;
const BLOG_EXPORT_HEIGHT = 520;

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });

const createImageElement = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image for cropping."));
    image.src = src;
  });

const createCroppedPortfolioBlob = async (imageSrc: string, cropPixels: Area) => {
  const image = await createImageElement(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = PORTFOLIO_EXPORT_WIDTH;
  canvas.height = PORTFOLIO_EXPORT_HEIGHT;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to initialize crop canvas.");
  }

  context.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    PORTFOLIO_EXPORT_WIDTH,
    PORTFOLIO_EXPORT_HEIGHT,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error("Failed to export cropped image."));
          return;
        }

        resolve(result);
      },
      "image/jpeg",
      0.92,
    );
  });

  return blob;
};

const createCroppedBlogBlob = async (imageSrc: string, cropPixels: Area) => {
  const image = await createImageElement(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = BLOG_EXPORT_WIDTH;
  canvas.height = BLOG_EXPORT_HEIGHT;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to initialize crop canvas.");
  }

  context.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    BLOG_EXPORT_WIDTH,
    BLOG_EXPORT_HEIGHT,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error("Failed to export cropped image."));
          return;
        }

        resolve(result);
      },
      "image/jpeg",
      0.92,
    );
  });

  return blob;
};

type ViewKey = "dashboard" | "projects" | "blog" | "portfolio";

type BlogRange = "Weekly" | "Monthly" | "Quarterly" | "Bi Yearly" | "Yearly" | "All";

type BlogStatus = "Published" | "Draft";
type BlogEditorMode = "create" | "edit";
type PortfolioEditorMode = "create" | "edit";

type EditableBlogPost = {
  slug: string;
  title: string;
  category: string;
  status: BlogStatus;
  content: string;
  image: string;
  excerpt: string;
};

type EditableBlogCard = EditableBlogPost & {
  date: string;
};

type PortfolioCard = {
  id?: string;
  title: string;
  category: string;
  featuredSlot: string;
  projectLink: string;
  created: string;
  image: string;
};

type PortfolioFormData = {
  title: string;
  category: string;
  projectLink: string;
  featuredSlot: string;
  image: string;
};

type Lead = {
  id?: string;
  fullName: string;
  email: string;
  whatsappNumber: string;
  service: string;
  budget: string;
  contactMethod: string;
  projectDescription: string;
};

const sidebarLinks: Array<{
  label: string;
  key: ViewKey;
  icon: typeof LayoutDashboard;
}> = [
  { label: "Dashboard", key: "dashboard", icon: LayoutDashboard },
  { label: "Projects", key: "projects", icon: FolderKanban },
  { label: "Insights", key: "blog", icon: FileText },
  { label: "Work", key: "portfolio", icon: ImageIcon },
];

const supportLinks = [
  { label: "Settings", icon: Settings },
  { label: "Security", icon: Shield },
  { label: "Help", icon: MessageSquare },
];

const defaultStats = [
  { label: "Active projects", value: "18", change: "+4 this month", icon: FolderKanban },
  { label: "Published insights", value: "42", change: "6 drafts ready", icon: FileText },
  { label: "Work highlights", value: "64", change: "12 featured assets", icon: ImageIcon },
  { label: "Monthly reach", value: "128k", change: "+21.4% growth", icon: FolderKanban },
];

const chartPoints = [42, 45, 38, 41, 39, 48, 52, 50, 58, 61, 57, 64, 71, 75, 73, 66, 67, 72, 74];

const fallbackLeads: Lead[] = [
  {
    fullName: "Nova Labs",
    email: "hello@novalabs.com",
    whatsappNumber: "+1 555 014 221",
    service: "Brand Identity Design",
    budget: "$1,500 - $5,000",
    contactMethod: "WhatsApp",
    projectDescription: "A clean identity system for a new agency launch with flexible presentation assets."
  },
  {
    fullName: "Atlas Studio",
    email: "contact@atlasstudio.com",
    whatsappNumber: "+1 555 017 884",
    service: "Social Media Design",
    budget: "$500 - $1,500",
    contactMethod: "Email",
    projectDescription: "Social media templates and launch visuals for an upcoming brand campaign."
  },
  {
    fullName: "Pulse Health",
    email: "team@pulsehealth.com",
    whatsappNumber: "+1 555 019 433",
    service: "Event Branding Design",
    budget: "$5,000+",
    contactMethod: "WhatsApp",
    projectDescription: "A branded event kit including signage, social promos, and on-site materials."
  },
];

const editorialQueue = [
  { title: "How to shape a service brand that feels premium", tag: "Draft", readTime: "5 min read" },
];

const blogRanges: BlogRange[] = ["Weekly", "Monthly", "Quarterly", "Bi Yearly", "Yearly", "All"];
const portfolioCategoryOptions = ["Brand Identity", "Event Branding", "Social Media Design", "Custom Mockups"];
const portfolioSlotOptions = ["None", "Slot 01", "Slot 02", "Slot 03", "Slot 04"];

const portfolioItems: PortfolioCard[] = [];

const insights = [
  {
    title: "Client feedback rising",
    description: "Weekly approvals are up for active design projects.",
    percent: 92,
  },
  {
    title: "Insights production steady",
    description: "Editorial queue has 6 posts ready for review.",
    percent: 88,
  },
  {
    title: "Work updates healthy",
    description: "Featured work grid is current and organized.",
    percent: 85,
  },
];

export default function AdminPage() {
  const [activeView, setActiveView] = useState<ViewKey>("dashboard");
  const blogContentEditorRef = useRef<HTMLDivElement | null>(null);
  const blogContentDesktopEditorRef = useRef<HTMLDivElement | null>(null);
  const [activeEditorKey, setActiveEditorKey] = useState<"mobile" | "desktop">("mobile");
  const [activeEditorFormats, setActiveEditorFormats] = useState<Record<EditorFormatAction, boolean>>(formatStateDefaults);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isBlogFilterOpen, setIsBlogFilterOpen] = useState(false);
  const [selectedBlogRange, setSelectedBlogRange] = useState<BlogRange>("Weekly");
  const [blogEditorPost, setBlogEditorPost] = useState<EditableBlogPost | null>(null);
  const [blogEditorMode, setBlogEditorMode] = useState<BlogEditorMode>("edit");
  const [editingBlogSlug, setEditingBlogSlug] = useState<string | null>(null);
  const [portfolioFormData, setPortfolioFormData] = useState<PortfolioFormData | null>(null);
  const [portfolioEditorMode, setPortfolioEditorMode] = useState<PortfolioEditorMode>("create");
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [blogCropSource, setBlogCropSource] = useState<string | null>(null);
  const [blogCropPosition, setBlogCropPosition] = useState({ x: 0, y: 0 });
  const [blogCropZoom, setBlogCropZoom] = useState(1);
  const [blogCropPixels, setBlogCropPixels] = useState<Area | null>(null);
  const [portfolioCropSource, setPortfolioCropSource] = useState<string | null>(null);
  const [portfolioCropPosition, setPortfolioCropPosition] = useState({ x: 0, y: 0 });
  const [portfolioCropZoom, setPortfolioCropZoom] = useState(1);
  const [portfolioCropPixels, setPortfolioCropPixels] = useState<Area | null>(null);
  const [blogCardsData, setBlogCardsData] = useState<EditableBlogCard[]>(() =>
    blogPosts.slice(0, 5).map((post) => ({
      slug: post.slug,
      title: post.title,
      category: post.category,
      status: "Published",
      content: `${post.excerpt}\n\n${post.details.join("\n\n")}`,
      image: post.image,
      excerpt: post.excerpt,
      date: post.date,
    })),
  );
  const [leadsData, setLeadsData] = useState<Lead[]>(fallbackLeads);
  const [portfolioCardsData, setPortfolioCardsData] = useState<PortfolioCard[]>(portfolioItems);
  const occupiedPortfolioSlots = portfolioCardsData.reduce<Record<string, string>>((slots, item) => {
    if (item.featuredSlot !== "None" && item.featuredSlot) {
      slots[item.featuredSlot] = item.id || item.title;
    }

    return slots;
  }, {});

  const loadBlogsFromBackend = async () => {
    const response = await fetch("/api/blogs", { cache: "no-store" });

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return;
    }

    const mapped = data.map((post) => ({
      slug: post.slug,
      title: post.title,
      category: post.category,
      status: post.status || "Published",
      content: post.content || (Array.isArray(post.details) ? post.details.join("\n\n") : post.excerpt || ""),
      image: post.image,
      excerpt: post.excerpt || "",
      date: post.date || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    }));

    setBlogCardsData(mapped);
  };

  const loadPortfolioFromBackend = async () => {
    const response = await fetch("/api/portfolios", { cache: "no-store" });

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return;
    }

    const mapped = data.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category || (Array.isArray(item.tag) ? item.tag[0] : "General"),
      featuredSlot: item.featuredSlot || "Slot 01",
      projectLink: item.projectLink || item.link || "/portfolio/new-project",
      created: item.created || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      image: item.image,
    }));

    setPortfolioCardsData(mapped);
  };

  const loadLeadsFromBackend = async () => {
    const response = await fetch("/api/leads", { cache: "no-store" });

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return;
    }

    const mapped = data.map((lead) => ({
      id: lead.id,
      fullName: lead.fullName || "Unknown Client",
      email: lead.email || "",
      whatsappNumber: lead.whatsappNumber || "",
      service: lead.service || "General Inquiry",
      budget: lead.budget || "",
      contactMethod: lead.contactMethod || "Email",
      projectDescription: lead.projectDescription || "",
    }));

    setLeadsData(mapped);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await Promise.all([loadBlogsFromBackend(), loadPortfolioFromBackend(), loadLeadsFromBackend()]);
      } catch {
        // Keep local fallback data if backend is unavailable.
      }
    };

    bootstrap();
  }, []);

  const handleLogout = async () => {
    setIsProfileDrawerOpen(false);
    await signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_ADMIN_PANEL_PATH || "/admin"}/login` });
  };

  const slugify = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const openBlogEditor = (post: EditableBlogCard) => {
    setBlogEditorMode("edit");
    setEditingBlogSlug(post.slug);
    setBlogEditorPost({
      slug: post.slug,
      title: post.title,
      category: post.category,
      status: post.status,
      content: post.content,
      image: post.image,
      excerpt: post.excerpt,
    });
  };

  const openNewBlogEditor = () => {
    const defaultImage = blogCardsData[0]?.image ?? blogPosts[0]?.image ?? "";

    setBlogEditorMode("create");
    setEditingBlogSlug(null);
    setBlogEditorPost({
      slug: "",
      title: "",
      category: "",
      status: "Draft",
      content: "",
      image: defaultImage,
      excerpt: "",
    });
  };

  const uploadAdminImage = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/uploads/image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image.");
    }

    const data = await response.json();

    if (!data?.url) {
      throw new Error("Invalid upload response.");
    }

    return data.url as string;
  };

  const handleBlogImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const sourceUrl = await readFileAsDataUrl(file);
      setBlogCropSource(sourceUrl);
      setBlogCropPosition({ x: 0, y: 0 });
      setBlogCropZoom(1);
      setBlogCropPixels(null);
    } catch {
      return;
    }
  };

  const handleBlogCropApply = async () => {
    if (!blogCropSource || !blogCropPixels) {
      return;
    }

    try {
      const croppedBlob = await createCroppedBlogBlob(blogCropSource, blogCropPixels);
      const croppedFile = new File([croppedBlob], `blog-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      const uploadedUrl = await uploadAdminImage(croppedFile, "huesixteen/blogs");

      setBlogEditorPost((current) => (current ? { ...current, image: uploadedUrl } : current));
      setBlogCropSource(null);
      setBlogCropPixels(null);
      setBlogCropPosition({ x: 0, y: 0 });
      setBlogCropZoom(1);
    } catch {
      return;
    }
  };

  const handleBlogCropCancel = () => {
    setBlogCropSource(null);
    setBlogCropPixels(null);
    setBlogCropPosition({ x: 0, y: 0 });
    setBlogCropZoom(1);
  };

  const openPortfolioCreate = () => {
    const defaultImage = portfolioCardsData[0]?.image ?? "/images/home/customerStories/customer_bg_img.jpg";

    setPortfolioEditorMode("create");
    setEditingPortfolioId(null);

    setPortfolioFormData({
      title: "",
      category: portfolioCategoryOptions[0],
      projectLink: "",
      featuredSlot: "None",
      image: defaultImage,
    });
  };

  const openPortfolioEditor = (item: PortfolioCard) => {
    setPortfolioEditorMode("edit");
    setEditingPortfolioId(item.id ?? null);
    setPortfolioFormData({
      title: item.title,
      category: item.category,
      projectLink: item.projectLink,
      featuredSlot: item.featuredSlot,
      image: item.image,
    });
  };

  const closePortfolioCreate = () => {
    setPortfolioFormData(null);
    setPortfolioEditorMode("create");
    setEditingPortfolioId(null);
    setPortfolioCropSource(null);
    setPortfolioCropPosition({ x: 0, y: 0 });
    setPortfolioCropZoom(1);
    setPortfolioCropPixels(null);
  };

  const handlePortfolioImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const sourceUrl = await readFileAsDataUrl(file);
      setPortfolioCropSource(sourceUrl);
      setPortfolioCropPosition({ x: 0, y: 0 });
      setPortfolioCropZoom(1);
      setPortfolioCropPixels(null);
    } catch {
      return;
    }
  };

  const handlePortfolioCropApply = async () => {
    if (!portfolioCropSource || !portfolioCropPixels) {
      return;
    }

    try {
      const croppedBlob = await createCroppedPortfolioBlob(portfolioCropSource, portfolioCropPixels);
      const croppedFile = new File([croppedBlob], `portfolio-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      const uploadedUrl = await uploadAdminImage(croppedFile, "huesixteen/portfolios");

      setPortfolioFormData((current) => (current ? { ...current, image: uploadedUrl } : current));
      setPortfolioCropSource(null);
      setPortfolioCropPixels(null);
      setPortfolioCropPosition({ x: 0, y: 0 });
      setPortfolioCropZoom(1);
    } catch {
      return;
    }
  };

  const handlePortfolioCropCancel = () => {
    setPortfolioCropSource(null);
    setPortfolioCropPixels(null);
    setPortfolioCropPosition({ x: 0, y: 0 });
    setPortfolioCropZoom(1);
  };

  const handlePortfolioSubmit = async () => {
    if (!portfolioFormData) {
      return;
    }

    const nextItem = {
      title: portfolioFormData.title || "Untitled Project",
      category: portfolioFormData.category || "General",
      featuredSlot: portfolioFormData.featuredSlot || "None",
      projectLink: portfolioFormData.projectLink || "/portfolio/new-project",
      created: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      image: portfolioFormData.image,
    };

    try {
      if (portfolioEditorMode === "edit" && editingPortfolioId) {
        const response = await fetch(`/api/portfolios/${editingPortfolioId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nextItem),
        });

        if (!response.ok) {
          return;
        }
      } else {
        const response = await fetch("/api/portfolios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nextItem),
        });

        if (!response.ok) {
          return;
        }
      }

      await loadPortfolioFromBackend();
    } catch {
      return;
    }

    closePortfolioCreate();
  };

  const handlePortfolioDelete = async (id?: string) => {
    if (!id) {
      return;
    }

    try {
      const response = await fetch(`/api/portfolios/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return;
      }

      await loadPortfolioFromBackend();
    } catch {
      return;
    }
  };

  const handleBlogUpdate = async () => {
    if (!blogEditorPost) {
      return;
    }

    const nextSlug = slugify(blogEditorPost.title);
    const plainContent = extractPlainText(blogEditorPost.content);
    const details = plainContent
      .split(/\n\s*\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const nextExcerpt = (details[0] || "").trim();

    const payload = {
      slug: nextSlug,
      title: blogEditorPost.title,
      category: blogEditorPost.category,
      status: blogEditorPost.status,
      content: blogEditorPost.content,
      details,
      image: blogEditorPost.image,
      excerpt: nextExcerpt.length > 0 ? nextExcerpt : "New blog content is ready.",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    };

    try {
      if (blogEditorMode === "create") {
        const response = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          return;
        }
      } else {
        const slugToUpdate = editingBlogSlug || nextSlug;
        const response = await fetch(`/api/blogs/${slugToUpdate}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          return;
        }
      }

      await loadBlogsFromBackend();
    } catch {
      return;
    }

    setEditingBlogSlug(null);
    setBlogEditorMode("edit");
    setBlogEditorPost(null);
  };

  const closeBlogEditor = () => {
    setBlogEditorPost(null);
    setBlogCropSource(null);
    setBlogCropPixels(null);
    setBlogCropPosition({ x: 0, y: 0 });
    setBlogCropZoom(1);
  };

  const getActiveEditorElement = () =>
    activeEditorKey === "desktop" ? blogContentDesktopEditorRef.current : blogContentEditorRef.current;

  const extractPlainText = (html: string) => {
    if (typeof document === "undefined") {
      return html;
    }

    const node = document.createElement("div");
    node.innerHTML = html;
    return node.innerText.replace(/\u00a0/g, " ").trimEnd();
  };

  const updateActiveEditorFormats = () => {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return;
    }

    const editor = getActiveEditorElement();

    if (!editor) {
      setActiveEditorFormats(formatStateDefaults);
      return;
    }

    const selection = window.getSelection();
    const anchorNode = selection?.anchorNode;

    if (!anchorNode || !editor.contains(anchorNode)) {
      setActiveEditorFormats(formatStateDefaults);
      return;
    }

    const formatBlockValue = String(document.queryCommandValue("formatBlock") || "").toLowerCase();

    let highlightActive = false;
    let currentNode: Node | null = anchorNode;
    while (currentNode && currentNode !== editor) {
      if (currentNode instanceof HTMLElement && (currentNode.tagName === "MARK" || currentNode.style.backgroundColor)) {
        highlightActive = true;
        break;
      }
      currentNode = currentNode.parentNode;
    }

    setActiveEditorFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      highlight: highlightActive,
      h1: formatBlockValue.includes("h1"),
      h2: formatBlockValue.includes("h2"),
      h3: formatBlockValue.includes("h3"),
      point: document.queryCommandState("insertUnorderedList"),
      clear: false,
    });
  };

  const syncEditorContent = (source: "mobile" | "desktop") => {
    const sourceEditor = source === "desktop" ? blogContentDesktopEditorRef.current : blogContentEditorRef.current;
    const targetEditor = source === "desktop" ? blogContentEditorRef.current : blogContentDesktopEditorRef.current;

    if (!sourceEditor) {
      return;
    }

    const html = sourceEditor.innerHTML;

    if (targetEditor && targetEditor.innerHTML !== html) {
      targetEditor.innerHTML = html;
    }

    setBlogEditorPost((current) => (current ? { ...current, content: html } : current));
    updateActiveEditorFormats();
  };

  useEffect(() => {
    if (!blogEditorPost) {
      return;
    }

    const html = plainToRichHtml(blogEditorPost.content || "");

    if (blogContentEditorRef.current) {
      blogContentEditorRef.current.innerHTML = html;
    }

    if (blogContentDesktopEditorRef.current) {
      blogContentDesktopEditorRef.current.innerHTML = html;
    }

    setActiveEditorFormats(formatStateDefaults);
  }, [blogEditorPost ? `${blogEditorMode}:${editingBlogSlug ?? "new"}` : "closed"]);

  useEffect(() => {
    const onSelectionChange = () => updateActiveEditorFormats();

    document.addEventListener("selectionchange", onSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, [activeEditorKey]);

  const applyEditorFormat = (action: EditorFormatAction) => {
    const editor = getActiveEditorElement();

    if (!editor || typeof document === "undefined") {
      return;
    }

    editor.focus();

    const isCurrentlyActive = activeEditorFormats[action];

    if (action === "bold") {
      document.execCommand("bold");
    }

    if (action === "italic") {
      document.execCommand("italic");
    }

    if (action === "highlight") {
      document.execCommand("styleWithCSS", false, "true");

      if (isCurrentlyActive) {
        document.execCommand("hiliteColor", false, "transparent");
        document.execCommand("backColor", false, "transparent");
      } else {
        document.execCommand("hiliteColor", false, "#E9D5FF");
        document.execCommand("backColor", false, "#E9D5FF");
      }

      document.execCommand("styleWithCSS", false, "false");
    }

    if (action === "h1") {
      document.execCommand("formatBlock", false, isCurrentlyActive ? "div" : "h1");
    }

    if (action === "h2") {
      document.execCommand("formatBlock", false, isCurrentlyActive ? "div" : "h2");
    }

    if (action === "h3") {
      document.execCommand("formatBlock", false, isCurrentlyActive ? "div" : "h3");
    }

    if (action === "point") {
      document.execCommand("insertUnorderedList");
    }

    if (action === "clear") {
      document.execCommand("removeFormat");
      document.execCommand("formatBlock", false, "div");

      if (document.queryCommandState("insertUnorderedList")) {
        document.execCommand("insertUnorderedList");
      }
    }

    syncEditorContent(activeEditorKey);
  };

  const handleBlogDelete = async (slug: string) => {
    try {
      const response = await fetch(`/api/blogs/${slug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return;
      }

      await loadBlogsFromBackend();
    } catch {
      return;
    }
  };

  const renderView = () => {
    if (activeView === "projects") {
      return (
        <section className="space-y-5">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <div className="grid grid-cols-[1.4fr_1.6fr_0.7fr] gap-4 border-b border-slate-200 px-6 py-4 text-xs uppercase tracking-[0.3em] text-slate-400">
              <span>Client Name</span>
              <span>Email</span>
              <span className="text-right">Action</span>
            </div>

            <div className="divide-y divide-slate-200">
              {leadsData.map((lead) => (
                <div key={lead.id || lead.email} className="grid grid-cols-[1.4fr_1.6fr_0.7fr] gap-4 px-6 py-5 items-center">
                  <div>
                    <p className="font-medium text-slate-900">{lead.fullName}</p>
                  </div>
                  <p className="text-sm text-slate-600">{lead.email}</p>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedLead(lead)}
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (activeView === "blog") {
      const blogCards = blogCardsData;

      return (
        <section className="space-y-5">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Insights Management</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Insights Management</h2>
              </div>

              <button
                type="button"
                onClick={openNewBlogEditor}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Add New
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-2xl font-semibold text-slate-900">All Insights</h3>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsBlogFilterOpen((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Filter className="h-4 w-4" />
                  {selectedBlogRange}
                  <ChevronDown className={`h-4 w-4 transition-transform ${isBlogFilterOpen ? "rotate-180" : "rotate-0"}`} />
                </button>

                {isBlogFilterOpen && (
                  <div className="absolute right-0 top-full z-30 mt-3 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
                    {blogRanges.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSelectedBlogRange(option);
                          setIsBlogFilterOpen(false);
                        }}
                        className={`block w-full px-4 py-3 text-left text-sm transition hover:bg-slate-50 ${selectedBlogRange === option ? "font-medium text-slate-900" : "text-slate-600"}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {blogCards.map((post) => (
              <article key={post.slug} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
                <div className="grid gap-5 p-5 lg:grid-cols-[minmax(320px,360px)_minmax(0,0.85fr)] lg:items-start lg:gap-5">
                  <div className="relative aspect-[850/520] max-w-[360px] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 lg:self-start">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill={true}
                      sizes="(max-width: 1024px) 100vw, 360px"
                      className="object-cover"
                      unoptimized={true}
                    />
                  </div>

                  <div className="flex min-w-0 flex-col justify-between gap-5">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-white">
                        <span className="rounded-full border border-[#5e53d6] bg-[#5e53d6] px-3 py-1 tracking-[0.2em] text-white">
                          {post.category}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 tracking-[0.2em] text-white ${
                            post.status === "Published"
                              ? "border border-emerald-600 bg-emerald-600"
                              : "border border-rose-600 bg-rose-600"
                          }`}
                        >
                          {post.status}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-2xl font-semibold text-slate-900">{post.title}</h4>
                        <p
                          className="max-w-3xl text-sm leading-6 text-slate-600"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">Slug: {post.slug}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
                      <p className="text-sm text-slate-500">Published date: {post.date}</p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => openBlogEditor(post)}
                          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBlogDelete(post.slug)}
                          className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (activeView === "portfolio") {
      return (
        <section className="space-y-5">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Work Management</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Work Management</h2>
              </div>

              <button
                type="button"
                onClick={openPortfolioCreate}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Add New
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <div className="space-y-4">
              {portfolioCardsData.map((item) => (
                <article key={item.id || item.title} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
                  <div className="grid gap-5 p-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
                    <div className="relative aspect-[625/410] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill={true}
                        sizes="(max-width: 1024px) 100vw, 280px"
                        className="object-cover"
                        unoptimized={true}
                      />
                    </div>

                    <div className="flex min-w-0 flex-col justify-between gap-5">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-white">
                          <span className="rounded-full border border-[#5e53d6] bg-[#5e53d6] px-3 py-1 tracking-[0.2em] text-white">
                            {item.category}
                          </span>
                          <span className="rounded-full border border-emerald-600 bg-emerald-600 px-3 py-1 tracking-[0.2em] text-white">
                            Featured Slot: {item.featuredSlot}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-2xl font-semibold text-slate-900">{item.title}</h3>
                          <p className="text-sm leading-6 text-slate-600">
                            Project Link: <span className="font-medium text-slate-900">{item.projectLink}</span>
                          </p>
                          <p className="text-sm leading-6 text-slate-500">Created: {item.created}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-4">
                        <button
                          type="button"
                          onClick={() => openPortfolioEditor(item)}
                          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePortfolioDelete(item.id)}
                          className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {defaultStats.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.label} className="rounded-[18px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5e53d6] text-white shadow-sm">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <h3 className="mt-2 text-5xl font-semibold tracking-tight text-slate-900">{item.value}</h3>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Leads</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">Client inquiries</h3>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
              <div className="grid grid-cols-[1.4fr_1.6fr_0.7fr] gap-4 border-b border-slate-200 px-5 py-4 text-xs uppercase tracking-[0.3em] text-slate-400">
                <span>Client Name</span>
                <span>Email</span>
                <span className="text-right">Action</span>
              </div>

              <div className="divide-y divide-slate-200 bg-white">
                {leadsData.map((lead) => (
                  <div key={lead.id || lead.email} className="grid grid-cols-[1.4fr_1.6fr_0.7fr] gap-4 px-5 py-4 items-center">
                    <p className="font-medium text-slate-900">{lead.fullName}</p>
                    <p className="text-sm text-slate-600">{lead.email}</p>
                    <div className="flex justify-end">
                      <button type="button" onClick={() => setSelectedLead(lead)} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Activity</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">Today's workflow</h3>
            <div className="mt-5 space-y-4">
              {[
                { title: "Client feedback added to Nova Commerce", detail: "Received at 09:20 AM" },
                { title: "New insight draft sent for review", detail: "Assigned to content editor" },
                { title: "Work hero image updated", detail: "Visible across case study cards" },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-900" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    );
  };

  const closeLeadModal = () => setSelectedLead(null);

  if (portfolioFormData) {
    return (
      <main className="fixed inset-0 z-[200] min-h-screen bg-slate-950/65 text-slate-900">
        <div className="flex min-h-screen items-start justify-center overflow-y-auto px-4 py-6 backdrop-blur-md">
          <div className="mb-6 max-h-[calc(100vh-3rem)] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_35px_100px_rgba(15,23,42,0.28)]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Add Work Item</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Add Work Item</h2>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Title</span>
                  <input
                    type="text"
                    value={portfolioFormData.title}
                    onChange={(event) =>
                      setPortfolioFormData((current) => (current ? { ...current, title: event.target.value } : current))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Category</span>
                  <select
                    value={portfolioFormData.category}
                    onChange={(event) =>
                      setPortfolioFormData((current) => (current ? { ...current, category: event.target.value } : current))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                  >
                    {portfolioCategoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Behance/Projects Link</span>
                  <input
                    type="text"
                    value={portfolioFormData.projectLink}
                    onChange={(event) =>
                      setPortfolioFormData((current) => (current ? { ...current, projectLink: event.target.value } : current))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Featured Position</span>
                  <select
                    value={portfolioFormData.featuredSlot}
                    onChange={(event) =>
                      setPortfolioFormData((current) => (current ? { ...current, featuredSlot: event.target.value } : current))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                  >
                    {portfolioSlotOptions.map((slot) => {
                      const occupiedBy = occupiedPortfolioSlots[slot];
                      const isCurrentEditingSlot =
                        portfolioEditorMode === "edit" &&
                        editingPortfolioId !== null &&
                        occupiedBy === editingPortfolioId;
                      const isOccupied = slot !== "None" && Boolean(occupiedBy) && !isCurrentEditingSlot;

                      return (
                      <option key={slot} value={slot} disabled={isOccupied}>
                        {isOccupied ? `${slot} Added` : slot}
                      </option>
                      );
                    })}
                  </select>
                </label>
              </div>

              <label className="block rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-400">
                <span className="text-sm font-medium text-slate-700">Upload Image</span>
                <p className="mt-1 text-xs text-slate-500">Upload any size. Crop tool will force website ratio 625 x 410.</p>
                <div className="mt-3 overflow-hidden rounded-[24px] border border-dashed border-slate-300 bg-white">
                  <div className="relative aspect-[625/410] cursor-pointer bg-slate-50">
                    <Image
                      src={portfolioFormData.image}
                      alt={portfolioFormData.title || "Portfolio preview"}
                      fill={true}
                      sizes="(max-width: 1024px) 100vw, 720px"
                      className="object-cover"
                      unoptimized={true}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePortfolioImageUpload}
                      title="Choose image"
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </div>
                </div>
              </label>

              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={closePortfolioCreate}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePortfolioSubmit}
                  className="rounded-full border border-[#5e53d6] bg-[#5e53d6] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                  {portfolioEditorMode === "edit" ? "Update" : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {portfolioCropSource && (
          <div className="fixed inset-0 z-[230] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
            <div className="w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_35px_100px_rgba(15,23,42,0.28)]">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Image Crop</p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900">Crop Portfolio Image</h3>
                  <p className="mt-1 text-sm text-slate-500">Final output will be 625 x 410 ratio.</p>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900/90 p-3">
                <div className="relative h-[360px] w-full overflow-hidden rounded-xl bg-black">
                  <Cropper
                    image={portfolioCropSource}
                    crop={portfolioCropPosition}
                    zoom={portfolioCropZoom}
                    aspect={PORTFOLIO_IMAGE_ASPECT_RATIO}
                    cropShape="rect"
                    showGrid={true}
                    onCropChange={setPortfolioCropPosition}
                    onZoomChange={setPortfolioCropZoom}
                    onCropComplete={(_, croppedPixels) => setPortfolioCropPixels(croppedPixels)}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Zoom</span>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.05}
                    value={portfolioCropZoom}
                    onChange={(event) => setPortfolioCropZoom(Number(event.target.value))}
                    className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200"
                  />
                </label>
              </div>

              <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={handlePortfolioCropCancel}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePortfolioCropApply}
                  className="rounded-full border border-[#5e53d6] bg-[#5e53d6] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Crop and use image
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f6fb] text-slate-900">
      <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
        <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] lg:sticky lg:top-5 lg:self-start">
            <div className="flex items-center justify-between rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.42em] text-slate-500">Admin console</p>
                <h1 className="mt-1 text-xl font-semibold text-slate-900">Hue Sixteen</h1>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-5">
              <p className="px-3 text-xs uppercase tracking-[0.35em] text-slate-500">Main</p>
              <nav className="mt-3 space-y-1">
                {sidebarLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.key;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActiveView(item.key)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                        isActive
                          ? "bg-[#5e53d6] text-white shadow-[0_12px_28px_rgba(94,83,214,0.28)]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${isActive ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600"}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="mt-5 border-t border-slate-200 pt-5">
              <p className="px-3 text-xs uppercase tracking-[0.35em] text-slate-500">Support</p>
              <nav className="mt-3 space-y-1">
                {supportLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.label}
                      type="button"
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <Icon className="h-4 w-4" />
                      </span>
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <section className="space-y-5">
            <header className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-200 bg-white px-5 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
                <p className="mt-1 text-sm text-slate-500">Where Brands Find Their Identity.</p>
              </div>

              <div className="flex items-center gap-3">
                <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600">
                  <Bell className="h-4 w-4" />
                </button>
                <div className="relative">
                  <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-white">
                      HS
                    </div>
                    <div className="leading-tight">
                      <p className="text-sm font-semibold text-slate-900">Hue Sixteen</p>
                      <p className="text-xs text-slate-500">Admin</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsProfileDrawerOpen((current) => !current)}
                      aria-expanded={isProfileDrawerOpen}
                      aria-label="Open profile actions"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${isProfileDrawerOpen ? "rotate-180" : "rotate-0"}`} />
                    </button>
                  </div>

                  {isProfileDrawerOpen && (
                    <div className="absolute right-0 top-full z-50 mt-3 w-64 rounded-[22px] border border-slate-200 bg-white p-3 shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
                      <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-4">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Account</p>
                        <h3 className="mt-1 text-base font-semibold text-slate-900">Hue Sixteen</h3>
                        <p className="text-sm text-slate-500">Admin</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-3 flex w-full items-center justify-between rounded-2xl border border-red-200 bg-white px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                      >
                        <span>Logout</span>
                        <LogOut className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {renderView()}
          </section>
        </div>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-slate-950/60 px-4 py-6 backdrop-blur-md">
          <div className="mb-6 w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.25)]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Lead details</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{selectedLead.fullName}</h2>
              </div>
              <button
                type="button"
                onClick={closeLeadModal}
                className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{selectedLead.email}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">WhatsApp Number</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{selectedLead.whatsappNumber}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Selected Service</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{selectedLead.service}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Budget Range</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{selectedLead.budget}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Preferred Contact Method</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{selectedLead.contactMethod}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Project Description</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{selectedLead.projectDescription}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {blogEditorPost && (
        <div className="fixed inset-0 z-[210] flex items-start justify-center overflow-y-auto bg-slate-950/65 px-4 py-6 backdrop-blur-md">
          <div className="mb-6 max-h-[calc(100vh-3rem)] w-full max-w-4xl overflow-y-auto rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_35px_100px_rgba(15,23,42,0.28)]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Edit Blog Post</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Edit Blog Post</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                  Fill in the blog details below. Image upload starts after crop is confirmed.
                </p>
              </div>
              <button
                type="button"
                onClick={closeBlogEditor}
                className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5">
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Title</span>
                    <input
                      type="text"
                      value={blogEditorPost.title}
                      onChange={(event) =>
                        setBlogEditorPost((current) =>
                          current ? { ...current, title: event.target.value, slug: slugify(event.target.value) } : current,
                        )
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Slug</span>
                    <input
                      type="text"
                      value={blogEditorPost.slug}
                      readOnly
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-700 outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Category</span>
                    <input
                      type="text"
                      value={blogEditorPost.category}
                      onChange={(event) => setBlogEditorPost((current) => (current ? { ...current, category: event.target.value } : current))}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Status</span>
                    <select
                      value={blogEditorPost.status}
                      onChange={(event) =>
                        setBlogEditorPost((current) => (current ? { ...current, status: event.target.value as BlogStatus } : current))
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </label>
                </div>

                <div className="space-y-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
                    {editorTools.map((tool) => (
                      <button
                        key={tool.label}
                        type="button"
                        onClick={() => applyEditorFormat(tool.action)}
                        className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                          activeEditorFormats[tool.action]
                            ? "border-[#5e53d6] bg-[#5e53d6] text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {tool.label}
                      </button>
                    ))}
                  </div>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Content</span>
                    <div
                      ref={blogContentDesktopEditorRef}
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onFocus={() => {
                        setActiveEditorKey("desktop");
                        updateActiveEditorFormats();
                      }}
                      onInput={() => syncEditorContent("desktop")}
                      onKeyUp={updateActiveEditorFormats}
                      onMouseUp={updateActiveEditorFormats}
                      className="mt-2 min-h-[280px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-slate-400 [&_h1]:text-3xl [&_h1]:leading-tight [&_h1]:font-semibold [&_h1]:my-2 [&_h2]:text-2xl [&_h2]:leading-tight [&_h2]:font-semibold [&_h2]:my-2 [&_h3]:text-xl [&_h3]:leading-tight [&_h3]:font-semibold [&_h3]:my-2"
                    />
                  </label>
                </div>
              </div>

              <aside className="space-y-5">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">Image Upload</p>
                  <p className="mt-1 text-xs text-slate-500">Upload any size. Crop window opens first, then image uploads in 850 x 520 ratio.</p>
                  <div className="mt-3 overflow-hidden rounded-[24px] border border-dashed border-slate-300 bg-white">
                    <div className="relative aspect-[850/520] cursor-pointer bg-slate-50">
                      <Image
                        src={blogEditorPost.image}
                        alt={blogEditorPost.title || "Blog preview"}
                        fill={true}
                        sizes="(max-width: 1024px) 100vw, 850px"
                        className="object-cover"
                        unoptimized={true}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBlogImageUpload}
                        title="Choose image"
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-medium text-slate-500">Tap the image area to choose a file and open crop.</p>
                </div>

                <div className="flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeBlogEditor}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleBlogUpdate}
                    className="rounded-full border border-[#5e53d6] bg-[#5e53d6] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Upload
                  </button>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  Recommended: <span className="font-medium text-slate-800">850 x 520 px</span> or any image with the same <span className="font-medium text-slate-800">aspect ratio</span>.
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}

      {blogCropSource && (
        <div className="fixed inset-0 z-[230] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_35px_100px_rgba(15,23,42,0.28)]">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Image Crop</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Crop Insight Image</h3>
                <p className="mt-1 text-sm text-slate-500">Final output will be 850 x 520 ratio.</p>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900/90 p-3">
              <div className="relative h-[360px] w-full overflow-hidden rounded-xl bg-black">
                <Cropper
                  image={blogCropSource}
                  crop={blogCropPosition}
                  zoom={blogCropZoom}
                  aspect={BLOG_IMAGE_ASPECT_RATIO}
                  cropShape="rect"
                  showGrid={true}
                  onCropChange={setBlogCropPosition}
                  onZoomChange={setBlogCropZoom}
                  onCropComplete={(_, croppedPixels) => setBlogCropPixels(croppedPixels)}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Zoom</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={blogCropZoom}
                  onChange={(event) => setBlogCropZoom(Number(event.target.value))}
                  className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={handleBlogCropCancel}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlogCropApply}
                className="rounded-full border border-[#5e53d6] bg-[#5e53d6] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                Crop and upload
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}