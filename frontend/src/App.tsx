import { BrowserRouter, Route, Routes } from "react-router"
import LandingPage from "@/pages/landing/landingpage"
import Signup from "./features/auth/pages/signup"
import Signin from "./features/auth/pages/signin"
export function App() {
  return (
    <div className="min-h-svh w-full">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
