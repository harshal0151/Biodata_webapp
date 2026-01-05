"use client"
import { signIn, signOut, useSession } from "next-auth/react"

export default function Login() {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        <p>Welcome {session?.user?.name}</p>
        <button onClick={() => signOut()}>Logout</button>
      </>
    )
  }

  return (
    <button onClick={() => signIn("google")} className="p-1 w-40 bg-blue-400 hover:cursor-pointer">
      Sign in with Google
    </button>
  )
}
