import { useState } from 'react'
import Login from './pages/Login'
import Home from './pages/Home'
import './App.css'

function App() {
  const [logado, setLogado] = useState(false)

  return (
    <>
      {logado ? (
        <Home />
      ) : (
        <Login onLogin={() => setLogado(true)} />
      )}
    </>
  )
}

export default App