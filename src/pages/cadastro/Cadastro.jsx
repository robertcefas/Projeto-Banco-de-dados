import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // Verifique se o caminho está correto para o seu projeto
import "./Cadastro.css";

function Cadastro() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false); // Novo estado para o botão

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
      return;
    }

    if (id === 'phone') {
      const apenasNumeros = value.replace(/\D/g, '').slice(0, 11);
      setFormData({
        ...formData,
        phone: apenasNumeros
      });
      return;
    }

    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    setCarregando(true); // Trava o botão enquanto carrega

    try {
      // 1. Cria a conta no Firebase (Segurança)
      const credencial = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const usuario = credencial.user;
      console.log("Usuário criado no Firebase:", usuario);

      // 2. Envia os dados para a API do Postgres (Vercel)
      const resposta = await fetch('/api/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid: usuario.uid,
          nome: `${formData.firstname} ${formData.lastname}`, // Junta os dois nomes
          email: formData.email,
          telefone: formData.phone
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        // Se a API deu erro, lança para o catch
        throw new Error(dados.erro || 'Erro ao salvar no banco de dados.');
      }

      console.log("Usuário salvo no banco Postgres:", dados);
      
      alert("Cadastro realizado com sucesso!");
      navigate("/"); // Manda para a tela de login

    } catch (erro) {
      console.error("Erro ao cadastrar:", erro);

      // Verifica se é erro do Firebase ou da nossa API
      if (erro.code) {
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
            alert("Erro ao realizar cadastro no Firebase.");
        }
      } else {
        // Exibe erro do banco de dados, se houver
        alert(erro.message || "Erro ao realizar cadastro.");
      }
    } finally {
      setCarregando(false); // Libera o botão
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
                placeholder="11999998888"
                inputMode="numeric"
                maxLength={11}
                value={formData.phone}
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

          <button type="submit" className="btn-cadastro" disabled={carregando}>
            {carregando ? "Cadastrando..." : "Cadastrar"}
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