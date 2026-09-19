import AuthForm from "@/features/auth/components/AuthForm"
import { useNavigate } from "react-router"
import { authClient } from "@/lib/auth-client"
const Signup = () => {
  const navigate = useNavigate()

async function handlegoogleSignup(){
  await authClient.signIn.social(
        {
          provider: "google",
          callbackURL: "http://localhost:5173",
        },
        {
          onError: () => {
            return
          },
        }
      )
 }

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
        google={handlegoogleSignup}
      />
    </div>
  )
}

export default Signup
