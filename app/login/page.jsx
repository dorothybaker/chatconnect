"use client";

import { Input } from "@/components/ui/input";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};

    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = "Invalid email address!";
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        router.push("/");
        toast.success("Successfully logged in!");
      }
      setErrors({});
    } catch (error) {
      console.log(error);
      toast.error("Invalid email or password!");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen mx-auto px-3 flex-col w-full">
      <div className="md:w-[600px] sm:w-[500px] w-full h-full overflow-auto flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 border shadow-lg items-center justify-center p-2 sm:p-4 my-5 w-full rounded-lg"
        >
          <div className="mb-3 w-full text-center">
            <h1 className="font-semibold text-2xl text-primary">ChatConnect</h1>
            <p className="text-sm text-foreground">Log in to ChatConnect</p>
          </div>

          <div className="w-full">
            <h3 className="font-medium mb-1">Email</h3>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-[15px] !placeholder-gray-400"
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email}</span>
            )}
          </div>
          <div className="w-full">
            <h3 className="font-medium mb-1">Password</h3>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-[15px] !placeholder-gray-400"
            />
            {errors.password && (
              <span className="text-sm text-red-500">{errors.password}</span>
            )}
          </div>

          <div className="mt-4">
            <span>First time using ChatConnect? </span>
            <Link href="/register" className="text-primary hover:underline">
              Register!
            </Link>
          </div>
          <div className="w-full">
            <button
              type="submit"
              className="w-full p-2 rounded-md text-background bg-primary flex items-center justify-center hover:bg-primary/80"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin">
                  <Loader2 />
                </span>
              ) : (
                <span>Log in</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
