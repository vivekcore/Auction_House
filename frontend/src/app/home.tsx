import { useNavigate } from "react-router"

const Home = () => {
  const navagation = useNavigate();
  return (
    <div className="flex flex-col gap-20 h-screen w-full justify-center items-center">
      <h1 className="text-8xl">Home</h1>
      <div className="  transition-transform duration-300 active:scale-90 ">
        <button className="text-2xl  ring-ring border p-2 rounded-2xl ring-2 active:ring-sidebar-primary cursor-pointer "
        onClick={() => navagation("/signin")} >
            SignIn
        </button>
      </div>
    </div>
  )
}

export default Home