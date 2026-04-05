import React from "react";
import "./Login.css";

function Login({ onLogin, onNavigateToRegister }) {
  // Impede o recarregamento da página ao clicar no botão ou dar Enter
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login</h1>

        {/* Campo de Usuário com ícone */}
        <div className="input-box">
          <input
            type="email"
            className="input-field"
            placeholder="E-mail ou Usuário"
            required
          />
          <i className="bx bxs-user"></i>
        </div>

        {/* Campo de Senha com ícone */}
        <div className="input-box">
          <input
            type="password"
            className="input-field"
            placeholder="Senha"
            required
          />
          <i className="bx bxs-lock-alt"></i>
        </div>

        <button type="submit" className="btn-login">
          Entrar
        </button>

        {/* Link dinâmico para trocar para a tela de Cadastro */}
        <div className="register-link">
          <p>
            Não tem uma conta?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigateToRegister();
              }}
            >
              Cadastre-se
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
