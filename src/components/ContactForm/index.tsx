"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

type ContactFormProps = {
    isPopup?: boolean;
};

function ContactForm({ isPopup = false }: ContactFormProps) {
    const initialFormData = {
        fullName: "",
        email: "",
        whatsappNumber: "",
        service: "brand identity design",
        budget: "",
        contactMethod: "whatsapp",
        projectDescription: ""
    };
    const [formData, setFormData] = useState({
        ...initialFormData
    });
    const [submitted, setSubmitted] = useState(false);
    const [loader, setLoader] = useState(false);
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const reset = () => {
        setFormData(initialFormData);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoader(true);

        try {
            const response = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    whatsappNumber: formData.whatsappNumber,
                    service: formData.service,
                    budget: formData.budget,
                    contactMethod: formData.contactMethod,
                    projectDescription: formData.projectDescription,
                }),
            });

            if (!response.ok) {
                setSubmitted(false);
                return;
            }

            setSubmitted(true);
            reset();
        } catch {
            setSubmitted(false);
        } finally {
            setLoader(false);
        }
    };


    return (
        <section>
            <div className={isPopup ? "w-full" : "relative w-full pt-44 2xl:pb-20 pb-10 before:absolute before:w-full before:h-full before:bg-gradient-to-r before:from-blue_gradient before:via-white before:to-yellow_gradient before:rounded-full before:top-24 before:blur-3xl before:-z-10"}>
                <div className={isPopup ? "w-full" : "container relative z-10"}>
                    <div className={isPopup ? "flex flex-col gap-8" : "flex flex-col gap-10 md:gap-20"}>
                        <div className='relative flex flex-col text-center items-center'>
                            <h2 className='font-medium w-full max-w-32'>
                                Start a Project
                            </h2>
                        </div>
                        {submitted ? (
                            <div className="flex flex-col items-center gap-5 text-center max-w-xl mx-auto p-6 rounded-lg bg-green bg-opacity-20">
                                <div className="flex">
                                    <Icon icon="ix:success-filled" width="30" height="30" style={{ color: "#6DA951" }} />
                                    <h5 className="text-green">Great!!! Email has been Successfully Sent. We will get in touch asap.</h5>
                                </div>

                                <Link href="/" className='group w-fit text-black font-medium bg-transparent rounded-full flex items-center gap-4 py-2 pl-5 pr-2 border border-dark_black hover:text-dark_black'>
                                    <span className="group-hover:text-dark_black">Back to home</span>
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-colors duration-200 ease-in-out">
                                        <rect width="32" height="32" rx="16" fill="white" className=" transition-colors duration-200 ease-in-out fill-black" />
                                        <path d="M11.832 11.3334H20.1654M20.1654 11.3334V19.6668M20.1654 11.3334L11.832 19.6668" stroke="#0C0B10" strokeWidth="1.42857" strokeLinecap="round" strokeLinejoin="round" className=' transition-colors duration-200 ease-in-out stroke-white' />
                                    </svg>
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className={isPopup ? "flex flex-col bg-white rounded-2xl p-4 sm:p-6 md:p-8 gap-8" : "flex flex-col bg-white rounded-2xl p-8 gap-8"}>
                                <div className="flex flex-col md:flex md:flex-row gap-6">
                                    <div className="w-full">
                                        <label htmlFor="fullName">Full Name *</label>
                                        <input
                                            className="w-full mt-2 rounded-full border px-5 py-3 outline-none transition dark:border-white dark:border-opacity-20
                                                focus:border-dark_black dark:focus:border-white focus:border-opacity-50 dark:focus:border-opacity-50"
                                            id="fullName"
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="email">Email Address *</label>
                                        <input
                                            className="w-full mt-2 rounded-full border px-5 py-3 outline-none transition dark:border-white dark:border-opacity-20
                                                focus:border-dark_black dark:focus:border-white focus:border-opacity-50 dark:focus:border-opacity-50"
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email address"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex md:flex-row gap-6">
                                    <div className="w-full">
                                        <label htmlFor="whatsappNumber">WhatsApp Number *</label>
                                        <input
                                            className="w-full mt-2 rounded-full border px-5 py-3 outline-none transition dark:border-white dark:border-opacity-20
                                                focus:border-dark_black dark:focus:border-white focus:border-opacity-50 dark:focus:border-opacity-50"
                                            id="whatsappNumber"
                                            type="tel"
                                            name="whatsappNumber"
                                            value={formData.whatsappNumber}
                                            onChange={handleChange}
                                            placeholder="Enter your WhatsApp number"
                                            required
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="service">Select Service *</label>
                                        <div className="relative mt-2">
                                            <select
                                                className="w-full text-base px-4 pr-12 rounded-full py-2.5 border transition-all duration-500 dark:border-white dark:border-opacity-20 focus:outline-0 appearance-none"
                                                name="service"
                                                id="service"
                                                value={formData.service}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="brand identity design">Brand Identity Design</option>
                                                <option value="social media design">Social Media Design</option>
                                                <option value="event branding design">Event Branding Design</option>
                                                <option value="3d mockup design">3D Mockup Design</option>
                                                <option value="others">Others</option>
                                            </select>
                                            <svg
                                                aria-hidden="true"
                                                className="pointer-events-none absolute right-5 top-1/2 h-3 w-3 -translate-y-1/2 text-dark_black"
                                                viewBox="0 0 12 12"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M2 4.5L6 8L10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex md:flex-row gap-6">
                                    <div className="w-full">
                                        <label htmlFor="budget">Budget Range (USD)</label>
                                        <div className="relative mt-2">
                                            <select
                                                className="w-full text-base px-4 pr-12 rounded-full py-2.5 border transition-all duration-500 dark:text-white border-solid dark:border-white dark:border-opacity-20 focus:outline-0 appearance-none"
                                                name="budget"
                                                id="budget"
                                                value={formData.budget}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select budget range</option>
                                                <option value="under-500">Under $500</option>
                                                <option value="500-1500">$500 - $1,500</option>
                                                <option value="1500-5000">$1,500 - $5,000</option>
                                                <option value="5000-plus">$5,000+</option>
                                            </select>
                                            <svg
                                                aria-hidden="true"
                                                className="pointer-events-none absolute right-5 top-1/2 h-3 w-3 -translate-y-1/2 text-dark_black"
                                                viewBox="0 0 12 12"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M2 4.5L6 8L10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="contactMethod">Preferred Contact Method</label>
                                        <div className="relative mt-2">
                                            <select
                                                className="w-full text-base px-4 pr-12 rounded-full py-2.5 border transition-all duration-500 dark:text-white border-solid dark:border-white dark:border-opacity-20 focus:outline-0 appearance-none"
                                                name="contactMethod"
                                                id="contactMethod"
                                                value={formData.contactMethod}
                                                onChange={handleChange}
                                            >
                                                <option value="whatsapp">WhatsApp</option>
                                                <option value="email">Email</option>
                                            </select>
                                            <svg
                                                aria-hidden="true"
                                                className="pointer-events-none absolute right-5 top-1/2 h-3 w-3 -translate-y-1/2 text-dark_black"
                                                viewBox="0 0 12 12"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M2 4.5L6 8L10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <p className="mt-2 text-sm opacity-70">
                                            Note: You will be contacted as early as possible through the method you select.
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <label htmlFor="projectDescription">Project Description</label>
                                    <textarea
                                        className="w-full mt-2 rounded-3xl border px-5 py-3 outline-none transition dark:border-white dark:border-opacity-20
                                        focus:border-dark_black dark:focus:border-white focus:border-opacity-50 dark:focus:border-opacity-50"
                                        name="projectDescription"
                                        id="projectDescription"
                                        value={formData.projectDescription}
                                        onChange={handleChange}
                                        placeholder="Tell us about your project details"
                                        rows={4}
                                    />
                                </div>
                                <div>
                                    {!loader ? (
                                        <button
                                            type="submit"
                                            className='group w-fit text-white dark:text-dark_black font-medium bg-dark_black dark:bg-white rounded-full flex items-center gap-4 py-2 pl-5 pr-2 transition-colors duration-200 ease-in-out hover:bg-purple_blue hover:text-white border border-dark_black hover:border-purple_blue'
                                        >
                                            <span>Submit Project Details</span>
                                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white transition-colors duration-200 ease-in-out">
                                                <span
                                                    aria-hidden="true"
                                                    className="inline-block h-3 w-3 bg-dark_black transition-colors duration-200 ease-in-out group-hover:bg-purple_blue"
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
                                            </span>
                                        </button>
                                    ) : (
                                        <button className="bg-grey item-center flex gap-2 py-3 px-7 rounded">
                                            <div
                                                className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
                                                role="status"
                                                aria-label="loading"
                                            >
                                                <span className="sr-only">Loading...</span>
                                            </div>{" "}
                                            Submitting
                                        </button>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ContactForm;
