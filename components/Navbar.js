"use client"
import React, { useEffect, useState } from "react";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [user, setUser] = useState(null)
  const router = useRouter();

  const handleGetUser = async ()=>{
    try {
      auth.onAuthStateChanged(async (user) => {
        setUser(user);
        // console.log(user);
    })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleGetUser()
  }, [])

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("Signout success")
      router.push("/login");
    } catch (error) {
      console.error(error)
    }
  }
  
  return (
    <div className="w-screen">
      <nav className="p-3">
        <ul className="flex justify-end text-xs text-[#333333] gap-4">
          <li className="cursor-pointer">Help</li>
          <li className="cursor-pointer">Orders & Returns</li>
          {user === null ? <li className="cursor-pointer"><Link href="/login">Login</Link></li> : <><li className="cursor-pointer">Hi, {user.displayName.split(' ')[0]}</li><li onClick={handleLogout} className="cursor-pointer">LogOut</li></>}
        </ul>
      </nav>
      <header>
        <div
          className="mx-auto flex flex-wrap p-3 flex-col md:flex-row items-center gap-y-3"
        >
          <Link href="/"><h1 className='text-2xl font-bold cursor-pointer'>ECOMMERCE</h1></Link>
          <ul className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base font-semibold gap-x-5 gap-y-2 justify-center">
            <li>Categories</li>
            <li>Sale</li>
            <li>Clearance</li>
            <li>New Stock</li>
            <li>Trending</li>
          </ul>
          <ul className='flex gap-4 font-semibold text-2xl cursor-pointer'>
            <li><CiSearch/></li>
            <li><PiShoppingCartSimpleLight/></li>
        </ul>
        </div>
      </header>
      <div className="w-full text-center flex gap-2 justify-center items-center bg-[#F4F4F4] py-2 font-medium text-sm md:text-base">
        <span><IoIosArrowBack/></span>
        <p>Get 10% off on business sign up</p>
        <span><IoIosArrowForward/></span>
      </div>
    </div>
  );
};

export default Navbar;