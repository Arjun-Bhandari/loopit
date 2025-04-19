"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {  Loader2 } from "lucide-react";
import Link from "next/link";
export default function login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
const handleSignin = async (e:React.FormEvent<HTMLFormElement>)=>{
e.preventDefault();
setLoading(true);

try{
const result = await signIn("credentials",{
  email,
  password,
  redirect:false,
});

if(result?.error){
  setError(error)
}else{
  router.push("/")
  router.refresh()
}
}catch(error){
setError("Something went wrong")
}
}
  return (
  
      <div className="container mx-auto card w-96 bg-base-100 shadow-sm">

        <h1 className="text-3xl text-cyan-400 font-bold p-2 text-center w-ful">Loopit</h1>
        <h2 className="text-xl text-gray-400 text-center w-full">Welcom Back!</h2>
        <div className="card-body">
          <form onSubmit={handleSignin}>


   
          <label htmlFor="email">Email</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} name="email" type="email" placeholder="Email" className="input" />
          <label htmlFor="passowrd">Password</label>
          <input name="password" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" className="input" />
          <div className="mt-6">
            <button type="submit" className="btn bg-cyan-500 hover:bg-cyan-400 btn-block">{loading?<Loader2 className="animate-spin w-4 h-4"/>:"Login"}</button>
            <p className="pt-2 w-full text-center">
            Don't have an account? <Link href="/register" className="text-blue-400">Register</Link>
          </p>
         </div>
          </form>
        </div>
      </div>
    
  );
}
