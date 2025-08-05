import { Route, Routes, Navigate } from "react-router-dom"
import HomePage from "./Pages/HomePage"
import SignupPage from "./Pages/SignupPage"
import LoginPage from "./Pages/LoginPage"
import SettingPage from "./Pages/SettingPage"
import ProfilePage from "./Pages/ProfilePage"
import Navbar from "./Components/Navbar"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import {Loader} from 'lucide-react'
import {Toaster} from 'react-hot-toast'

function App() {
  const {authUser , checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();

  console.log(onlineUsers);
  
  useEffect(() => {

    checkAuth()
  
  }, [checkAuth])
  
  // console.log({authUser});

  if(isCheckingAuth && !authUser){
    return (
      <div className="flex items-center h-screen justify-center">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }
  
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element= {authUser ? <HomePage/> : <Navigate to ="/login"/>}/>
        <Route path="/signup" element= { !authUser ? <SignupPage/>:<Navigate to ="/"/> }/>
        <Route path="/login" element= {!authUser ? <LoginPage/> : <Navigate to ="/"/>}/>
        <Route path="/setting" element= {<SettingPage/>}/>
        <Route path="/profile" element= {authUser ? <ProfilePage/> :<Navigate to ="/login"/>}/>
      </Routes> 
      <Toaster/>
    </div>
  )
}

export default App
