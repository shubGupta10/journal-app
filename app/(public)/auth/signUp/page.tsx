"use client"

import {useRouter} from "next/navigation";
import React, {useState} from "react";
import {authClient} from "@/lib/auth-client";
import Link from "next/link";

export default function SignUp() {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //form state
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        await authClient.signUp.email({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            username: formData.username,
            callbackURL: '/login'
        } as any, {
            onSuccess: () => {
                router.push('/auth/login');
            },
            onError: (ctx) => {
                setLoading(false);
                setError(ctx.error.message);
            }
        })
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 animate-in fade-in duration-500">
            <div className="w-full max-w-md bg-card border border-border rounded-[var(--radius)] shadow-xl overflow-hidden">

                {/*header*/}
                <div className='p-8 pb-4 text-center'>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Enter your details below to get started
                    </p>
                </div>

            {/* form  */}
                <form onSubmit={handleSignUp} className='p-8 pt-4 space-y-4'>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium text-center border border-destructive/20">
                            {error}
                        </div>
                    )}

                    <div className='space-y-2'>
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                            Full Name:
                        </label>

                        <input
                         required
                         name='name'
                         placeholder='Enter Your Name'
                         value={formData.name}
                         onChange={handleChange}
                         className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-foreground">
                            Username
                        </label>
                        <input
                            required
                            name="username"
                            placeholder="johndoe123"
                            value={formData.username}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                        />
                    </div>


                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-foreground">
                            Email
                        </label>
                        <input
                            required
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-foreground">
                            Password
                        </label>
                        <input
                            required
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 mt-6 shadow-md"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>

                <div className="p-8 pt-0 text-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="underline underline-offset-4 hover:text-primary transition-colors font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}