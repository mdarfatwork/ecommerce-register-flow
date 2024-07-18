"use client";
import React, { useEffect, useState, useMemo } from "react";
import { FaCheck } from "react-icons/fa";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import WithAuth from "@/components/withAuth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";

const Home = () => {
  const categoriesPerPage = 6;
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userEmail, setUserEmail] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const user = await auth.currentUser;
        if(user) {
          setUserEmail(user.email);
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Error fetching user email:", error);
      }
    };

    fetchUserEmail();
  }, [router]);

  useEffect(() => {
    if (userEmail) {
      const getInterest = async () => {
        try {
          const res = await fetch(`/api/userInterest`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: userEmail }),
          });

          if (res.ok) {
            const result = await res.json();
            setCategories(result.userInterest.interests);
          } else {
            console.error("Failed to fetch user interests");
          }
        } catch (error) {
          console.error("Error fetching user interests:", error);
        }
      };

      getInterest();
    }
  }, [userEmail]);

  const totalPages = useMemo(() => Math.ceil(categories.length / categoriesPerPage), [categories.length]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDoubleArrowLeft = () => {
    setCurrentPage((prev) => Math.max(prev - 6, 1));
  };

  const handleDoubleArrowRight = () => {
    setCurrentPage((prev) => Math.min(prev + 6, totalPages));
  };

  const getPageNumbers = useMemo(() => {
    if (totalPages <= 8) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      let startPage = currentPage <= totalPages - 6 ? currentPage : totalPages - 6;
      const pages = Array.from({ length: 7 }, (_, i) => startPage + i);
      if (startPage > 1) pages.unshift("...");
      if (startPage + 6 < totalPages) pages.push("...");
      return pages;
    }
  }, [currentPage, totalPages]);

  const visibleCategories = useMemo(() => {
    return categories.slice(
      (currentPage - 1) * categoriesPerPage,
      currentPage * categoriesPerPage
    );
  }, [categories, currentPage, categoriesPerPage]);

  const handleCategoryClick = async (id) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === id ? { ...category, checked: !category.checked } : category
      )
    );
    if (userEmail) {
      try {
        const res = await fetch(`/api/updateCategory`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail, id }),
        });

        if (!res.ok) {
          console.error("Failed to update category");
        }
      } catch (error) {
        console.error("Error updating category:", error);
      }
    }
  };

  if (categories.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-screen flex justify-center">
      <hr className="w-6 md:w-8 lg:w-10 border-[1.5px] hidden sm:block mt-28 md:mt-32 lg:mt-36 xl:mt-40" />
    <div className="w-11/12 sm:w-10/12 md:w-3/4 lg:w-3/5 xl:w-2/4 2xl:w-2/5 max-w-[500px] my-5 lg:my-7 rounded-xl lg:rounded-2xl border-2 p-5 md:p-7 lg:p-10 flex flex-col gap-3 justify-between items-center text-center">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">Please mark your interests!</h2>
      <span className="my-2">We will keep you notified.</span>
      <ul className="w-full flex flex-col gap-3 lg:gap-4 text-left">
        <p className="text-lg lg:text-xl font-bold pb-2 lg:pb-3">My saved interests!</p>
        {visibleCategories.map((category) => (
          <li key={category.id} className="flex gap-2 md:gap-3 lg:gap-4 items-center text-base md:text-lg">
            <span
              onClick={() => handleCategoryClick(category.id)}
              className={`${
                category.checked ? "bg-black text-white" : "bg-gray-300 text-gray-300"
              } p-1 rounded-md cursor-pointer font-semibold`}
            >
              <FaCheck />
            </span>
            <span>{category.category}</span>
          </li>
        ))}
      </ul>
      <div className="flex w-full items-center text-gray-400 my-5 sm:my-7 md:my-9 lg:my-11">
        <MdOutlineKeyboardDoubleArrowLeft
          className={`text-3xl cursor-pointer ${currentPage === 1 ? "opacity-50" : ""}`}
          onClick={handleDoubleArrowLeft}
        />
        <MdKeyboardArrowLeft
          className={`text-3xl cursor-pointer ${currentPage === 1 ? "opacity-50" : ""}`}
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        />
        {getPageNumbers.map((page, index) => (
          <p
            key={index}
            className={`cursor-pointer text-lg mx-1 ${page === currentPage ? "text-black font-semibold" : "text-gray-400"}`}
            onClick={() => typeof page === "number" && handlePageChange(page)}
          >
            {page}
          </p>
        ))}
        <MdKeyboardArrowRight
          className={`text-3xl cursor-pointer ${currentPage === totalPages ? "opacity-50" : ""}`}
          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
        />
        <MdOutlineKeyboardDoubleArrowRight
          className={`text-3xl cursor-pointer ${currentPage === totalPages ? "opacity-50" : ""}`}
          onClick={handleDoubleArrowRight}
        />
      </div>
    </div>
    </div>
  );
};

export default WithAuth(Home);