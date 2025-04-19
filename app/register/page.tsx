"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] =useState(false)
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
const data = res.json()
if(res.ok){
    setError("Registration Fail");
}
router.push("/login")
setLoading(false)
    } catch (error) {
        setError("Registration Fail");
    }
  };
  return (
    
    <div className="container mx-auto card w-96 bg-base-100 shadow-sm">

    <h1 className="text-3xl text-cyan-400 font-bold p-2 text-center w-ful">Loopit</h1>
    <h2 className="text-xl text-gray-400 text-center w-full">Create your account!</h2>
    <div className="card-body">
      <form onSubmit={handleSubmit}>
{error && <p>{error}</p>}
  
      <label htmlFor="email">Email</label>
      <input name="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="input" />
      <label htmlFor="passowrd">Password</label>
      <input name="password" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" className="input" />
      <label htmlFor="confirmpassword">Confirm Password</label>
      <input name="confirmpassword" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} type="password" placeholder="Password" className="input" />
      <div className="mt-6">
        <button className="btn bg-cyan-500 hover:bg-cyan-400 btn-block">{loading?<Loader2 className="animate-spin w-4 h-4"/>:"Register"}</button>
        <p className="pt-2 w-full text-center">Already have an accoutn <Link href="/login" className="text-blue-400">Login</Link></p>
      </div>
      </form>
    </div>
  </div>
  );
}
