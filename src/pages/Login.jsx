import React from "react";
import "./Login.css";

function Login({ onLogin, onNavigateToRegister }) {
  return (
    <div className="login-wrapper">
      <form onSubmit={(e) => e.preventDefault()}> 
        <h1>Login</h1>
        
        <div className="input-group">
          <input className="input-field" placeholder="Usuário" type="email" />
          <i className="bx bxs-user"></i>
        </div>

        <div className="input-box">
          <input className="input-field" placeholder="Senha" type="password" />
          <i className="bx bxs-lock-alt"></i>
        </div>

        <button
          type="button"
          className="btn-cadastro"
          onClick={onLogin}
        >
          Entrar
        </button>

        {/* Novo link para cadastro */}
        <div className="register-link">
          <p>Não tem uma conta? <a href="#" onClick={onNavigateToRegister}>Cadastre-se</a></p>
        </div>
      </form>
    </div>
  );
}

export default Login;