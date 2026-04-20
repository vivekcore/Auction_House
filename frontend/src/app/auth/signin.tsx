import AuthForm from "@/components/AuthForm"
import { authClient } from "@/lib/auth-client"
import type React from "react"
import { useNavigate } from "react-router"

const Signin = () => {

  const navigate = useNavigate()
 
  function handlesubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const username = formData.get("username")
    const password = formData.get("password")

    console.log({ username, password })
  }
  const  handlegooglelogin = async () => {
     await authClient.signIn.social({
      provider:"google",
      callbackURL: "http://localhost:5173",
    },
    {
      onError: () => {
        return;
      }
    }
  )
  }
  return (
    <div>
      <AuthForm
        type="signin"
        onNavigate={() => navigate("/signup")}
        onSubmit={handlesubmit}
        google={handlegooglelogin}
      />
    </div>
  )
}

export default Signin
