"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.service";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import { registerFCMTokenAfterLogin } from "./fcm/FcmInitializer";

export function LoginForm({ className, ...props }) {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const {setUser} = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ---------- VALIDATIONS ----------
    if (!data.email || !data.password) {
      return setError("Please enter both email and password.");
    }

    if (data.password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    setSubmitting(true);

    try {
      let response = await login(data.email, data.password);
      await registerFCMTokenAfterLogin();

      setUser(response.user);
      let role = response.user.role;
      toast(response.message || "Login successful!");
      router.push(`/dashboard/${response.user.role.toLowerCase()}`);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
    
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        {/* Title */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your email below to login
          </p>
        </div>

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={data.email}
            onChange={(e) =>
              setData({ ...data, email: e.target.value }) || setError("")
            }
            required
          />
        </Field>

        {/* Password */}
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="******"
            value={data.password}
            onChange={(e) =>
              setData({ ...data, password: e.target.value }) || setError("")
            }
            required
          />
        </Field>

        {/* Error message */}
        {error && (
          <p className="text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded text-center">
            {error}
          </p>
        )}

        {/* Submit */}
        <Field>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </Button>
        </Field>

        <FieldSeparator />

        {/* Bottom Text */}
        <Field>
          <FieldDescription className="text-center">
            Don't have an account?{" "}
            <Link href="/register" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
