"use client";

import { Button } from "@/components/ui/button";
import
  {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
  } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { register } from "@/services/auth.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegisterForm({ className, ...props }) {
  const [data, setData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!data.name || !data.mobile || !data.email || !data.password) {
      return setError("Please fill in all required fields.");
    }

    if (data.password !== data.confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (data.mobile.length < 10) {
      return setError("Mobile number must be at least 10 digits.");
    }

    setSubmitting(true);

    try {
      const res = await register(
        data.name,
        data.mobile,
        data.email,
        data.password,
        "CLIENT"
      );

      console.log("User Registered:", res);

      // Optional redirect
      router.push("/dashboard/client");
    } catch (err) {
      const message =
        err?.message ||
        err?.response?.data?.message ||
        "Registration failed. Try again.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your details to register your account
          </p>
        </div>

        {/* Full Name */}
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={data.name}
            onChange={(e) =>
              setData({ ...data, name: e.target.value }) || setError("")
            }
            required
          />
        </Field>

        {/* Mobile */}
        <Field>
          <FieldLabel htmlFor="mobile">Mobile Number</FieldLabel>
          <Input
            id="mobile"
            type="number"
            placeholder="9876543210"
            value={data.mobile}
            onChange={(e) =>
              setData({ ...data, mobile: e.target.value }) || setError("")
            }
            required
          />
        </Field>

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
          <FieldLabel htmlFor="password">Password</FieldLabel>
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

        {/* Confirm Password */}
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            placeholder="******"
            value={data.confirmPassword}
            onChange={(e) =>
              setData({ ...data, confirmPassword: e.target.value }) ||
              setError("")
            }
            required
          />
        </Field>

        {/* Error Message */}
        {error && (
          <p className="text-sm p-3 rounded-md bg-red-100 text-red-700 border border-red-300 text-center">
            {error}
          </p>
        )}

        <Field>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Creating Account..." : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator />

        <FieldDescription className="text-center">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Login
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
