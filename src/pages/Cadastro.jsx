import React from "react";

// Mude de "function App()" para "function Login()"
function Cadastro({ onCadastro }) {
  return (
    <div class="cadastro-wrapper">
      <from>   
      <h1>Cadastro</h1>
      <div class="input-group">
         <input placeholder="Usuário" type="email">
         </div>
      <div class="input-box">
         <input placeholder="senha" type="password">
         </div>

      </from>
      <button
        type="button"
        className="btn-cadastro"
        onClick={onCadastro} // Aqui é onde a "mágica" acontece para trocar de tela
      >
        Cadastrar
      </button>
    </div>
  );
}

export default Cadastro;
