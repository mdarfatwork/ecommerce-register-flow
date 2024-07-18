"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { auth } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const Loader = dynamic(() => import("@/components/Loader"), {
  loading: () => <p>Loading...</p>,
});

const Page = () => {
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [data, setData] = useState();
  const [OTP, setOTP] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [OTPError, setOTPError] = useState(null);
  const [enteredOTP, setEnteredOTP] = useState(["", "", "", "", "", ""]);
  const otpInputs = useRef([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    document.title = "SignUp - Arfat Ecommerce";
    const metaDescriptionTag = document.querySelector(
      'meta[name="description"]'
    );
    if (metaDescriptionTag) {
      metaDescriptionTag.setAttribute(
        "content",
        "SignUp to Arfat Ecommerce to explore and mark your interests in categories like Shoes, Men’s T-shirts, and more. Customize your shopping experience effortlessly."
      );
    } else {
      const newMetaTag = document.createElement("meta");
      newMetaTag.setAttribute("name", "description");
      newMetaTag.setAttribute(
        "content",
        "SignUp to Arfat Ecommerce to explore and mark your interests in categories like Shoes, Men’s T-shirts, and more. Customize your shopping experience effortlessly."
      );
      document.head.appendChild(newMetaTag);
    }
    const fetchUserEmail = async () => {
      try {
        const user = await auth.currentUser;
        if (user) {
          router.push("/")
        }
      } catch (error) {
        console.error("Error fetching user email:", error);
      }
    };
    fetchUserEmail();
  }, [router]);

  const onSubmit = useCallback(async (formData) => {
    setIsLoading(true);
    try {
      setData(formData);
      const resUserExists = await fetch(`/api/userExist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const { exists } = await resUserExists.json();

      if (exists) {
        alert("User already exists.");
        setIsLoading(false);
        return;
      }

      const res = await fetch(`/api/sendEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, name: formData.name }),
      });

      if (res.ok) {
        const result = await res.json();
        setOTP(result.code);
        setShowVerifyForm(true);
      } else {
        console.log("Failed to send mail");
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, []);

  const handleVerifyOTP = useCallback(async () => {
    setIsLoading(true);
    const enteredOTPString = enteredOTP.join("");
    if (enteredOTPString === OTP) {
      setOTPError("");
      try {
        const email = data.email;
        const password = data.password;
        const name = data.name;
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: name,
        });

        const res = await fetch(`/api/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data, id: user.uid }),
        });

        if (res.ok) {
          const result = await res.json();
          // console.log(result)
          router.push("/");
        } else {
          const result = await res.json();
          console.error("Failed to save user:", result.error);
        }
      } catch (error) {
        console.error("Error in verify OTP:", error);
      }
    } else {
      setOTPError("Incorrect OTP. Please try again.");
    }
    setIsLoading(false);
  }, [enteredOTP, OTP, router, data]);

  const handleInputChange = useCallback(
    (index, value, event) => {
      const newEnteredOTP = [...enteredOTP];
      newEnteredOTP[index] = value;
      setEnteredOTP(newEnteredOTP);

      if ((event.keyCode === 8 || event.keyCode === 46) && value === "") {
        if (otpInputs.current[index - 1]) {
          otpInputs.current[index - 1].focus();
        }
      } else if (value !== "" && otpInputs.current[index + 1]) {
        otpInputs.current[index + 1].focus();
      }
    },
    [enteredOTP]
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const clipboardData = e.clipboardData || window.clipboardData;
      const pastedData = clipboardData.getData("Text").slice(0, 8);
      const otpArray = pastedData.split("");
      const newEnteredOTP = [...enteredOTP];
      otpArray.forEach((char, index) => {
        if (index < 8) {
          newEnteredOTP[index] = char;
        }
      });
      setEnteredOTP(newEnteredOTP);
    },
    [enteredOTP]
  );

  const anonymizedEmail = (email) => {
    const parts = email.split("@");
    const part1 = parts[0].length <= 3 ? parts[0] : parts[0].slice(0, 3) + "*".repeat(parts[0].length - 3);
    return `${part1}@${parts[1]}`;
  };

  return (
    <>
      {!showVerifyForm ? (
        <div className="w-11/12 sm:w-10/12 md:w-3/4 lg:w-3/5 xl:w-2/4 2xl:w-2/5 max-w-[550px] mx-auto my-5 lg:my-7 rounded-xl lg:rounded-2xl border-2 p-5 md:p-7 lg:p-10 xl:p-12 flex flex-col gap-4 md:gap-7 justify-between items-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
            Create your account
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full gap-5 lg:gap-7"
          >
            <div className="flex flex-col w-full gap-0.5">
              <label htmlFor="name" className="ml-0.5">Name</label>
              <input
                className="text-[#848484] p-3 lg:p-4 outline-0 border-2 rounded-md "
                placeholder="Enter"
                {...register("name", {
                  required: { value: true, message: "Name is required" },
                })}
              />
              {errors.name && (
                <span className="text-red-400">{errors.name.message}</span>
              )}
            </div>
            <div className="flex flex-col w-full gap-0.5">
            <label htmlFor="email" className="ml-0.5">Email</label>
            <input
              type="email"
              className="text-[#848484] p-3 lg:p-4 outline-0 border-2 rounded-md "
              placeholder="Enter"
              {...register("email", {
                required: { value: true, message: "Email is required" },
              })}
            />
            {errors.email && (
              <span className="text-red-400">{errors.email.message}</span>
            )}
            </div>
            <div className="flex flex-col w-full gap-0.5">
            <label htmlFor="password" className="ml-0.5">Password</label>
            <input
              placeholder="Enter"
              className="text-[#848484] p-3 lg:p-4 outline-0 border-2 rounded-md "
              {...register("password", {
                required: { value: true, message: "Password is required" },
                minLength: { value: 7, message: "Min length of password is 7" },
              })}
              type="password"
            />
            {errors.password && (
              <div className="text-red-400">{errors.password.message}</div>
            )}
            </div>

            <button
              type="submit"
              className="bg-black text-white text-center rounded-md py-3 lg:py-4 md:text-lg"
            >
              {isLoading ? <Loader /> : <span>CREATE ACCOUNT</span>}
            </button>
          </form>
          <div className="text-[#848484] mb-10">
            Have an Account?{" "}
            <span className="text-black font-semibold">
              <Link href="/login">LOGIN</Link>
            </span>
          </div>
          </div>
      ) : (
        <div className="w-11/12 sm:w-10/12 md:w-3/4 lg:w-3/5 xl:w-2/4 2xl:w-2/5 max-w-[600px] mx-auto my-5 lg:my-7 rounded-xl lg:rounded-2xl border-2 p-5 md:p-7 lg:p-10 xl:p-12 flex flex-col justify-between items-center">
          <h2 className="text-3xl font-bold mb-4 md:mb-6 lg:mb-8">Verify your email</h2>
          <p>Enter the 8 digit code you have received on</p>
          <p className="font-semibold mb-6 md:mb-8 lg:mb-10">{anonymizedEmail(data.email)}</p>
          <div className="flex flex-col w-full mb-8 md:mb-10 lg:mb-12">
          <span className="text-left w-full">code</span>
          <div className="grid grid-cols-8 text-center mt-1 gap-2 lg:gap-3">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
              <input
                key={index}
                ref={(ref) => (otpInputs.current[index] = ref)}
                className="border-2 outline-none py-2 sm:py-3 md:py-4 text-center form-control rounded"
                type="text"
                maxLength="1"
                value={enteredOTP[index]}
                onChange={(e) => handleInputChange(index, e.target.value, e)}
                onKeyDown={(e) => handleInputChange(index, e.target.value, e)}
                onPaste={handlePaste}
              />
            ))}
          </div>
          {OTPError && <p className="text-red-500 text-center">{OTPError}</p>}
          </div>

          <span
            onClick={handleVerifyOTP}
            className="bg-black text-white w-full rounded-md py-2 md:py-3 flex items-center justify-center lg:text-lg cursor-pointer"
          >
            {isLoading ? <Loader /> : <span>VERIFY</span>}
          </span>
          </div>
      )}
    </>
  );
};

export default Page;
