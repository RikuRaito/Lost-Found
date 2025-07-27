import { useEffect,useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Top from './pages/Top'

function App() {
  const [currentPage, setCurrentPage] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  
  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <main>
        <Routes>
          <Route path="/Login" element={<div>ログインページ（実装中）</div>} />
          <Route path="*" element={<Top /> } />
        </Routes>
      </main>
    </>
  )
}


export default App
