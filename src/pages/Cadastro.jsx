import React from "react";
import "./Cadastro.css";

function Cadastro({ onCadastro, onNavigateToLogin }) {
  return (
    <div className="cadastro-wrapper">
      <div className="form-container">
        <form onSubmit={(e) => e.preventDefault()}>
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

          <div className="gender-inputs">
            <div className="gender-title">
              <h6>Gênero:</h6>
            </div>
            <div className="gender-group">
              <div className="gender-input">
                <input type="radio" id="female" name="gender" />
                <label htmlFor="female">Feminino</label>
              </div>
              <div className="gender-input">
                <input type="radio" id="male" name="gender" />
                <label htmlFor="male">Masculino</label>
              </div>
              <div className="gender-input">
                <input type="radio" id="other" name="gender" />
                <label htmlFor="other">Outros</label>
              </div>
              <div className="gender-input">
                <input type="radio" id="none" name="gender" />
                <label htmlFor="none">Prefiro não informar</label>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-cadastro"
            onClick={onCadastro}
          >
            Cadastrar
          </button>

          {/* NOVO: Link para voltar ao login */}
          <div className="login-link">
            <p>Já possui uma conta? <a href="#" onClick={(e) => {
              e.preventDefault();
              onNavigateToLogin();
            }}>Faça Login</a></p>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Cadastro;