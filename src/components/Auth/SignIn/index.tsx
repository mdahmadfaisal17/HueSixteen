"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import SocialSignIn from "../SocialSignIn";
import Loader from "@/components/commonComponent/Loader";
import Logo from "@/components/Layout/Header/Logo";

const Signin = () => {
    const [loading, setLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    }); //login data state

    const [validationErrors, setValidationErrors] = useState({
        email: "",
        password: "",
    }); //validation state

    // Input validation function
    const validateForm = () => {
        let errors = { email: "", password: "" };
        let isValid = true;

        if (!loginData.email) {
            errors.email = "Email is required.";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
            errors.email = "Please enter a valid email address.";
            isValid = false;
        }

        if (!loginData.password) {
            errors.password = "Password is required.";
            isValid = false;
        } else if (loginData.password.length < 6) {
            errors.password = "Password must be at least 6 characters long.";
            isValid = false;
        }
        setValidationErrors(errors);
        return isValid;
    };

    // form handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            toast.error("Email/password sign in is disabled. Please use a trusted provider or the admin login flow.");
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <div className="relative w-full pt-44 2xl:pb-20 pb-10 before:absolute before:w-full before:h-full before:bg-gradient-to-r before:from-blue_gradient before:via-white before:to-yellow_gradient before:rounded-full before:top-24 before:blur-3xl  before:-z-10">
                <div className="container">
                    <div className="-mx-4 flex flex-wrap">
                        <div className="w-full px-4">
                            <div className="relative shadow-lg mx-auto max-w-32 overflow-hidden rounded-lg bg-white px-8 py-14 text-center sm:px-12 md:px-16">
                                <div className="mb-10 flex justify-center">
                                    <Logo />
                                </div>

                                <SocialSignIn actionText="Sign In" />

                                <span className="z-1 relative my-8 block text-center">
                                    <span className="-z-1 absolute left-0 top-1/2 block h-px w-full bg-dark_black bg-opacity-10"></span>
                                    <span className="text-sm text-dark_black text-opacity-50 relative z-10 inline-block bg-white px-3">
                                        OR
                                    </span>
                                </span>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-5 text-left">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            onChange={(e) =>
                                                setLoginData({ ...loginData, email: e.target.value })
                                            }
                                            className={`w-full rounded-full border px-5 py-3 outline-none transition dark:border-white dark:border-opacity-20
                                                ${validationErrors.email ? 'border-red-500' : 'border-stroke'} 
                                                focus:border-dark_black dark:focus:border-white focus:border-opacity-50 dark:focus:border-opacity-50`}
                                        />
                                        {validationErrors.email && (
                                            <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                                        )}
                                    </div>
                                    <div className="mb-5 text-left">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            onChange={(e) =>
                                                setLoginData({ ...loginData, password: e.target.value })
                                            }
                                            className={`w-full rounded-full border px-5 py-3 outline-none transition  dark:border-white dark:border-opacity-20 
                                                ${validationErrors.email ? ' border-red-500' : 'border-stroke'} 
                                                focus:border-dark_black dark:focus:border-white focus:border-opacity-50 dark:focus:border-opacity-50`}
                                        />
                                        {validationErrors.password && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                                        )}
                                    </div>
                                    <div className="mb-9">
                                        <button
                                            type="submit"
                                            className="flex w-full px-5 py-3 font-medium cursor-pointer items-center justify-center transition-colors duration-300 ease-in-out rounded-full border border-dark_black bg-dark_black text-white hover:text-dark_black"
                                        >
                                            Sign In {loading && <Loader />}
                                        </button>
                                    </div>
                                </form>

                                <Link
                                    href="/forgot-password"
                                    className="mb-2 inline-block text-dark_black text-opacity-70 hover:text-opacity-100"
                                >
                                    Forget Password?
                                </Link>
                                <p className="text-dark_black text-opacity-70 dark:text-opacity-50">
                                    Not a member yet?{" "}
                                    <Link href="/signup" className="text-dark_black dark:text-white hover:text-opacity-50 dark:hover:text-opacity-50">
                                        Sign Up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signin;
