import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase"; 
import './Login.css'; // Importando o seu CSS maravilhoso!

function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const resultado = await signInWithPopup(auth, provider);
      const usuario = resultado.user;
      
      console.log("Login feito com sucesso! Bem-vinda:", usuario.displayName);
      navigate('/agenda-cliente');
      
    } catch (erro) {
      console.error("Erro ao fazer login com o Google:", erro);
      alert("Houve um erro ao tentar fazer o login pelo Google.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        
        <h1>Login</h1>
        
        <div className="login-input-group">
          <label>E-mail</label>
          <input type="email" placeholder="Digite seu e-mail" />
        </div>

        <div className="login-input-group">
          <label>Senha</label>
          <input type="password" placeholder="Digite sua senha" />
        </div>
        
        <button className="btn-login">Entrar</button>

        {/* NOVO: Botão do Google com a nova classe CSS */}
        <button type="button" className="btn-google" onClick={handleGoogleLogin}>
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Logo do Google" 
          />
          Entrar com o Google
        </button>

        <div className="signup-link">
          Não tem conta? <a href="/cadastro">Cadastre-se aqui</a>
        </div>
        
      </div>
    </div>
  );
}

export default Login;