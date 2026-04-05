import { useState } from 'react'
<<<<<<< HEAD
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
=======
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    /* No React, usamos className em vez de class */
    <div className="login-wrapper">
      <div className="login-box">
        <header>
          <h2>Bem-vinda de volta!</h2>
          <p>Acesse sua conta para gerenciar seus agendamentos.</p>
        </header>

        <form id="login-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            {/* No React, usamos htmlFor em vez de for */}
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" placeholder="exemplo@email.com" required />
          </div>

          <div className="input-group">
            <div className="label-row">
              <label htmlFor="password">Senha</label>
              <a href="#" className="forgot-link">Esqueceu a senha?</a>
            </div>
            <input type="password" id="password" placeholder="••••••••" required />
          </div>

          <div className="options-row">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Lembrar de mim
            </label>
          </div>

          <button type="submit" className="btn-login">Entrar</button>

          <div className="footer-login">
            <p>Não tem uma conta? <a href="#">Cadastre-se aqui</a></p>
          </div>
        </form>
      </div>
    </div>
>>>>>>> 6d89b93e1ac5778b1d47cb718d3227c956fe21f2
  )
}

export default App