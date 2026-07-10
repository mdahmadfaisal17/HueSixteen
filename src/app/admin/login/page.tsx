"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

type LoginStep = "credentials" | "otp";

function AdminLoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = useState<LoginStep>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [otpHint, setOtpHint] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const adminBasePath = pathname?.endsWith("/login") ? pathname.slice(0, -6) || "/admin" : pathname || "/admin";

  const handleRequestOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Failed to send verification code.");
        return;
      }

      setChallengeId(data.challengeId);
      setOtpHint(data.maskedEmail || email);
      setStep("otp");
      setSuccessMessage(`Verification code sent to ${data.maskedEmail || email}`);
    } catch {
      setError("Failed to send verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const verifyResponse = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          challengeId,
          code: otpCode,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        setError(verifyData?.message || "Invalid verification code.");
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        otpLoginToken: verifyData.loginToken,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push(adminBasePath);
        router.refresh();
        return;
      }

      setError("Failed to complete admin login.");
    } catch {
      setError("Failed to verify code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToCredentials = () => {
    setStep("credentials");
    setOtpCode("");
    setChallengeId("");
    setOtpHint("");
    setError("");
    setSuccessMessage("");
  };

  const handleResendCode = async () => {
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Failed to resend code.");
        return;
      }

      setChallengeId(data.challengeId);
      setSuccessMessage(`Verification code resent to ${data.maskedEmail || email}`);
    } catch {
      setError("Failed to resend code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-16">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">Secure Area</p>
          <h1 className="mt-2 text-3xl font-semibold">Admin Login</h1>
          <p className="mt-2 text-sm text-black/60">
            {step === "credentials"
              ? "Enter credentials to receive a verification code."
              : `Enter the code sent to ${otpHint || email}.`}
          </p>
        </div>

        <form onSubmit={step === "credentials" ? handleRequestOtp : handleVerifyOtp} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-black/80">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-black"
              placeholder="you@example.com"
              required
              autoComplete="email"
              disabled={step === "otp"}
            />
          </div>

          {step === "credentials" ? (
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-black/80">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 pr-16 outline-none transition focus:border-black"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium text-black/65 hover:bg-black/5"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="admin-otp" className="mb-1.5 block text-sm font-medium text-black/80">
                Verification Code
              </label>
              <input
                id="admin-otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={otpCode}
                onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, ""))}
                className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-black"
                placeholder="Enter 6-digit code"
                required
                autoComplete="one-time-code"
                maxLength={8}
              />
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          {successMessage && <p className="text-sm text-green-700">{successMessage}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-dark_black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? step === "credentials"
                ? "Sending code..."
                : "Verifying..."
              : step === "credentials"
                ? "Send Verification Code"
                : "Verify and Login"}
          </button>

          {step === "otp" && (
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={handleBackToCredentials}
                className="font-medium text-black/70 hover:text-black"
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleResendCode}
                className="font-medium text-black/70 hover:text-black"
                disabled={isSubmitting}
              >
                Resend code
              </button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}

export default AdminLoginPage;
