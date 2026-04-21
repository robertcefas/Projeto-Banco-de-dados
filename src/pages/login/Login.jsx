import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const realizarLogin = (e) => {
    e.preventDefault();
    
    // Busca os usuários cadastrados no LocalStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    
    // Procura o usuário com o email e senha digitados
    const usuarioEncontrado = usuarios.find(
      (u) => u.email === email && u.password === senha
    );

    if (usuarioEncontrado) {
      // Salva quem está logado para o Dashboard e a Agenda usarem
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
      
      alert(`Bem-vinda, ${usuarioEncontrado.firstname}!`);
      
      // Lógica de Redirecionamento:
      // Se for o email da manicure, vai para o painel, se não, vai para agenda
      if (email === "admin@nails.com") {
        navigate("/painel-manicure");
      } else {
        navigate("/agenda-cliente");
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
          {/* Campo de E-mail */}
          <div className="input-box">
            <input 
              type="email" 
              className="input-field"
              placeholder="E-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
            <i className="bx bxs-user"></i>
          </div>

          {/* Campo de Senha */}
          <div className="input-box">
            <input 
              type="password" 
              className="input-field"
              placeholder="Senha" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)} 
              required
            />
            <i className="bx bxs-lock-alt"></i>
          </div>

          <button type="submit" className="btn-login">
            Entrar
          </button>

          <div className="signup-link">
            <p>
              Não tem conta?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/cadastro'); }}>
                Cadastre-se aqui
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;