import React from "react";

function Cadastro({ onCadastro }) {
  return (
    <div className="cadastro-wrapper">
      <div className="form-container">
        <form action="#">
          <div className="Form-header">
            <h1>Cadastro</h1>
          </div>

          <div className="input-group">
            <div className="input-box">
              <label htmlFor="firstname">Primeiro Nome:</label>
              <input type="text" id="firstname" placeholder="Digite seu primeiro nome" required />
            </div>

            <div className="input-box">
              <label htmlFor="lastname">Último Nome:</label>
              <input type="text" id="lastname" placeholder="Digite seu último nome" required />
            </div>

            <div className="input-box">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" placeholder="Digite seu email" required />
            </div>

            <div className="input-box">
              <label htmlFor="phone">Celular:</label>
              <input type="tel" id="phone" placeholder="XX XXXX-XXXX" required />
            </div>

            <div className="input-box">
              <label htmlFor="password">Senha:</label>
              <input type="password" id="password" placeholder="*******" required />
            </div>

            <div className="input-box">
              <label htmlFor="confirmPassword">Confirmar Senha:</label>
              <input type="password" id="confirmPassword" placeholder="*******" required />
            </div>
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
    </div>
  );
}

export default Cadastro;