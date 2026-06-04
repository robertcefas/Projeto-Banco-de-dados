import React, { useState } from 'react'; // <-- IMPORTANTE: useState adicionado aqui
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, provider } from "../../firebase"; 
import './Login.css'; 

function Login() {
  const navigate = useNavigate();
  
  // Guardam o que o usuário digita nos campos
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Função para o botão "Entrar" normal (Admin)
  const handleLoginNormal = async (e) => {
    e.preventDefault(); // Evita recarregar a página se estiver num form
    
    try {
      // 1. Tenta fazer o login no Firebase com o e-mail e senha digitados
      const credencial = await signInWithEmailAndPassword(auth, email, senha);
      const usuario = credencial.user;

      // 2. Salva o usuário no cofre para a Agenda não expulsá-lo
      localStorage.setItem('usuarioLogado', JSON.stringify({
        nome: usuario.displayName || 'Cliente', // Pega o nome ou deixa como Cliente
        email: usuario.email
      }));
      
      // 3. Verifica para qual tela ele deve ir
      if (email === 'admin@estudio.com') {
        console.log("Login Admin feito com sucesso!");
        navigate('/painel-manicure'); 
      } else {
        console.log("Login Cliente feito com sucesso!");
        navigate('/agenda-cliente'); // Ajuste a rota se for '/agendacliente'
      }
      
    } catch (erro) {
      console.error("Erro no login normal:", erro);
      if (erro.code === 'auth/invalid-credential' || erro.code === 'auth/wrong-password') {
        alert("E-mail ou senha incorretos!");
      } else {
        alert("Ocorreu um erro ao tentar entrar. Você já se cadastrou?");
      }
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
          Não tem conta? <Link to="/cadastro">Cadastre-se aqui</Link>
        </div>
        
      </div>
    </div>
  );
}

export default Login;