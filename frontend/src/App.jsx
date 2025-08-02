import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Top from './pages/Top'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NewItems from './pages/NewItems'
import Notification from './pages/Notification'
import AdminLogin from './pages/AdminLogin'
import AnimatedLinesCircle from './components/Animation'
import SearchResult from './pages/SearchResult'
import ItemDetails from './pages/ItemDetails'

function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
          <Route path='/Search_results' element={<SearchResult/>} />
          <Route path='/item/:itemId' element={<ItemDetails />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="*" element={<Top /> } />
        </Routes>
      </main>
    </>
  )
}


export default App
