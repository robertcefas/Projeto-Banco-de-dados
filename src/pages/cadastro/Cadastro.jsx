import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cadastro.css";

function Cadastro() {
  const navigate = useNavigate();
  
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: ""
  });

  // Função para atualizar o estado quando o usuário digita
  const handleChange = (e) => {
    const { id, name, value } = e.target;
    setFormData({
      ...formData,
      [id || name]: value
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    // Salva no LocalStorage para o seu Dashboard e o do seu amigo lerem
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    usuarios.push(formData);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cadastro realizado com sucesso!");
    navigate("/"); // Volta para o Login
  };

  return (
    <div className="cadastro-wrapper">
      <div className="form-container">
        <form onSubmit={handleRegister}>
          <div className="Form-header">
            <h1>Cadastro</h1>
          </div>

          <div className="input-group">
            <div className="input-box">
              <label htmlFor="firstname">Primeiro Nome:</label>
              <input type="text" id="firstname" placeholder="Digite seu primeiro nome" onChange={handleChange} required />
            </div>

            <div className="input-box">
              <label htmlFor="lastname">Último Nome:</label>
              <input type="text" id="lastname" placeholder="Digite seu último nome" onChange={handleChange} required />
            </div>

            <div className="input-box">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" placeholder="Digite seu email" onChange={handleChange} required />
            </div>

            <div className="input-box">
              <label htmlFor="phone">Celular:</label>
              <input type="tel" id="phone" placeholder="XX XXXX-XXXX" onChange={handleChange} required />
            </div>

            <div className="input-box">
              <label htmlFor="password">Senha:</label>
              <input type="password" id="password" placeholder="*******" onChange={handleChange} required />
            </div>

            <div className="input-box">
              <label htmlFor="confirmPassword">Confirmar Senha:</label>
              <input type="password" id="confirmPassword" placeholder="*******" onChange={handleChange} required />
            </div>
          </div>

          <div className="gender-inputs">
            <div className="gender-title">
              <h6>Gênero:</h6>
            </div>
            <div className="gender-group">
              <div className="gender-input">
                <input type="radio" id="female" name="gender" value="Feminino" onChange={handleChange} />
                <label htmlFor="female">Feminino</label>
              </div>
              <div className="gender-input">
                <input type="radio" id="male" name="gender" value="Masculino" onChange={handleChange} />
                <label htmlFor="male">Masculino</label>
              </div>
              <div className="gender-input">
                <input type="radio" id="other" name="gender" value="Outros" onChange={handleChange} />
                <label htmlFor="other">Outros</label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-cadastro">
            Cadastrar
          </button>

          <div className="login-link">
            <p>Já possui uma conta? <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>Faça Login</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Cadastro;