"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function LoginForm({
  mode = "login",
  className,
  ...props
}: { mode: string } & React.ComponentProps<"div">) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();
  const [submitting, setSubmitting] = useState<boolean>(false);

  async function handleSubmission(ev: FormEvent) {
    ev.preventDefault();
    setSubmitting(true);
    if (!formRef.current) {
      return;
    }
    const formData = new FormData(formRef.current);
    const { email, password, confirm_password } = Object.fromEntries(formData.entries());
    console.log({ email, password, confirm_password });
    if (mode === "login") {
      signIn("credentials", {
        password,
        username: email,
        callbackUrl: '/dashboard'
      });
    } else {
      const res = await fetch('http://localhost:3001/signup', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      if (!res.ok) {
        console.log("failed");
        setSubmitting(false);
        return;
      }
      const resData = await res.json();
      console.log(resData);
      router.push("/auth/login");
    }
    setSubmitting(false);

  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{mode === "login" ? "Welcome back" : "Sign Up"}</CardTitle>
          <CardDescription>
            Login with your  Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmission} ref={formRef}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={() => signIn("google", {callbackUrl: '/dashboard'})}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="johndoe@example.com"
                    name="email"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" type="password" required name="password" />
                </div>
                {mode === "signup" && <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Confirm Password</Label>
                  </div>
                  <Input id="password" type="password" required name="confirm_password" />
                </div>}
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="animate-spin" />}
                  {mode === "login" ? "Login" : "Signup"}
                </Button>
              </div>
              {mode === "login" ? <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div> : <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>}
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
