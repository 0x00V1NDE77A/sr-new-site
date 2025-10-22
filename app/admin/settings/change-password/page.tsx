"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/(?=.*[a-z])/, "Password must contain at least one lowercase letter")
    .regex(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
    .regex(/(?=.*\d)/, "Password must contain at least one number")
    .regex(/(?=.*[@$!%*?&])/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your new password")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type PasswordFormData = z.infer<typeof passwordSchema>

export default function ChangePasswordPage() {
  const router = useRouter()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSigningOut, setIsSigningOut] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema)
  })

  const newPassword = watch("newPassword")

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: "", color: "" }
    
    let score = 0
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    }

    score = Object.values(checks).filter(Boolean).length

    if (score <= 2) return { score, label: "Weak", color: "text-red-500" }
    if (score <= 3) return { score, label: "Fair", color: "text-yellow-500" }
    if (score <= 4) return { score, label: "Good", color: "text-blue-500" }
    return { score, label: "Strong", color: "text-green-500" }
  }

  const passwordStrength = getPasswordStrength(newPassword || "")

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to change password")
      }

      setSuccess("Password changed successfully! You will be signed out in 3 seconds...")
      toast.success("Password changed successfully! Signing out...")
      reset()
      
      // Auto sign out after 3 seconds
      setTimeout(async () => {
        setIsSigningOut(true)
        try {
          await signOut({ 
            redirect: false,
            callbackUrl: '/sr-auth/login'
          })
          toast.success("Please log in again with your new password")
          router.push('/sr-auth/login')
        } catch (signOutError) {
          console.error('Sign out error:', signOutError)
          // Force redirect even if signOut fails
          router.push('/sr-auth/login')
        }
      }, 3000)
      
    } catch (err: any) {
      const errorMessage = err.message || "Failed to change password"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl p-4 mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Change Password</h1>
          <p className="text-muted-foreground">
            Update your admin account password to keep your account secure
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Password Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

                             {success && (
                 <Alert className="text-green-800 border-green-200 bg-green-50">
                   <CheckCircle className="w-4 h-4" />
                   <AlertDescription>
                     {success}
                     {isSigningOut && (
                       <div className="flex items-center gap-2 mt-2">
                         <Loader2 className="w-4 h-4 animate-spin" />
                         <span className="text-sm">Signing out...</span>
                       </div>
                     )}
                   </AlertDescription>
                 </Alert>
               )}

              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    {...register("currentPassword")}
                    className="pr-10"
                    placeholder="Enter your current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    {...register("newPassword")}
                    className="pr-10"
                    placeholder="Enter your new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                )}
                
                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength.score <= 2 ? 'bg-red-500' :
                            passwordStrength.score <= 3 ? 'bg-yellow-500' :
                            passwordStrength.score <= 4 ? 'bg-blue-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${passwordStrength.color}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className="pr-10"
                    placeholder="Confirm your new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h4 className="mb-2 text-sm font-medium">Password Requirements:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• At least 8 characters long</li>
                  <li>• One uppercase letter (A-Z)</li>
                  <li>• One lowercase letter (a-z)</li>
                  <li>• One number (0-9)</li>
                  <li>• One special character (@$!%*?&)</li>
                </ul>
              </div>

                             {/* Submit Button */}
               <Button 
                 type="submit" 
                 className="w-full" 
                 disabled={isLoading || isSigningOut}
               >
                 {isLoading ? (
                   <>
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                     Changing Password...
                   </>
                 ) : isSigningOut ? (
                   <>
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                     Signing Out...
                   </>
                 ) : (
                   "Change Password"
                 )}
               </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Security Notice
                </h4>
                                 <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
                   After changing your password, you will be automatically signed out for security reasons. 
                   You'll need to log in again with your new password. Make sure to use a strong, unique password that you haven't used elsewhere.
                 </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
