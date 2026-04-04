import { useState } from 'react'
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
  )
}

export default App