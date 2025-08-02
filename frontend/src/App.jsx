import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Top from './pages/Top'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NewItems from './pages/NewItems'
import Notification from './pages/Notification'
import AdminLogin from './pages/AdminLogin'
import AnimatedLinesCircle from './components/Animation'


function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { i18n } = useTranslation()

  // App.jsx 内の effect にも確認
useEffect(() => {
  const savedLang = localStorage.getItem('lng');
  
  if (savedLang && savedLang !== i18n.language) {
    i18n.changeLanguage(savedLang)
  }
}, [i18n]);
  
  return (
    <>
      {location.pathname !== '/AdminLogin' && (
        <Header isLoggedIn={isLoggedIn} />
      )}
      
      {location.pathname === '/' && (
        <div className='relative'>
          <AnimatedLinesCircle />
        </div>
      )}
      <main>
        <Routes>
          <Route path='/AdminLogin' element={<AdminLogin />} />
          <Route path='/Notification' element={<Notification />} />
          <Route path='/New_items' element={<NewItems />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="*" element={<Top /> } />
        </Routes>
      </main>
    </>
  )
}


export default App
