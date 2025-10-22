"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Monochrome (black & white) login card for Next.js (App Router or Pages Router).
 * - TypeScript + React Hook Form + Zod validation
 * - No UI kit required, pure TailwindCSS classes (monochrome only)
 * - Drop into any page: <LoginCard onLogin={yourHandler} />
 * - Or set `postTo` to POST to an API route (e.g., "/api/login").
 */

const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional().default(false),
});

export type LoginValues = z.infer<typeof LoginSchema>;

export interface LoginCardProps {
  /** Optional: custom submit handler (receives validated values). */
  onLogin?: (values: LoginValues) => Promise<void> | void;
  /** Optional: POST endpoint for built‑in submission. Ignored if onLogin is provided. */
  postTo?: string;
  /** Optional: toggle password visibility by default */
  passwordVisibleByDefault?: boolean;
  /** Optional: replace "Forgot password?" URL */
  forgotHref?: string;
  /** Optional: heading text */
  title?: string;
  /** Optional: caption text */
  subtitle?: string;
}

export default function LoginCard({
  onLogin,
  postTo = "/api/login",
  passwordVisibleByDefault = false,
  forgotHref = "/forgot-password",
  title = "Sign in",
  subtitle = "Use your email and password",
}: LoginCardProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
    clearErrors,
  } = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const [showPassword, setShowPassword] = React.useState(passwordVisibleByDefault);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const passwordVal = watch("password");

  // Debug: Component mount and state
  React.useEffect(() => {
    console.log("🎯 LoginCard component mounted"); // Debug: Component mount
    console.log("🎯 Initial props:", { onLogin, postTo, passwordVisibleByDefault, forgotHref, title, subtitle }); // Debug: Props
    console.log("🎯 Router object:", router); // Debug: Router
    console.log("🎯 Form state:", { errors, isSubmitting }); // Debug: Form state
    console.log("🎯 Local state:", { showPassword, serverError }); // Debug: Local state
  }, [onLogin, postTo, passwordVisibleByDefault, forgotHref, title, subtitle, router, errors, isSubmitting, showPassword, serverError]);

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    console.log("🚀 Form submission started with values:", values); // Debug: Form submission
    
    try {
      setServerError("");
      
      console.log("📝 Setting form state - serverError cleared"); // Debug: State change
      console.log("🔐 About to call signIn with credentials"); // Debug: Before signIn
      
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      console.log("🔍 SignIn result received:", result); // Debug: SignIn result
      console.log("🔍 Result type:", typeof result); // Debug: Result type
      console.log("🔍 Result keys:", result ? Object.keys(result) : "null"); // Debug: Result structure
      console.log("🔍 Result.ok value:", result?.ok); // Debug: ok property
      console.log("🔍 Result.error value:", result?.error); // Debug: error property
      console.log("🔍 Result.url value:", result?.url); // Debug: url property

      if (result?.error) {
        console.log("❌ SignIn error detected:", result.error); // Debug: Error handling
        console.log("❌ Error type:", typeof result.error); // Debug: Error type
        setServerError("Invalid email or password");
        return;
      }

      if (result?.ok) {
        console.log("✅ SignIn successful - result.ok is true"); // Debug: Success path
        console.log("🔄 About to redirect to /admin"); // Debug: Before redirect
        console.log("🔄 Router object:", router); // Debug: Router object
        console.log("🔄 Current URL:", window.location.href); // Debug: Current URL
        
        try {
          console.log("🔄 Calling router.push('/admin')"); // Debug: Before push
          await router.push("/admin");
          console.log("✅ router.push('/admin') completed successfully"); // Debug: Push success
        } catch (pushError) {
          console.error("❌ router.push('/admin') failed:", pushError); // Debug: Push error
        }
        
        try {
          console.log("🔄 Calling router.refresh()"); // Debug: Before refresh
          router.refresh();
          console.log("✅ router.refresh() completed successfully"); // Debug: Refresh success
        } catch (refreshError) {
          console.error("❌ router.refresh() failed:", refreshError); // Debug: Refresh error
        }
        
        console.log("✅ Redirect process completed"); // Debug: Process complete
      } else {
        console.log("⚠️ SignIn result is not ok"); // Debug: Not ok case
        console.log("⚠️ Result.ok is:", result?.ok); // Debug: ok value
        console.log("⚠️ Result.error is:", result?.error); // Debug: error value
        console.log("⚠️ Full result object:", result); // Debug: Full result
      }
    } catch (err: any) {
      console.error("💥 Unexpected error in onSubmit:", err); // Debug: Catch block
      console.error("💥 Error type:", typeof err); // Debug: Error type
      console.error("💥 Error message:", err?.message); // Debug: Error message
      console.error("💥 Error stack:", err?.stack); // Debug: Error stack
      setServerError(err?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-[60vh] grid place-items-center bg-white text-black dark:bg-black dark:text-white mt-28">
      <div className="w-full max-w-md">
        <div className="p-8 border shadow-xl rounded-2xl border-black/10 dark:border-white/10 bg-white/90 dark:bg-black/50 backdrop-blur">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm opacity-70">{subtitle}</p>
          </header>

          <form onSubmit={(e) => {
            console.log("📝 Form submit event triggered"); // Debug: Form submit
            console.log("📝 Event target:", e.target); // Debug: Event target
            console.log("📝 About to call handleSubmit(onSubmit)"); // Debug: Before handleSubmit
            handleSubmit(onSubmit)(e);
          }} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white border outline-none rounded-xl border-black/20 dark:border-white/20 dark:bg-black focus:ring-2 focus:ring-black dark:focus:ring-white"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block mb-1 text-sm font-medium">
                  Password
                </label>
            
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 bg-white border outline-none rounded-xl border-black/20 dark:border-white/20 dark:bg-black focus:ring-2 focus:ring-black dark:focus:ring-white"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 px-3 text-xs opacity-70 hover:opacity-100"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
              {/* Optional live helper */}
              {passwordVal && passwordVal.length < 6 && !errors.password && (
                <p className="mt-1 text-xs opacity-70">Minimum 6 characters.</p>
              )}
            </div>

        

            {/* Server error */}
            {serverError && (
              <div className="p-3 text-sm text-red-700 border rounded-lg border-red-500/30 bg-red-500/10 dark:text-red-300">
                {serverError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-3 font-medium text-white transition-opacity bg-black border border-black rounded-2xl hover:opacity-90 disabled:opacity-60 dark:border-white dark:bg-white dark:text-black"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

      
        </div>
      </div>
    </div>
  );
}
