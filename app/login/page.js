"use client";
import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form"
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";

const Loader = dynamic(() => import("@/components/Loader"), {
  loading: () => <p>Loading...</p>,
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setshowPass] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  useEffect(() => {
    document.title = "Login - Arfat Ecommerce"
    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (metaDescriptionTag) {
      metaDescriptionTag.setAttribute('content', "Login to Arfat Ecommerce to explore and mark your interests in categories like Shoes, Men’s T-shirts, and more. Customize your shopping experience effortlessly.");
    } else {
      const newMetaTag = document.createElement('meta');
      newMetaTag.setAttribute('name', 'description');
      newMetaTag.setAttribute('content', "Login to Arfat Ecommerce to explore and mark your interests in categories like Shoes, Men’s T-shirts, and more. Customize your shopping experience effortlessly.");
      document.head.appendChild(newMetaTag);
    }
  }, []);

  const onSubmit = useCallback(async (formData) => {
    setIsLoading(true)
    try {
      const resUserExists = await fetch(`/api/userExist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const { exists } = await resUserExists.json();

      if (exists) {
        const email = formData.email;
        const password = formData.password;
        await signInWithEmailAndPassword(auth, email, password);
        const user = await auth.currentUser;
        console.log(user)
        if (user) {
          router.push("/")
          setIsLoading(false)
        }
      } else {
        alert("User not exists.");
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false)
  }, [router]);

  return (
    <div className="w-11/12 sm:w-10/12 md:w-3/4 lg:w-3/5 xl:w-2/4 2xl:w-2/5 max-w-[550px] mx-auto my-5 lg:my-7 rounded-xl lg:rounded-2xl border-2 p-5 md:p-7 lg:p-10 xl:p-12 flex flex-col justify-between items-center">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">Login</h2>
      <p className="text-lg md:text-xl lg:text-2xl font-bold text-center mb-1 md:mb-2">Welcome back to ECOMMERCE</p>
      <p className="text-center text-sm marker:text-base mb-4 md:mb-5 lg:mb-6">The next gen business marketplace</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
        <div className="flex flex-col mb-5 gap-0.5">
        <label className="ml-0.5" htmlFor="email">Email</label>
        <input
          type="email"
          className="text-[#848484] p-3 lg:p-4 outline-0 border-2 rounded-md"
          placeholder="Enter"
          {...register("email", {
            required: { value: true, message: "Email is required" },
          })}
        />
        {errors.email && (
          <span className="text-red-400">{errors.email.message}</span>
        )}
        </div>
        <div className="flex flex-col mb-5 gap-0.5">
        <label className="ml-0.5" htmlFor="password">Password</label>
        <div className="relative border-2 rounded-md">
        <input
          placeholder="Enter"
          className="text-[#848484] p-3 lg:p-4 outline-0 rounded-md"
          {...register("password", {
            required: { value: true, message: "Password is required" },
            minLength: { value: 7, message: "Min length of password is 7" },
          })}
          type={showPass ? "text" : "password"}
        />
            <span
              className={`absolute right-2 bottom-2 md:right-3 md:bottom-3 cursor-pointer text-base lg:text-lg font-medium ${showPass ? "underline" : ""}`}
              onClick={()=>setshowPass(!showPass)}
            >
              Show
            </span>
          </div>
        {errors.password && (
          <div className="text-red-400">{errors.password.message}</div>
        )}
        </div>
        <button
          type="submit"
          className="bg-black text-white text-center rounded-md py-2 md:py-3 lg:py-4 textbase md:text-lg"
        >
          {isLoading ? <Loader /> : <span>LOGIN</span>}
        </button>
      </form>
      <hr className="border w-full my-6 md:my-8 lg:my-10" />
      <div className="text-[#848484] -mt-2 mb-4">
        Don&apos;t have an Account? <span className="text-black font-semibold"><Link href="/signup">SIGN UP</Link></span>
      </div>
    </div>
  );
};

export default Login;