"use client"

import axios from "axios"
import { useEffect } from "react"
import { toast } from "sonner"
import { useRouter, useParams } from "next/navigation"
import { LuLoaderCircle } from "react-icons/lu"

function UserSetupPage() {

    const { email } = useParams()
    const router = useRouter()

    useEffect(() => {
        (async () => {
            try {
                if (!email) return
                const emailDecoded = decodeURIComponent(email.toString())
                const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, { email: emailDecoded }, { withCredentials: true })
                if (res.status !== 201) {
                    toast.error("Error setting up the user")
                    return
                }
                router.push("/")
            } catch (error) {
                console.log(error)
                toast.error("Something went wrong while creating the user")
                router.push("/login")
            }
        })()
    }, [email, router])

    return (
        <div className="text-zinc-100 flex flex-col justify-center items-center space-y-4">
            <h3>Setting up the user, this may take a moment.</h3>
            <LuLoaderCircle className="animate-spin text-2xl"/>
        </div>
    )
}

export default UserSetupPage