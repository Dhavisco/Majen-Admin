"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import {
    FiArrowRight,
    FiEye,
    FiEyeOff,
    FiLock,
    FiMail,
    FiShield,
} from "react-icons/fi";

import { MajenLogo } from "../components/majen-logo";

type LoginValues = {
    email: string;
    password: string;
    // rememberDevice: boolean;
};

const initialValues: LoginValues = {
    email: "",
    password: "",
    // rememberDevice: false,
};

const loginSchema = Yup.object({
    email: Yup.string()
        .email("Please enter a valid email address.")
        .required("Email is required."),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters.")
        .max(128, "Password must be less than 128 characters.")
        .required("Password is required."),
    // rememberDevice: Yup.boolean(),
});

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (
        values: LoginValues,
        helpers: FormikHelpers<LoginValues>
    ) => {
        try {
            // Replace with your real auth API call.
            // Example: await axios.post("/api/auth/login", values);
            await new Promise((resolve) => setTimeout(resolve, 900));
            console.log("Login payload:", values);
        } finally {
            helpers.setSubmitting(false);
        }
    };

    return (
        <main className="page-shell flex min-h-screen items-center justify-center px-6 py-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(26,0,137,0.12),transparent_32%)]" />
            <div className="relative z-10 flex w-full max-w-md flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="glass-panel soft-card w-full rounded-4xl border border-white/70 p-8 sm:p-10"
                >
                    <div className="flex justify-center">
                        <MajenLogo />
                    </div>

                    <p className="mt-5 text-center text-base leading-7 text-slate-500">
                        Sign in to access the Majen admin dashboard.
                    </p>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={loginSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, errors, touched }) => (
                            <Form className="mt-8 space-y-5" noValidate>
                                <label className="block">
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                                        Email
                                    </span>
                                    <span
                                        className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-slate-500 transition-colors ${touched.email && errors.email
                                            ? "border-red-300 bg-red-50/60"
                                            : "border-[rgba(17,25,47,0.08)] bg-slate-50 focus-within:border-[rgba(26,0,137,0.28)] focus-within:bg-white"
                                            }`}
                                    >
                                        <FiMail className="text-lg" />
                                        <Field
                                            type="email"
                                            name="email"
                                            autoComplete="email"
                                            className="w-full bg-transparent text-base outline-none placeholder:text-slate-400"
                                            placeholder="admin@majen.com"
                                            aria-invalid={Boolean(touched.email && errors.email)}
                                        />
                                    </span>
                                    <ErrorMessage
                                        name="email"
                                        component="p"
                                        className="mt-2 text-sm text-red-500"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                                        <span>Password</span>
                                        <a
                                            href="#"
                                            className="text-(--brand) transition-opacity hover:opacity-80"
                                        >
                                            Forgot password?
                                        </a>
                                    </span>
                                    <span
                                        className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-slate-500 transition-colors ${touched.password && errors.password
                                            ? "border-red-300 bg-red-50/60"
                                            : "border-[rgba(17,25,47,0.08)] bg-slate-50 focus-within:border-[rgba(26,0,137,0.28)] focus-within:bg-white"
                                            }`}
                                    >
                                        <FiLock className="text-lg" />
                                        <Field
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            autoComplete="current-password"
                                            className="w-full bg-transparent text-base outline-none placeholder:text-slate-400"
                                            placeholder="Enter your password"
                                            aria-invalid={Boolean(touched.password && errors.password)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((value) => !value)}
                                            className="transition-colors hover:text-(--brand)"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <FiEyeOff className="text-lg" />
                                            ) : (
                                                <FiEye className="text-lg" />
                                            )}
                                        </button>
                                    </span>
                                    <ErrorMessage
                                        name="password"
                                        component="p"
                                        className="mt-2 text-sm text-red-500"
                                    />
                                </label>

                                {/* <label className="flex items-center gap-3 text-sm text-slate-500">
                                    <Field
                                        type="checkbox"
                                        name="rememberDevice"
                                        className="h-4 w-4 rounded border-slate-300 text-(--brand) focus:ring-(--brand)"
                                    />
                                    <span>Remember this device</span>
                                </label> */}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-(--brand) px-6 py-4 text-base font-semibold text-white! shadow-[0_14px_36px_rgba(26,0,137,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(26,0,137,0.34)] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isSubmitting ? "Signing In..." : "Login"}
                                    <FiArrowRight className="text-white" />
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <div className="my-10 h-px bg-[rgba(17,25,47,0.08)]" />

                    <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                        <FiShield />
                        Authorized Personnel Only
                    </div>
                </motion.div>

                <div className="mt-8 flex flex-col items-center gap-3 text-center text-sm text-slate-400">
                    <p>© 2026 Majen. All rights reserved.</p>
                    <div className="flex flex-wrap items-center justify-center gap-5">
                        <Link href="/">Back to landing page</Link>
                        <span>Privacy Policy</span>
                        <span>Security Standards</span>
                    </div>
                </div>
            </div>
        </main>
    );
}