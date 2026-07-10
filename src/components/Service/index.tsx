"use client";
import { innovationList } from "@/app/api/data";
import Solutions from "@/components/Home/Solution";
import { fetchPortfoliosCached } from "@/lib/client/portfolioCache";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type ServiceItem = {
  id: string;
  title: string;
  price: string;
  duration: string;
  revision: string;
  shortDescription: string;
  about: string;
  includedItems?: string[];
  perfectFor?: string[];
  deliverables?: string[];
  toolsWeUse?: string[];
  processSteps?: { title: string; description: string }[];
  whyChoose?: string[];
  finalNote?: string;
  finalCta?: string;
  cardImage: string;
  galleryImages: string[];
};

type PortfolioItem = {
  image?: string;
  title?: string;
  category?: string;
  tag?: string[];
};

const services: ServiceItem[] = [
  {
    id: "brand-identity",
    title: "Brand Identity Design",
    price: "$499",
    duration: "5-7 working days",
    revision: "3 revisions",
    shortDescription:
      "Build a complete and consistent visual identity that makes your business instantly recognizable across digital and print touchpoints.",
    about:
      "Your brand is more than just a logo. It's the first impression people remember, the story they connect with, and the identity that sets you apart from competitors.\n\nAt Hue Sixteen, we create strategic brand identities that combine creativity with purpose. Every design decision is guided by your business goals, target audience, and market positioning to build a brand that feels authentic, memorable, and timeless.\n\nWhether you're launching a startup, rebranding an existing business, or expanding into new markets, we help transform your vision into a cohesive visual identity that builds trust and strengthens recognition across every customer touchpoint.\n\nFrom logo creation to complete brand guidelines, we ensure every element works together to create a professional and consistent brand experience.",
    includedItems: [
      "Custom Logo Design (Primary & Secondary Versions)",
      "Brand Strategy & Visual Direction",
      "Color Palette Selection",
      "Typography System",
      "Brand Pattern & Graphic Elements",
      "Icon & Symbol Design",
      "Business Card Design",
      "Letterhead & Stationery Design",
      "Social Media Brand Kit",
      "Brand Style Guide (PDF)",
      "Mockup Presentation",
      "Export Files (AI, EPS, SVG, PNG, JPG, PDF)",
    ],
    perfectFor: [
      "Startups",
      "Small Businesses",
      "Corporate Brands",
      "E-commerce Businesses",
      "Restaurants & Cafes",
      "Fashion & Clothing Brands",
      "SaaS & Tech Companies",
      "Personal Brands",
      "Agencies",
    ],
    deliverables: [
      "Unique Logo Concepts",
      "Final Logo Package",
      "Complete Brand Guidelines",
      "Print Ready Files",
      "Digital Ready Assets",
      "Social Media Brand Assets",
      "Transparent PNG Files",
      "Vector Source Files",
    ],
    toolsWeUse: [
      "Adobe Illustrator",
      "Adobe Photoshop",
      "Figma",
      "Adobe InDesign",
    ],
    processSteps: [
      {
        title: "1. Discovery & Research",
        description:
          "We begin by understanding your business, target audience, competitors, and long-term goals. This helps us define a clear creative direction before any design work begins.",
      },
      {
        title: "2. Brand Strategy",
        description:
          "We establish your visual personality through moodboards, typography exploration, color psychology, and creative concepts that align with your brand values.",
      },
      {
        title: "3. Logo Design",
        description:
          "Multiple logo concepts are created and refined based on your feedback until we achieve a distinctive identity that represents your business.",
      },
      {
        title: "4. Brand System Development",
        description:
          "After the logo is finalized, we build a complete visual identity system including colors, typography, icons, supporting graphics, layouts, and brand applications.",
      },
      {
        title: "5. Brand Guidelines",
        description:
          "Everything is documented in a professional brand guideline that explains how to use your brand consistently across print and digital platforms.",
      },
      {
        title: "6. Final Delivery",
        description:
          "You will receive all source files, vector formats, web-ready assets, print-ready files, mockups, and the complete brand package ready for immediate use.",
      },
    ],
    whyChoose: [
      "Strategy-First Design Approach",
      "100% Original & Custom Designs",
      "Modern & Timeless Visual Identity",
      "Scalable Brand System",
      "Print & Digital Ready Assets",
      "Fast Communication",
      "Organized File Delivery",
      "Long-Term Brand Consistency",
    ],
    finalNote:
      "A strong brand identity does not just make your business look good. It creates trust, increases recognition, and helps customers remember you long after their first interaction.",
    finalCta:
      "Let's build a brand that people recognize, trust, and remember.",
    cardImage: "https://picsum.photos/id/1025/1200/800",
    galleryImages: [
      "https://picsum.photos/id/1025/1200/800",
      "https://picsum.photos/id/1015/1200/800",
      "https://picsum.photos/id/1005/1200/800",
      "https://picsum.photos/id/106/1200/800",
      "https://picsum.photos/id/160/1200/800",
    ],
  },
  {
    id: "social-media",
    title: "Social Media Design",
    price: "$299",
    duration: "3-5 working days",
    revision: "2 revisions",
    shortDescription:
      "Get branded social media post templates and campaign-ready creatives designed to improve consistency and engagement.",
    about:
      "In today's digital world, your social media presence is often the first interaction customers have with your brand. Consistent, high-quality visuals help build trust, increase engagement, and make your business stand out in crowded feeds.\n\nAt Hue Sixteen, we create modern, brand-focused social media designs that combine creativity with marketing strategy. Every post is designed to reflect your brand identity while communicating your message clearly and effectively.\n\nWhether you're promoting products, launching campaigns, or growing your online community, we deliver designs that are visually compelling, consistent, and optimized for every major platform.",
    includedItems: [
      "Social Media Post Design",
      "Carousel Design",
      "Story Design",
      "Cover & Banner Design",
      "Promotional Graphics",
      "Product Advertisement Design",
      "Event Promotion Posts",
      "Sale Campaign Graphics",
      "Brand Template Design",
      "Highlight Cover Icons",
      "Thumbnail Design",
      "Platform-Optimized Export Files",
    ],
    perfectFor: [
      "E-commerce Brands",
      "Restaurants & Cafes",
      "Fashion Brands",
      "Startups",
      "Corporate Businesses",
      "Personal Brands",
      "Agencies",
      "Educational Institutes",
      "Events & Campaigns",
    ],
    deliverables: [
      "Ready-to-Publish Designs",
      "Editable Source Files",
      "Platform-Specific Sizes",
      "Brand Consistent Templates",
      "High Resolution Exports",
    ],
    toolsWeUse: [
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Figma",
    ],
    processSteps: [
      {
        title: "1. Brand Discovery",
        description:
          "We understand your business goals, audience, and visual identity before creating any designs.",
      },
      {
        title: "2. Content Planning",
        description:
          "We organize the content into engaging layouts that match your campaign objectives.",
      },
      {
        title: "3. Creative Design",
        description:
          "Every design is crafted with attention to typography, hierarchy, color, and brand consistency.",
      },
      {
        title: "4. Review & Refinement",
        description:
          "We refine the designs based on your feedback to ensure the final visuals meet your expectations.",
      },
      {
        title: "5. Final Delivery",
        description:
          "You will receive optimized files ready to publish across all major social media platforms.",
      },
    ],
    whyChoose: [
      "Brand-Focused Designs",
      "Marketing-Oriented Visuals",
      "High Engagement Layouts",
      "Consistent Design System",
      "Fast Turnaround",
      "Professional File Organization",
    ],
    finalNote:
      "Great content deserves great design. We help your brand communicate professionally and consistently across every social platform.",
    cardImage: "https://picsum.photos/id/1011/1200/800",
    galleryImages: [
      "https://picsum.photos/id/1011/1200/800",
      "https://picsum.photos/id/1021/1200/800",
      "https://picsum.photos/id/1027/1200/800",
      "https://picsum.photos/id/1035/1200/800",
    ],
  },
  {
    id: "event-branding",
    title: "Event Branding Design",
    price: "$399",
    duration: "4-6 working days",
    revision: "3 revisions",
    shortDescription:
      "Create a complete visual experience for events with coordinated stage, print, and digital branding assets.",
    about:
      "Every successful event deserves a visual identity that leaves a lasting impression. From corporate conferences to product launches, effective event branding creates excitement, strengthens recognition, and delivers a cohesive experience.\n\nAt Hue Sixteen, we design complete event branding systems that maintain visual consistency across every touchpoint. Our goal is to make your event memorable while ensuring every element reflects your brand professionally.\n\nWhether your event is physical, virtual, or hybrid, we create impactful visuals that enhance audience engagement and elevate the overall experience.",
    includedItems: [
      "Event Logo Design",
      "Stage Backdrop Design",
      "Banner Design",
      "Standee Design",
      "Invitation Design",
      "ID Card Design",
      "Badge Design",
      "Social Media Event Promotion",
      "Presentation Slides",
      "Certificate Design",
      "Booth Graphics",
      "Event Merchandise Graphics",
    ],
    perfectFor: [
      "Corporate Events",
      "Conferences",
      "Seminars",
      "Workshops",
      "Product Launches",
      "Award Ceremonies",
      "Festivals",
      "Community Events",
      "Brand Activations",
    ],
    deliverables: [
      "Print Ready Files",
      "Digital Assets",
      "Editable Source Files",
      "Large Format Graphics",
      "Social Promotion Materials",
    ],
    toolsWeUse: [
      "Adobe Illustrator",
      "Adobe Photoshop",
      "Adobe InDesign",
      "Figma",
    ],
    processSteps: [
      {
        title: "1. Event Brief",
        description:
          "We understand your event objectives, audience, and branding requirements.",
      },
      {
        title: "2. Creative Direction",
        description:
          "A visual concept is developed to establish the event's unique identity.",
      },
      {
        title: "3. Design Development",
        description:
          "All event materials are designed with consistency across every platform.",
      },
      {
        title: "4. Review & Approval",
        description:
          "We refine every asset until the branding feels complete and cohesive.",
      },
      {
        title: "5. Final Delivery",
        description:
          "All files are delivered in print-ready and digital-ready formats for seamless production.",
      },
    ],
    whyChoose: [
      "Consistent Event Branding",
      "Professional Print Designs",
      "Large Format Expertise",
      "Modern Visual Style",
      "Organized Deliverables",
      "Reliable Communication",
    ],
    finalNote:
      "A well-branded event creates memorable experiences that people recognize, remember, and talk about long after it ends.",
    cardImage: "https://picsum.photos/id/1003/1200/800",
    galleryImages: [
      "https://picsum.photos/id/1003/1200/800",
      "https://picsum.photos/id/1033/1200/800",
      "https://picsum.photos/id/1037/1200/800",
    ],
  },
  {
    id: "mockup-design",
    title: "3D Mockup Design",
    price: "$249",
    duration: "2-4 working days",
    revision: "2 revisions",
    shortDescription:
      "Showcase products and marketing assets using realistic and editable mockups built for presentation and client approval.",
    about:
      "Presentation matters. A realistic mockup can transform a simple design into a premium visual that captures attention, builds trust, and increases customer confidence.\n\nAt Hue Sixteen, we create high-quality 3D mockups that showcase products with exceptional realism and attention to detail. Whether for e-commerce, marketing, or client presentations, our mockups help bring your ideas to life before production.\n\nEvery mockup is designed to highlight your product professionally while maintaining realistic materials, lighting, and perspective.",
    includedItems: [
      "Product Mockups",
      "Apparel Mockups",
      "Packaging Mockups",
      "Device Mockups",
      "Branding Mockups",
      "Cosmetic Mockups",
      "Merchandise Mockups",
      "Label Mockups",
      "Custom Scene Creation",
      "High Resolution Render",
      "PSD Smart Object File",
      "Commercial Ready Assets",
    ],
    perfectFor: [
      "Clothing Brands",
      "Product Manufacturers",
      "E-commerce Stores",
      "Agencies",
      "Packaging Designers",
      "Startups",
      "Marketing Teams",
      "Amazon Sellers",
      "Shopify Stores",
    ],
    deliverables: [
      "High Resolution Images",
      "Editable PSD Mockups",
      "Smart Object Files",
      "Transparent PNG Files",
      "Multiple Viewing Angles",
      "Commercial Use Files",
    ],
    toolsWeUse: [
      "Adobe Photoshop",
      "CLO 3D",
      "Blender",
      "Adobe Illustrator",
    ],
    processSteps: [
      {
        title: "1. Project Brief",
        description:
          "We understand your product specifications, dimensions, materials, and branding requirements.",
      },
      {
        title: "2. Mockup Planning",
        description:
          "We create realistic scenes, camera angles, lighting, and presentation concepts.",
      },
      {
        title: "3. 3D Mockup Creation",
        description:
          "Every mockup is developed with accurate proportions, textures, and realistic details.",
      },
      {
        title: "4. Quality Review",
        description:
          "We carefully inspect every render to ensure premium quality and consistency.",
      },
      {
        title: "5. Final Delivery",
        description:
          "You will receive editable mockups and high-resolution presentation files ready for commercial use.",
      },
    ],
    whyChoose: [
      "Photorealistic Results",
      "Premium Product Presentation",
      "High Resolution Quality",
      "Editable PSD Files",
      "Commercial Ready Assets",
      "Detail-Oriented Workflow",
    ],
    finalNote:
      "A great product deserves an equally impressive presentation. Our 3D mockups help your products stand out, communicate quality, and make a stronger first impression.",
    cardImage: "https://picsum.photos/id/1006/1200/800",
    galleryImages: [
      "https://picsum.photos/id/1006/1200/800",
      "https://picsum.photos/id/1060/1200/800",
      "https://picsum.photos/id/1062/1200/800",
      "https://picsum.photos/id/1066/1200/800",
    ],
  },
];

function ServicePage() {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeImage, setActiveImage] = useState("");
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  const normalizeValue = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const getServiceAliases = (serviceTitle: string) => {
    const normalized = normalizeValue(serviceTitle);

    if (normalized.includes("brand identity")) {
      return ["brand identity", "brand identity design"];
    }

    if (normalized.includes("social media")) {
      return ["social media", "social media design"];
    }

    if (normalized.includes("event branding")) {
      return ["event branding", "event branding design"];
    }

    if (normalized.includes("mockup")) {
      return ["custom mockups", "mockup", "mockup design", "3d mockup", "3d mockup design"];
    }

    return [normalized];
  };

  const getServiceGalleryImages = (service: ServiceItem) => {
    const aliases = getServiceAliases(service.title);
    const matchesService = (item: PortfolioItem) => {
      const category = typeof item.category === "string" ? normalizeValue(item.category) : "";
      const title = typeof item.title === "string" ? normalizeValue(item.title) : "";
      const tags = Array.isArray(item.tag)
        ? item.tag
            .filter((tag): tag is string => typeof tag === "string")
            .map((tag) => normalizeValue(tag))
        : [];

      const searchable = [category, title, ...tags].filter(Boolean);

      return aliases.some((alias) => searchable.some((value) => value.includes(alias) || alias.includes(value)));
    };

    const relatedWorkImages = portfolioItems
      .filter(matchesService)
      .map((item) => item.image)
      .filter((image): image is string => typeof image === "string" && image.length > 0)
      .filter((image) => image !== service.cardImage);

    return [service.cardImage, ...Array.from(new Set(relatedWorkImages))];
  };

  const selectedServiceGallery = selectedService ? getServiceGalleryImages(selectedService) : [];

  const getCardAboutPreview = (text: string) => {
    const normalized = text.replace(/\s+/g, " ").trim();
    if (normalized.length <= 160) return normalized;
    return `${normalized.slice(0, 160).trim()}....`;
  };

  useEffect(() => {
    if (!selectedService) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedService(null);
        setActiveImage("");
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [selectedService]);

  useEffect(() => {
    const loadPortfolios = async () => {
      try {
        const data = await fetchPortfoliosCached();
        setPortfolioItems(Array.isArray(data) ? data : []);
      } catch {
        setPortfolioItems([]);
      }
    };

    loadPortfolios();
  }, []);

  const openServiceModal = (service: ServiceItem) => {
    setSelectedService(service);
    setActiveImage(service.cardImage);
  };

  const closeServiceModal = () => {
    setSelectedService(null);
    setActiveImage("");
  };

  return (
    <main>
      <section>
        <div className="relative w-full pt-44 2xl:pb-20 pb-10 before:absolute before:w-full before:h-full before:bg-gradient-to-r before:from-[#6DA951] before:via-white before:to-yellow_gradient before:opacity-30 before:rounded-full before:top-24 before:blur-3xl before:-z-10">
          <div className="container relative z-10">
            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8 xl:gap-12 items-center">
              <div className="flex flex-col gap-7 items-center text-center xl:items-start xl:text-left">
              <div className="flex flex-col gap-4 items-center xl:items-start">
                <h1 className="text-4xl leading-snug md:text-5xl md:leading-snug 2xl:text-6xl 2xl:leading-tight">
                  Creative Solutions For Growing Modern Brands
                </h1>
                <p className="max-w-2xl opacity-70 mx-auto xl:mx-0">
                  From brand identity and social media to event branding and premium 3D mockups, Hue Sixteen creates thoughtful visual solutions that help businesses communicate clearly, stay consistent, and leave a lasting impression.
                </p>
              </div>
              {/* Hero CTAs removed permanently */}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {innovationList.map((item, index) => (
                <div key={item.title} className={`${item.bg_color} bg-opacity-10 rounded-3xl p-5 md:p-7 min-h-44 flex flex-col justify-between ${index % 2 === 1 ? "translate-y-8" : ""}`}>
                  <span
                    aria-hidden="true"
                    className={`${item.txt_color} inline-block h-10 w-10 bg-current`}
                    style={{
                      WebkitMaskImage: `url(${item.image})`,
                      maskImage: `url(${item.image})`,
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskPosition: "center",
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                    }}
                  />
                  <h5 className={`${item.txt_color}`}>
                    {item.title.split("\n").map((line, lineIndex) => (
                      <React.Fragment key={line}>
                        {line}
                        {lineIndex < item.title.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </h5>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="pb-16 md:pb-20 lg:pb-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8">
            {services.map((service, index) => (
              <button
                key={service.id}
                type="button"
                onClick={() => openServiceModal(service)}
                className={`text-left rounded-3xl overflow-hidden border border-black/10 bg-white hover:shadow-lg transition-shadow duration-300 w-full ${index % 2 === 1 ? "md:translate-y-6" : ""}`}
              >
                <div className="overflow-hidden aspect-[625/410]">
                  <img
                    src={service.cardImage}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 md:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-2xl leading-tight">{service.title}</h4>
                    <span
                      aria-hidden="true"
                      className="mt-1 inline-block h-3 w-3 shrink-0 bg-dark_black"
                      style={{
                        WebkitMaskImage: "url('/images/svgs/arrow-up-right.svg')",
                        maskImage: "url('/images/svgs/arrow-up-right.svg')",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                      }}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-purple_blue">
                    <span>Starting: {service.price}</span>
                    <span className="h-1 w-1 rounded-full bg-purple_blue" aria-hidden="true" />
                    <span>{service.duration}</span>
                  </div>
                  <p
                    className="mt-3 opacity-70"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {getCardAboutPreview(service.about)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Solutions />

      {selectedService && (
        <div
          className="fixed inset-0 z-50 bg-black/55 p-3 sm:p-6 md:p-10"
          onClick={closeServiceModal}
          role="presentation"
        >
          <div
            className="mx-auto w-full max-w-6xl max-h-[94vh] overflow-y-auto rounded-3xl bg-white p-4 sm:p-6 md:p-8"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={selectedService.title}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-3xl md:text-4xl leading-tight">{selectedService.title}</h3>
              <button
                type="button"
                onClick={closeServiceModal}
                className="rounded-full border border-black/15 px-3 py-1.5 text-sm hover:bg-black hover:text-white transition-colors"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-[65%_30%] justify-between gap-6 md:gap-8">
              <div>
                <div className="overflow-hidden rounded-2xl bg-slate-100 aspect-[625/410] w-full">
                  <img
                    src={activeImage || selectedService.cardImage}
                    alt={`${selectedService.title} preview`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {selectedServiceGallery.map((image) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImage(image)}
                      className={`overflow-hidden rounded-xl border aspect-[625/410] ${
                        activeImage === image ? "border-black" : "border-black/10"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${selectedService.title} thumbnail`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <div className="mt-7">
                  <h4 className="text-2xl">About this service</h4>
                  <p className="mt-3 opacity-75 leading-relaxed whitespace-pre-line">{selectedService.about}</p>
                </div>

                {selectedService.includedItems && selectedService.includedItems.length > 0 && (
                  <div className="mt-7">
                    <h4 className="text-2xl">What's Included</h4>
                    <ul className="mt-3 space-y-2 opacity-80 list-disc pl-6">
                      {selectedService.includedItems.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedService.perfectFor && selectedService.perfectFor.length > 0 && (
                  <div className="mt-7">
                    <h4 className="text-2xl">Perfect For</h4>
                    <ul className="mt-3 space-y-2 opacity-80 list-disc pl-6">
                      {selectedService.perfectFor.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedService.deliverables && selectedService.deliverables.length > 0 && (
                  <div className="mt-7">
                    <h4 className="text-2xl">Deliverables</h4>
                    <ul className="mt-3 space-y-2 opacity-80 list-disc pl-6">
                      {selectedService.deliverables.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedService.toolsWeUse && selectedService.toolsWeUse.length > 0 && (
                  <div className="mt-7">
                    <h4 className="text-2xl">Tools We Use</h4>
                    <ul className="mt-3 space-y-2 opacity-80 list-disc pl-6">
                      {selectedService.toolsWeUse.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedService.processSteps && selectedService.processSteps.length > 0 && (
                  <div className="mt-7">
                    <h4 className="text-2xl">Our Process</h4>
                    <div className="mt-4 space-y-5">
                      {selectedService.processSteps.map((step, index) => (
                        <div key={`${step.title}-${index}`}>
                          <h5 className="text-xl leading-tight">{step.title}</h5>
                          <p className="mt-2 opacity-75 leading-relaxed">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedService.whyChoose && selectedService.whyChoose.length > 0 && (
                  <div className="mt-7">
                    <h4 className="text-2xl">Why Choose Hue Sixteen?</h4>
                    <ul className="mt-3 space-y-2 opacity-80 list-disc pl-6">
                      {selectedService.whyChoose.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {(selectedService.finalNote || selectedService.finalCta) && (
                  <div className="mt-7">
                    <h4 className="text-2xl">Final Note</h4>
                    {selectedService.finalNote && (
                      <p className="mt-3 opacity-75 leading-relaxed">{selectedService.finalNote}</p>
                    )}
                    {selectedService.finalCta && (
                      <p className="mt-3 text-lg font-semibold">{selectedService.finalCta}</p>
                    )}
                  </div>
                )}
              </div>

              <aside>
                <div className="rounded-2xl border border-black/10 bg-slate-50 p-5 md:p-6 lg:sticky lg:top-5">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-purple_blue">Starting Price</p>
                      <p className="text-4xl font-medium">{selectedService.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-purple_blue">Duration</p>
                      <p>{selectedService.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-purple_blue">Revision</p>
                      <p>{selectedService.revision}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      type="button"
                      className="w-full rounded-full border border-black px-5 py-3 text-sm hover:bg-black hover:text-white transition-colors"
                    >
                      See pricing
                    </button>
                    <Link
                      href="/contact"
                      className="w-full rounded-full bg-purple_blue text-white px-5 py-3 text-sm hover:opacity-90 transition-colors inline-flex justify-center"
                    >
                      Start a project
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ServicePage;
