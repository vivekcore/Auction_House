import { CircleUser, Eye, EyeOff, Lock, User, UsersRound } from "lucide-react"
import type React from "react"
import { useState } from "react"

interface formProps {
  type: "signin" | "signup"
  onSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void
  onNavigate: () => void
}
export default function AuthForm({ type, onSubmit, onNavigate }: formProps) {

  const [showPassword,setShowPassword] = useState(false);
  return (
    <div className="flex h-screen w-full p-10">
      <div className="hidden w-full transform pl-10 md:block">
        <img
          className="h-full w-xl rounded-2xl object-cover"
          src="https://i.pinimg.com/736x/07/5d/1f/075d1fe7e6f1ead5510ca00af521d1d4.jpg"
          alt="leftSideImage"
        />
      </div>

      <div className="flex w-full transform flex-col items-center justify-center">
        <form
          onSubmit={onSubmit}
          className="flex w-80 flex-col items-center justify-center md:w-96"
        >
          {type === "signup" && (
            <>
              <h2 className="text-4xl font-medium text-primary">Sign up</h2>
              <p className="mt-3 text-sm text-secondary-foreground">
                Welcome! Please sign up to continue
              </p>

              <button
                type="button"
                className="mt-8 cursor-pointer flex h-12 w-full items-center justify-center rounded-full bg-gray-500/10"
              >
                <img
                  src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                  alt="googleLogo"
                />
              </button>

              <div className="my-5 flex w-full items-center gap-4">
                <div className="h-px w-full bg-muted-foreground"></div>
                <p className="w-full text-sm text-nowrap text-secondary-foreground/50">
                  or sigup in with email
                </p>
                <div className="h-px w-full bg-muted-foreground"></div>
              </div>
            </>
          )}
          {type === "signin" && (
            <>
              <h2 className="text-4xl font-medium text-primary">Sign in</h2>
              <p className="mt-3 text-sm text-secondary-foreground">
                Welcome back! Please sign in to continue
              </p>

              <button
                type="button"
                className="mt-8 cursor-pointer flex h-12 w-full items-center justify-center rounded-full bg-gray-500/10"
              >
                <img
                  src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                  alt="googleLogo"
                />
              </button>

              <div className="my-5 flex w-full items-center gap-4">
                <div className="h-px w-full bg-muted-foreground"></div>
                <p className="w-full text-sm text-nowrap text-secondary-foreground/50">
                  or sign in with email
                </p>
                <div className="h-px w-full bg-muted-foreground"></div>
              </div>
            </>
          )}
          {type === "signin" && (
            <>
              <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-border bg-transparent pl-5">
                <CircleUser className="text-muted-foreground" />
                <input
                  type="text"
                  name="username"
                  placeholder="username"
                  className="placeholder-muted-fotext-muted-foreground h-full w-full bg-transparent text-sm text-foreground outline-none"
                  required
                />
              </div>

              <div className="mt-6 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-border bg-transparent px-5">
                <Lock className="text-muted-foreground" />
                 <input
                  type={showPassword === true ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="placeholder-muted-fotext-muted-foreground h-full w-full bg-transparent text-sm text-foreground outline-none"
                  required
                />
                {
                  showPassword === true ? (
                    <>
                       <Eye onClick={() => setShowPassword(!showPassword)} className="cursor-pointer text-muted-foreground "/>
                    </>
                  ) : (
                    <>
                      <EyeOff onClick={() => setShowPassword(!showPassword)} className=" cursor-pointer text-muted-foreground "/>
                    </>
                  )
                }
              </div>
            </>
          )}{" "}
          {type === "signup" && (
            <>
              <div className="flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-border bg-transparent pl-5">
                <CircleUser className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  className="placeholder-muted-fotext-muted-foreground h-full w-full bg-transparent text-sm text-foreground outline-none"
                  required
                />
              </div>

              <div className="mt-6 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-border bg-transparent pl-5">
                <User className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Firstname"
                  name="firstname"
                  className="placeholder-muted-fotext-muted-foreground h-full w-full bg-transparent text-sm text-foreground outline-none"
                  required
                />
              </div>

              <div className="mt-6 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-border bg-transparent pl-5">
                <UsersRound className="text-muted-foreground" />
                <input
                  type="text"
                  name="lastname"
                  placeholder="Lastname"
                  className="placeholder-muted-fotext-muted-foreground h-full w-full bg-transparent text-sm text-foreground outline-none"
                  required
                />
              </div>

              <div className="mt-6 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-border bg-transparent px-5">
                <Lock className="text-muted-foreground" />
            
                <input
                  type={showPassword === true ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="placeholder-muted-fotext-muted-foreground h-full w-full bg-transparent text-sm text-foreground outline-none"
                  required
                />
                {
                  showPassword === true ? (
                    <>
                       <Eye onClick={() => setShowPassword(!showPassword)} className="cursor-pointer text-muted-foreground "/>
                    </>
                  ) : (
                    <>
                      <EyeOff onClick={() => setShowPassword(!showPassword)} className=" cursor-pointer text-muted-foreground "/>
                    </>
                  )
                }
              </div>
            </>
          )}
          {type === "signin" && (
            <>
              <div className="mt-8 flex w-full items-center justify-between text-muted-foreground">
                <div></div>
                <a className="text-sm underline" href="#">
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="mt-8 h-11 w-full rounded-full cursor-pointer bg-accent-foreground text-secondary transition-opacity hover:opacity-90"
              >
                Sign in
              </button>
            </>
          )}
          {type === "signup" && (
            <>
              <button
                type="submit"
                className="mt-8 h-11 w-full rounded-full cursor-pointer bg-accent-foreground text-secondary transition-opacity hover:opacity-90"
              >
                Sign up
              </button>
            </>
          )}
          {type === "signin" && (
            <>
              <p className="mt-4 text-sm text-gray-500/90">
                Don’t have an account?{" "}
                <a
                  className="text-indigo-400 hover:underline cursor-pointer"
                  onClick={onNavigate}
                >
                  Sign up
                </a>
              </p>
            </>
          )}
          {type === "signup" && (
            <>
              <p className="mt-4 text-sm text-gray-500/90">
                Have an account?{" "}
                <a
                  className="text-indigo-400 hover:underline cursor-pointer"
                  onClick={onNavigate}
                >
                  Sign in
                </a>
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
