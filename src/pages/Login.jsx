import React from 'react';

// Mude de "function App()" para "function Login()"
function Login({ onLogin }) { 
  return (
    <div className="login-wrapper">
      {/* O resto do seu código de login aqui... */}
      <button 
        type="button" 
        className="btn-login" 
        onClick={onLogin} // Aqui é onde a "mágica" acontece para trocar de tela
      >
        Entrar
      </button>
    </div>
  );
}

export default Login;