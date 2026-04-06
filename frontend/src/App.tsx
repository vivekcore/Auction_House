import { BrowserRouter, Route, Routes } from "react-router"
import Home from "./app/home"
import Signup from "./app/auth/signup"
import Signin from "./app/auth/signin"
export function App() {
  return (
    <div className="min-h-svh w-full">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin/>} />
          <Route path="/signup" element={<Signup/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
