import React from "react";
import "./Cadastro.css";

function Cadastro({ onCadastro, onNavigateToLogin }) {
  
  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você poderia adicionar uma lógica de validação antes de prosseguir
    onCadastro(); 
  };

  return (
    <div className="cadastro-wrapper">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="Form-header">
            <h1>Criar Conta</h1>
          </div>

          <div className="input-group">
            {/* Primeiro Nome */}
            <div className="input-box">
              <label htmlFor="firstname">Primeiro Nome</label>
              <input 
                type="text" 
                id="firstname" 
                placeholder="Ex: Maria" 
                required 
              />
            </div>

            {/* Último Nome */}
            <div className="input-box">
              <label htmlFor="lastname">Último Nome</label>
              <input 
                type="text" 
                id="lastname" 
                placeholder="Ex: Silva" 
                required 
              />
            </div>

            {/* Email */}
            <div className="input-box">
              <label htmlFor="email">E-mail</label>
              <input 
                type="email" 
                id="email" 
                placeholder="seuemail@exemplo.com" 
                required 
              />
            </div>

            {/* Celular */}
            <div className="input-box">
              <label htmlFor="phone">Celular</label>
              <input 
                type="tel" 
                id="phone" 
                placeholder="(00) 00000-0000" 
                required 
              />
            </div>

            {/* Senha */}
            <div className="input-box">
              <label htmlFor="password">Senha</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Crie uma senha" 
                required 
              />
            </div>

            {/* Confirmar Senha */}
            <div className="input-box">
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input 
                type="password" 
                id="confirmPassword" 
                placeholder="Repita a senha" 
                required 
              />
            </div>
          </div>

          {/* Botão de Finalizar */}
          <button
            type="submit"
            className="btn-cadastro"
          >
            Cadastrar
          </button>

          {/* Link para voltar ao Login */}
          <div className="register-link">
            <p>
              Já tem uma conta?{" "}
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToLogin();
                }}
              >
                Faça Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Cadastro;