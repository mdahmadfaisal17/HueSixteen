import HeroSection from "@/components/Home/Hero";
import Brand from "@/components/Home/Brand";
import WebResult from "@/components/Home/WebResult";
import Innovation from "@/components/Home/Innovation";
import OnlinePresence from "@/components/Home/OnlinePresence";
import CreativeMind from "@/components/Home/CreativeMind";
import CustomerStories from "@/components/Home/CustomerStories";
import ProcessSection from "@/components/Home/ProcessSection";
import Subscription from "@/components/Home/Subscription";
import Faq from "@/components/Home/Faq";
import OfficeLocation from "@/components/Home/OfficeLocation";
import Solutions from "@/components/Home/Solution";

const LandingSections = () => {
  return (
    <>
      <HeroSection />
      <Brand />
      <WebResult />
      <ProcessSection />
      <Innovation />
      <OnlinePresence />
      <CreativeMind />
      <CustomerStories />
      <Subscription />
      <Faq />
      <OfficeLocation />
      <Solutions />
    </>
  );
};

export default LandingSections;
