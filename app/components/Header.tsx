"use client";
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
export function Header() {
  const { data: session } = useSession();
  const handleSignout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-gray-400/20 py-2 rounded-xl">

      {session ? (
        <div className="flex items-center justify-between">
        
         <div className="text-white text-2xl p-2">Welcome</div>
         <button className="text-black rounded-xl bg-cyan-400 border-2 px-4 py-2" onClick={handleSignout}>SignOut</button>
        </div>
             
      ) : (
        <div className=" flex justify-end">
          
          <Link className="text-black rounded-xl bg-cyan-400 border-2 px-4 py-2" href="/login">Login</Link>
          <Link className="text-black rounded-xl bg-cyan-400 border-2 px-4 py-2" href="/register">Signin</Link>
        </div>
      )}
    </div>
  );
}
