import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import "./Cadastro.css";

function Cadastro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: ''
  });

  const handleChange = (e) => {
    const { id, value, type } = e.target;

    if (type === "radio") {
      setFormData({
        ...formData,
        gender: id
      });
    } else {
      setFormData({
        ...formData,
        [id]: value
      });
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const credencial = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      console.log("Usuário criado:", credencial.user);

      alert("Cadastro realizado com sucesso!");
      navigate("/");

    } catch (erro) {
      console.error("Erro ao cadastrar:", erro);

      switch (erro.code) {
        case "auth/email-already-in-use":
          alert("Este e-mail já está cadastrado!");
          break;

        case "auth/invalid-email":
          alert("E-mail inválido!");
          break;

        case "auth/weak-password":
          alert("A senha deve ter pelo menos 6 caracteres.");
          break;

        default:
          alert("Erro ao realizar cadastro.");
      }
    }
  };

  return (
    <div className="cadastro-wrapper">
      <div className="form-container">
        <form onSubmit={handleCadastro}>
          <div className="Form-header">
            <h1>Cadastro</h1>
          </div>

          <div className="input-group">

            <div className="input-box">
              <label htmlFor="firstname">Primeiro Nome:</label>
              <input
                type="text"
                id="firstname"
                placeholder="Digite seu primeiro nome"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-box">
              <label htmlFor="lastname">Último Nome:</label>
              <input
                type="text"
                id="lastname"
                placeholder="Digite seu último nome"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-box">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                placeholder="Digite seu email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-box">
              <label htmlFor="phone">Celular:</label>
              <input
                type="tel"
                id="phone"
                placeholder="XX XXXXX-XXXX"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-box">
              <label htmlFor="password">Senha:</label>
              <input
                type="password"
                id="password"
                placeholder="*******"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-box">
              <label htmlFor="confirmPassword">Confirmar Senha:</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="*******"
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="gender-inputs">
            <div className="gender-title">
              <h6>Gênero:</h6>
            </div>

            <div className="gender-group">

              <div className="gender-input">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  onChange={handleChange}
                />
                <label htmlFor="female">Feminino</label>
              </div>

              <div className="gender-input">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  onChange={handleChange}
                />
                <label htmlFor="male">Masculino</label>
              </div>

              <div className="gender-input">
                <input
                  type="radio"
                  id="other"
                  name="gender"
                  onChange={handleChange}
                />
                <label htmlFor="other">Outros</label>
              </div>

            </div>
          </div>

          <button type="submit" className="btn-cadastro">
            Cadastrar
          </button>

          <div className="login-link">
            <p>
              Já possui uma conta?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
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