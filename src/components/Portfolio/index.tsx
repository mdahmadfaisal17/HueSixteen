"use client";

import { onlinePresenceList } from "@/app/api/data";
import type { onlinePresence } from "@/types/menu";
import Solutions from "@/components/Home/Solution";
import { fetchPortfoliosCached } from "@/lib/client/portfolioCache";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const portfolioPills = [
  "All",
  "Brand Identity",
  "Event Branding",
  "Social Media Design",
  "Custom Mockups",
];

function PortfolioPage() {
  const [activePill, setActivePill] = useState("All");
  const [portfolioProjects, setPortfolioProjects] = useState<onlinePresence[]>([]);

  const filteredProjects = portfolioProjects.filter((project) => {
    if (activePill === "All") {
      return true;
    }

    const normalizedActivePill = activePill.trim().toLowerCase();
    return project.tag.some((tag) => tag.trim().toLowerCase() === normalizedActivePill);
  });

  useEffect(() => {
    const loadPortfolios = async () => {
      try {
        const data = await fetchPortfoliosCached();

        if (!Array.isArray(data)) {
          return;
        }

        const mapped: onlinePresence[] = data
          .filter(
            (item): item is {
                image: string;
                title: string;
                tag?: string[];
                category?: string;
                link?: string;
                projectLink?: string;
              } =>
              typeof item.image === "string" &&
              typeof item.title === "string"
          )
          .map((item) => ({
            image: item.image,
            title: item.title,
            tag: Array.isArray(item.tag) && item.tag.length > 0 ? item.tag : [item.category ?? "General"],
            link: item.link || item.projectLink || "#",
          }));

        setPortfolioProjects(mapped);
      } catch {
        setPortfolioProjects([]);
      }
    };

    loadPortfolios();
  }, []);

  return (
    <main>
      <section className="2xl:pt-44 pt-40 2xl:pb-20 pb-11">
        <div className="container">
          <div className="flex flex-col gap-6 w-full mx-auto text-center items-center">
            <h1 className="max-w-[16ch] text-3xl leading-tight sm:text-4xl md:max-w-none md:text-6xl md:leading-tight 2xl:text-8xl 2xl:leading-[112px]">
              <span className="block whitespace-normal md:whitespace-nowrap">Selected Projects</span>
              <span className="block whitespace-normal md:whitespace-nowrap">With Real Impact</span>
            </h1>
            <p className="max-w-2xl opacity-70">
              Explore a curated collection of branding, social media, event branding, and premium 3D mockup projects, each thoughtfully crafted to help businesses communicate clearly, build trust, and leave a lasting impression.
            </p>
          </div>
        </div>
      </section>

      <section className="2xl:py-20 py-11">
        <div className="container">
          <div className="mb-8 md:mb-10 flex flex-wrap justify-center items-center gap-3">
            {portfolioPills.map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => setActivePill(pill)}
                className={`px-5 py-2.5 rounded-full border transition-all duration-300 ${
                  activePill === pill
                    ? "bg-purple_blue border-purple_blue text-white"
                    : "bg-transparent border-dark_black border-opacity-20 text-dark_black"
                }`}
              >
                {pill}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-10">
            {filteredProjects.map((project, projectIndex) => (
              <article key={`${project.title}-${project.image}-${projectIndex}`} className="group flex flex-col gap-6 cursor-pointer">
                <div className="relative">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={625}
                    height={410}
                    className="w-full rounded-2xl"
                    unoptimized={true}
                  />
                  <Link
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-0 left-0 bg-black bg-opacity-50 w-full h-full rounded-2xl flex items-center justify-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                  >
                    <span className="flex justify-center items-center w-full">
                      <Icon icon="icon-park-solid:circle-right-up" width="50" height="50" style={{ color: "#F0EDFF" }} />
                    </span>
                  </Link>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="group-hover:text-purple_blue transition-colors duration-200">{project.title}</h4>
                  <div className="flex flex-wrap gap-3">
                    {project.tag.map((tag, tagIndex) => (
                      <p key={`${tag}-${tagIndex}`} className="text-sm border border-dark_black border-opacity-10 dark:border-white dark:border-opacity-30 w-fit py-1.5 px-4 rounded-full hover:bg-dark_black hover:text-white">
                        {tag}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Solutions />
    </main>
  );
}

export default PortfolioPage;
