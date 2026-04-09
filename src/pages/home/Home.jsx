import React from 'react';

// Mude de "function App()" para "function Login()"
function Home ({ onHome }) { 
  return (
    <div className="cadastro-wrapper">
      {/* O resto do seu código de cadastro aqui... */}
      <button 
        type="button" 
        className="btn-cadastro" 
        onClick={onHome} // Aqui é onde a "mágica" acontece para trocar de tela
      >
        Cadastrar
      </button>
    </div>
  );
}

export default Home;