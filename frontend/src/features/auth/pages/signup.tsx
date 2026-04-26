import AuthForm from "@/features/auth/components/AuthForm"
import { useNavigate } from "react-router"

const Signup = () => {
  const navigate = useNavigate()
  function handlesubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const firstname = formData.get("firstname")
    const lastname = formData.get("lastname")
    const username = formData.get("username")
    const password = formData.get("password")

    console.log({ firstname, lastname, username, password })
  }
  return (
    <div>
      <AuthForm
        type="signup"
        onNavigate={() => navigate("/signin")}
        onSubmit={handlesubmit}
      />
    </div>
  )
}

export default Signup
