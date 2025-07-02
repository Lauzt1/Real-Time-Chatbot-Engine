// src/app/admin/login/page.jsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    if (res.error) {
      setError("Invalid credentials");
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-6"
      >
        <h2 className="text-center text-2xl font-semibold">Admin Sign In</h2>
        <div>
          <label className="block text-sm font-medium mb-1 text-black">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            required
            className="w-full px-3 py-2 border rounded text-black"
            placeholder="username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-black">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="w-full px-3 py-2 border rounded text-black"
            placeholder="password"
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="px-8 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 mx-auto block cursor-pointer"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
