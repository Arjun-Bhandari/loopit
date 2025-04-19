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
    <div>
      <button onClick={handleSignout}>SignOut</button>
      {session ? (
        <div>Welcom</div>
      ) : (
        <div>
          {" "}
          <Link href="/login">Login</Link>
          <Link href="/register">Signin</Link>
        </div>
      )}
    </div>
  );
}
