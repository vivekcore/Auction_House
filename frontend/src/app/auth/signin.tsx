import AuthForm from "@/components/AuthForm"
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
  return (
    <div>
      <AuthForm
        type="signin"
        onNavigate={() => navigate("/signup")}
        onSubmit={handlesubmit}
      />
    </div>
  )
}

export default Signin
