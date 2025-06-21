import { Outlet } from "react-router-dom"
import Navbar from "./components/header/Navbar"

const App = () => {
  return (
    <>
    <Navbar/>
    <Outlet/>
    </>
  )
}

export default App
