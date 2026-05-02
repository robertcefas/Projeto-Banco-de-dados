import React, { useState } from 'react'; // <-- IMPORTANTE: useState adicionado aqui
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase"; 
import './Login.css'; 

function Login() {
  const navigate = useNavigate();
  
  // Guardam o que o usuário digita nos campos
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Função para o botão "Entrar" normal (Admin)
  const handleLoginNormal = () => {
    // Verifica se o e-mail digitado é o da administração
    if (email === 'admin@estudio.com') {
      // Salva os dados no cofre para não ser expulso da página
      localStorage.setItem('usuarioLogado', JSON.stringify({
        nome: 'Administrador',
        email: email
      }));
      
      console.log("Login Admin feito com sucesso!");
      navigate('/painel-manicure'); // Manda para o painel da manicure
      
    } else {
      // Se tentar entrar com e-mail comum pelo botão Entrar
      alert("Acesso restrito. Se você é cliente, use o botão 'Entrar com o Google'.");
    }
  };

  // Função para o botão do Google (Cliente)
  const handleGoogleLogin = async () => {
    try {
      const resultado = await signInWithPopup(auth, provider);
      const usuario = resultado.user;
      localStorage.setItem('usuarioLogado', JSON.stringify({
        nome: usuario.displayName,
        email: usuario.email
      }));
      
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
          <input 
            type="email" 
            placeholder="Digite seu e-mail" 
            value={email} // <-- Liga a variável ao campo
            onChange={(e) => setEmail(e.target.value)} // <-- Salva o que foi digitado
          />
        </div>

        <div className="login-input-group">
          <label>Senha</label>
          <input 
            type="password" 
            placeholder="Digite sua senha" 
            value={senha} // <-- Liga a variável ao campo
            onChange={(e) => setSenha(e.target.value)} // <-- Salva o que foi digitado
          />
        </div>
        
        {/* Adicionado o onClick para chamar a função do Admin */}
        <button className="btn-login" onClick={handleLoginNormal}>Entrar</button>

        {/* Botão do Google para os Clientes */}
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