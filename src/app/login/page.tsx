"use client";
import { useState } from "react";
import LoginForm from "../../../components/auth/LoginForm";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  
  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      // Simulate API call
      if (data.email === "test@example.com" && data.password === "password123") {
        // Store token and redirect
        localStorage.setItem("isLoggedIn", "true");
        router.push("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-8">CERBERUS Platform</h1>
        <LoginForm onSubmit={handleLogin} />
        {error && (
          <div className="mt-4 p-3 bg-red-600 text-white rounded text-center" data-cy="page-error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
