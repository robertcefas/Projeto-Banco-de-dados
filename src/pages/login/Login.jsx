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

      // 2. Busca o usuário no BD pelo firebaseUid para verificar o perfil
      let usuarioBD = null;
      try {
        const resp = await fetch(`/api/cadastro?firebaseUid=${encodeURIComponent(usuario.uid)}`);
        if (resp.ok) {
          const dados = await resp.json();
          usuarioBD = dados.usuario || null;
        }
      } catch (err) {
        console.warn('Erro ao buscar usuário no BD:', err);
      }

      // 3. Determina perfil (fallback para admin pelo e-mail) e salva no cofre
      const perfil = (usuarioBD && usuarioBD.perfil)
        ? usuarioBD.perfil
        : (usuario.email === 'admin@estudio.com' ? 'admin' : 'cliente');

      localStorage.setItem('usuarioLogado', JSON.stringify({
        nome: usuario.displayName || (usuarioBD && usuarioBD.nome) || 'Cliente',
        email: usuario.email,
        perfil,
      }));

      // 4. Redireciona conforme o perfil (inclui fallback por e-mail)
      if (perfil === 'admin') {
        console.log('Login Admin feito com sucesso!');
        navigate('/painel-manicure');
      } else {
        console.log('Login Cliente feito com sucesso!');
        navigate('/agenda-cliente');
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

  const fetchUsuarioPorUid = async (firebaseUid) => {
    const resposta = await fetch(`/api/cadastro?firebaseUid=${encodeURIComponent(firebaseUid)}`);
    if (!resposta.ok) return null;
    const dados = await resposta.json();
    return dados.usuario || null;
  };

  const solicitarTelefone = () => {
    while (true) {
      const valor = window.prompt(
        'Por favor, informe seu número de telefone somente com números (DDD + número). Ex: 11999998888'
      );
      if (valor === null) {
        return null;
      }

      const telefone = valor.replace(/\D/g, '');
      if (telefone.length === 10 || telefone.length === 11) {
        return telefone;
      }

      alert('Número inválido. Informe 10 ou 11 dígitos numéricos.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const resultado = await signInWithPopup(auth, provider);
      const usuario = resultado.user;

      const usuarioExistente = await fetchUsuarioPorUid(usuario.uid);
      let telefone = usuario.phoneNumber ? usuario.phoneNumber.replace(/\D/g, '') : '';

      if (usuarioExistente?.telefone) {
        telefone = usuarioExistente.telefone;
      }

      if (!telefone) {
        telefone = solicitarTelefone();
        if (!telefone) {
          alert('O número de telefone é obrigatório para continuar.');
          return;
        }
      }

      const resposta = await fetch('/api/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid: usuario.uid,
          nome: usuario.displayName || 'Cliente',
          email: usuario.email,
          telefone,
        }),
      });

      if (!resposta.ok) {
        const dados = await resposta.json();
        throw new Error(dados.erro || 'Erro ao salvar o usuário no banco de dados.');
      }

      localStorage.setItem('usuarioLogado', JSON.stringify({
        nome: usuario.displayName || 'Cliente',
        email: usuario.email,
        perfil: usuarioExistente?.perfil || 'cliente',
      }));

      console.log('Login feito com sucesso! Bem-vinda:', usuario.displayName);
      navigate('/agenda-cliente');
    } catch (erro) {
      console.error('Erro ao fazer login com o Google:', erro);
      alert(erro.message || 'Houve um erro ao tentar fazer o login pelo Google.');
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