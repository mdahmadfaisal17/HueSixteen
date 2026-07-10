import React from "react";
import { signIn } from "next-auth/react";
import { Icon } from "@iconify/react/dist/iconify.js";

const SocialSignIn = ({ actionText = "Sign In" }) => {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:flex items-center">
            <button
                onClick={() => signIn("google")}
                className="flex w-full items-center justify-center gap-2.5 rounded-full border border-dark_black border-opacity-10 p-3 text-dark_black duration-200 ease-in hover:text-white">
                {actionText}
                <Icon icon="flat-color-icons:google" width="22" height="22" />
            </button>

            <button
                onClick={() => signIn("github")}
                className="flex w-full items-center justify-center gap-2.5 rounded-full border border-dark_black dark:border-white dark:border-opacity-20 border-opacity-10 p-3 text-dark_black dark:text-white dark:bg-white dark:bg-opacity-20 duration-200 ease-in hover:text-white dark:hover:text-dark_black"
            >
                {actionText}
                <Icon icon="logos:github-icon" width="22" height="22"/>
            </button>
        </div>
    );
};

export default SocialSignIn;
