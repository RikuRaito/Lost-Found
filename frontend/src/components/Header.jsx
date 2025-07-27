import React from "react";

const Header = ({isLoggedIn}) => {
    return (
        <header className="flex items-center justify-between bg-white shadow px-1 pr-6 py-0">
            <a href="/" className="flex items-center"> 
                <img
                    src="/logo_LostFound.svg"
                    alt="Logo"
                    className="h-[100px] w-auto"
                />
            </a>
            <a href="/Login" className="flex items-center ">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-9"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>

            </a>

        </header>
    )
}

export default Header