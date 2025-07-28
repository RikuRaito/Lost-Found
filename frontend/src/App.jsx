import { useEffect,useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Top from './pages/Top'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  const [currentPage, setCurrentPage] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      navigateTo(path)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isLoggedIn])

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <main>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="*" element={<Top /> } />
        </Routes>
      </main>
    </>
  )
}


export default App
