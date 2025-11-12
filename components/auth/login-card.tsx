"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional().default(false),
})

export type LoginValues = z.infer<typeof LoginSchema>

export interface LoginCardProps {
  onLogin?: (values: LoginValues) => Promise<void> | void
  postTo?: string
  passwordVisibleByDefault?: boolean
  forgotHref?: string
  title?: string
  subtitle?: string
}

export function LoginCard({
  onLogin,
  postTo = "/api/login",
  passwordVisibleByDefault = false,
  forgotHref = "/forgot-password",
  title = "Sign in",
  subtitle = "Use your email and password",
}: LoginCardProps) {
  const router = useRouter()
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
  })

  const [showPassword, setShowPassword] = React.useState(passwordVisibleByDefault)
  const [serverError, setServerError] = React.useState<string | null>(null)
  const passwordVal = watch("password")

  React.useEffect(() => {
    console.log("🎯 LoginCard component mounted")
    console.log("🎯 Initial props:", { onLogin, postTo, passwordVisibleByDefault, forgotHref, title, subtitle })
    console.log("🎯 Router object:", router)
    console.log("🎯 Form state:", { errors, isSubmitting })
    console.log("🎯 Local state:", { showPassword, serverError })
  }, [onLogin, postTo, passwordVisibleByDefault, forgotHref, title, subtitle, router, errors, isSubmitting, showPassword, serverError])

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    console.log("🚀 Form submission started with values:", values)

    try {
      setServerError("")

      console.log("📝 Setting form state - serverError cleared")
      console.log("🔐 About to call signIn with credentials")

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      console.log("🔍 SignIn result received:", result)
      console.log("🔍 Result type:", typeof result)
      console.log("🔍 Result keys:", result ? Object.keys(result) : "null")
      console.log("🔍 Result.ok value:", result?.ok)
      console.log("🔍 Result.error value:", result?.error)
      console.log("🔍 Result.url value:", result?.url)

      if (result?.error) {
        console.log("❌ SignIn error detected:", result.error)
        console.log("❌ Error type:", typeof result.error)
        setServerError("Invalid email or password")
        return
      }

      if (result?.ok) {
        console.log("✅ SignIn successful - result.ok is true")
        console.log("🔄 About to redirect to /admin")
        console.log("🔄 Router object:", router)
        console.log("🔄 Current URL:", window.location.href)

        try {
          console.log("🔄 Calling router.push('/admin')")
          await router.push("/admin")
          console.log("✅ router.push('/admin') completed successfully")
        } catch (pushError) {
          console.error("❌ router.push('/admin') failed:", pushError)
        }

        try {
          console.log("🔄 Calling router.refresh()")
          router.refresh()
          console.log("✅ router.refresh() completed successfully")
        } catch (refreshError) {
          console.error("❌ router.refresh() failed:", refreshError)
        }

        console.log("✅ Redirect process completed")
      } else {
        console.log("⚠️ SignIn result is not ok")
        console.log("⚠️ Result.ok is:", result?.ok)
        console.log("⚠️ Result.error is:", result?.error)
        console.log("⚠️ Full result object:", result)
      }
    } catch (err: any) {
      console.error("💥 Unexpected error in onSubmit:", err)
      console.error("💥 Error type:", typeof err)
      console.error("💥 Error message:", err?.message)
      console.error("💥 Error stack:", err?.stack)
      setServerError(err?.message || "Something went wrong")
    }
  }

  return (
    <div className="min-h-[60vh] grid place-items-center bg-white text-black dark:bg-black dark:text-white mt-28">
      <div className="w-full max-w-md">
        <div className="p-8 border shadow-xl rounded-2xl border-black/10 dark:border-white/10 bg-white/90 dark:bg-black/50 backdrop-blur">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm opacity-70">{subtitle}</p>
          </header>

          <form
            onSubmit={(e) => {
              console.log("📝 Form submit event triggered")
              console.log("📝 Event target:", e.target)
              console.log("📝 About to call handleSubmit(onSubmit)")
              handleSubmit(onSubmit)(e)
            }}
            className="space-y-5"
          >
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
              {passwordVal && passwordVal.length < 6 && !errors.password && (
                <p className="mt-1 text-xs opacity-70">Minimum 6 characters.</p>
              )}
            </div>

            {serverError && (
              <div className="p-3 text-sm text-red-700 border rounded-lg border-red-500/30 bg-red-500/10 dark:text-red-300">
                {serverError}
              </div>
            )}

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
  )
}

