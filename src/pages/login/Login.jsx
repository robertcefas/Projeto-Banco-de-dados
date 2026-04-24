import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const realizarLogin = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const encontrou = usuarios.find(u => u.email === email && u.senha === senha);

    if (encontrou) {
      localStorage.setItem('usuarioLogado', JSON.stringify(encontrou));
      if (encontrou.tipo === 'manicure') {
        navigate('/painel-manicure');
      } else {
        navigate('/agenda-cliente');
      }
    } else {
      alert("E-mail ou senha incorretos!");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1>Nails for You</h1>
        
        <form onSubmit={realizarLogin}>
          <div className="login-input-group">
            <label>E-mail</label>
            <input 
              type="email" 
              placeholder="Digite seu e-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>

          <div className="login-input-group">
            <label>Senha</label>
            <input 
              type="password" 
              placeholder="Digite sua senha" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)} 
              required
            />
          </div>

          <button type="submit" className="btn-login">
            Entrar
          </button>

          <div className="signup-link">
            <p>Não tem conta? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/cadastro'); }}>Cadastre-se aqui</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;