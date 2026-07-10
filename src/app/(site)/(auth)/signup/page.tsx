import SignUp from "@/components/Auth/SignUp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Create Account | Hue Sixteen",
  description: "Create your Hue Sixteen account to start working with our creative services and manage your projects.",
};

const SignupPage = () => {
  return (
    <>
      <SignUp />
    </>
  );
};

export default SignupPage;
