import React, { useState } from "react";

type LoginFormProps = {
  onSubmit?: (data: { email: string; password: string }) => void;
};

export default function LoginForm({ onSubmit = () => {} }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} data-cy="login-form" className="p-6 bg-gray-800 rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">Log In</h2>
      
      {error && (
        <div className="bg-red-600 text-white p-2 mb-4 rounded" data-cy="auth-error">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-300 mb-1">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-700 text-white rounded px-3 py-2"
          data-cy="email-input"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-300 mb-1">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-700 text-white rounded px-3 py-2"
          data-cy="password-input"
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        data-cy="login-button"
      >
        Log In
      </button>
    </form>
  );
}