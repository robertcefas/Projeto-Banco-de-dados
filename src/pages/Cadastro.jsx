import React from "react";

function Cadastro({ onCadastro }) {
  return (
    <div className="cadastro-wrapper">
      {/* 1. Corrigido de 'from' para 'form' */}
      <form onSubmit={(e) => e.preventDefault()}> 
        <h1>Cadastro</h1>
        
        <div className="input-group">
          {/* 2. Adicionado 'className' e fechamento '/>' */}
          <input className="input-field" placeholder="Usuário" type="email" />
          <i className="bx bxs-user"></i>
        </div>

        <div className="input-box">
          <input className="input-field" placeholder="Senha" type="password" />
          <i className="bx bxs-lock-alt"></i>
        </div>

        <button
          type="button"
          className="btn-cadastro"
          onClick={onCadastro}
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default Cadastro;