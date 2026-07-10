import WebResult from "@/components/Home/WebResult";
import Solutions from "@/components/Home/Solution";
import Faq from "@/components/Home/Faq";
import CreativeMind from "@/components/Home/CreativeMind";
import OfficeLocation from "@/components/Home/OfficeLocation";
import Brand from "@/components/Home/Brand";
import ProcessSection from "@/components/Home/ProcessSection";
import Link from "next/link";
import Image from 'next/image';

const differentials = [
  {
    title: "Brand-first thinking",
    description: "We design with clarity, consistency, and business goals in mind so every visual decision supports growth.",
  },
  {
    title: "Custom, not template-driven",
    description: "Each project is tailored from scratch to match the brand voice, audience, and creative direction.",
  },
  {
    title: "Fast communication",
    description: "We keep feedback loops simple, organized, and transparent so projects move forward smoothly.",
  },
  {
    title: "Flexible collaboration",
    description: "From startups to established teams, we adapt to your workflow and deliverables with ease.",
  },
];

function AboutPage() {
  return (
    <main>
      <section className="2xl:pt-44 pt-40 2xl:pb-20 pb-11">
        <div className="container">
          <div className="flex flex-col gap-6 md:gap-8 items-center text-center">
            <div className="w-full flex flex-col gap-3 items-center">
              <h1 className="text-3xl leading-[1.2] sm:text-4xl sm:leading-[1.2] md:text-6xl md:leading-tight 2xl:text-8xl 2xl:leading-[112px]">
                <span className="block whitespace-nowrap">Built With Purpose</span>
                <span className="block whitespace-nowrap">Driven By Creativity</span>
              </h1>
              <p className="max-w-3xl opacity-70">
                What started as a solo creative journey has grown into a branding agency dedicated to helping businesses communicate with clarity, build meaningful connections, and create brands people remember.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden w-full max-w-5xl mx-auto">
              <img 
                src="https://res.cloudinary.com/dglcrxfit/image/upload/v1780470893/ChatGPT-Image-Jun-3_-2026_-12_43_39-PM_kxubu7.jpg" 
                alt="Creative team brainstorming" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="w-full grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start py-10">
              <div className="space-y-8">
                <p className="w-full text-left text-xl md:text-2xl !leading-[1.8] opacity-70">
                  Hue Sixteen began in <span className="bg-yellow-200 px-1 rounded-sm">July 2022</span> with a simple idea: to turn great design into <span className="bg-yellow-200 px-1 rounded-sm">a brand people could trust</span>. After working independently with clients and seeing the impact thoughtful design could make, I decided to build something bigger than a personal portfolio. I wanted to create <span className="bg-yellow-200 px-1 rounded-sm">a creative agency</span> that helped businesses communicate their message with <span className="bg-yellow-200 px-1 rounded-sm">clarity and purpose</span>.
                </p>
                <p className="w-full text-left text-xl md:text-2xl !leading-[1.8] opacity-70">
                  What started as a <span className="bg-yellow-200 px-1 rounded-sm">solo journey</span> gradually evolved into a <span className="bg-yellow-200 px-1 rounded-sm">growing remote team</span>. Today, Hue Sixteen brings together talented creatives from different countries, collaborating to deliver branding, social media design, event branding, and premium 3D mockups. While we&apos;re proud of how far we&apos;ve come, we believe this is <span className="bg-yellow-200 px-1 rounded-sm">only the beginning</span> of a much bigger journey.
                </p>
              </div>
              <div className="flex flex-col gap-4 w-full lg:max-w-[460px]">
                <div className="overflow-hidden rounded-3xl bg-dark_black/5">
                  <Image
                    src="/images/founder.png"
                    alt="Abdullah Al Faysal"
                    width={600}
                    height={746}
                    className="w-full h-auto"
                    unoptimized={true}
                  />
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-dark_black">Abdullah Al Faysal</p>
                  <p className="text-base opacity-70">Founder & Brand Designer</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left: Quote top, paragraph, then full-width image */}
            <div className="flex flex-col gap-6 h-full">
              <Image src="/images/home/icon/Quote.svg" alt="quote" width={36} height={36} className="opacity-60" />
              <p className="text-3xl leading-relaxed opacity-80">
                We believe every memorable brand begins with a clear purpose. Great design is more than aesthetics. It's about communicating ideas with clarity, building trust through consistency, and creating meaningful experiences that people remember long after the first impression.
              </p>

              <div className="w-full rounded-2xl overflow-hidden" style={{height: '120px'}}>
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=60" alt="decorative" className="w-full h-[120px] object-cover" />
              </div>
            </div>

            {/* Right: Brand card with logo/title */}
            <div className="flex flex-col h-full">
              <div className="rounded-3xl bg-purple_blue text-white p-8 shadow-lg h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Image src="/images/logo/LogoforPurple.svg" alt="logo" width={40} height={40} className="h-10 w-10" />
                    <span className="uppercase text-base font-medium opacity-90">Our Mission & Vision</span>
                  </div>
                </div>
                <p className="mt-4 text-white text-lg leading-relaxed">
                  <span className="font-medium">OUR MISSION</span><br />
                  To help businesses communicate with clarity through strategic branding and purposeful design. We create meaningful visual identities that build trust, strengthen connections, and help brands stand out with confidence in every customer interaction.
                </p>
                <p className="mt-4 text-white text-lg leading-relaxed">
                  <span className="font-medium">OUR VISION</span><br />
                  To grow Hue Sixteen into a globally trusted branding agency, building a team of exceptional creatives who deliver purposeful design, inspire meaningful business growth, and create lasting value for brands across the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Brand />

      <WebResult />

      <ProcessSection />

      <CreativeMind />

      <Faq />

      <OfficeLocation />

      <Solutions />
    </main>
  );
}

export default AboutPage;
