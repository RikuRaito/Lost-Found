import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Header = ({isLoggedIn}) => {
    const { i18n } = useTranslation();
    const [langDropdown, setlangDropdown] = useState(false)
    const current = i18n.language || 'ja'
    const { t } = useTranslation();
    const navigate = useNavigate();
    const wrapperRef = useRef(null);

    useEffect(() => {
      function handleClickOutside(event) {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
          setlangDropdown(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Header.jsx 内
    const switchLanguage = (lng) => {
        i18n.changeLanguage(lng).then(() => {
            console.log('language changed to', i18n.language);
        }).catch((e) => {
            console.error('changeLanguage failed', e);
        });
        localStorage.setItem('lng', lng);
        setlangDropdown(false);
    };

    return (
        <header className="relative m-4 z-20 flex items-center justify-between bg-transparent shadow px-1 pr-6 py-2">
            <a href="/" className="flex items-center h-10 bg-center bg-cover bg-white p-1 rounded-xl"> 
                <img
                    src="/logo_LostFound.svg"
                    alt="Logo"
                    className="h-[100px] w-auto"
                />
            </a>
            <div className="flex items-center gap-4">
                <button
                  className="
                    flex items-center px-6 py-2 w-fit rounded-md bg-red-500 text-white font-semibold
                  hover:bg-red-600 active:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed
                    shadow-md transition-colors duration-150
                  "
                  onClick={() => navigate('/contact')}
                >
                  {t('buttons.contact')}
                </button>
                <a href="/New_items" className="
                flex items-center px-6 py-2 w-fit rounded-md bg-blue-500 text-white font-semibold
                hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed
                shadow-md transition-colors duration-150
                "
                >
                    {t('buttons.register')}
                </a>
                <a href="/Notification" className="flex items-center bg-white p-1 rounded-3xl">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-9">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                    </svg>
                </a>
                <a href="/Login" className="flex items-center bg-white p-1 rounded-3xl">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-9"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </a>
                <div ref={wrapperRef} className="relative">
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() => setlangDropdown((v) => !v)}
                  >
                    {current === 'ja' ? '日本語' : 'English'}
                  </button>
                  {langDropdown && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-30">
                      <button
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => switchLanguage('ja')}
                      >
                        日本語
                      </button>
                      <button
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => switchLanguage('en')}
                      >
                        English
                      </button>
                    </div>
                  )}
                </div>
            
            </div>
        </header>
    )
}

export default Header