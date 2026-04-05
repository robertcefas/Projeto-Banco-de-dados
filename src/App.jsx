import React, { useState } from "react";
import Login from "./pages/login/Login";
import Cadastro from "./pages/cadastro/Cadastro";
import "./App.css"; 

function App() {
  // Estado que controla qual tela está ativa: "login" ou "cadastro"
  const [telaAtiva, setTelaAtiva] = useState("login");

  // Funções para mudar de tela
  const irParaCadastro = () => {
    setTelaAtiva("cadastro");
  };

  const irParaLogin = () => {
    setTelaAtiva("login");
  };

  // Funções de ação (o que acontece ao clicar nos botões principais)
  const lidarComLogin = () => {
    alert("Login realizado com sucesso! Bem-vinda ao Nails for You.");
    // Aqui você redirecionaria para a Home futuramente
  };

  const lidarComCadastro = () => {
    alert("Cadastro concluído! Agora você pode fazer o login.");
    setTelaAtiva("login"); // Volta para o login após cadastrar
  };

  return (
    <div className="App">
      {/* Lógica de Renderização Condicional */}
      {telaAtiva === "login" ? (
        <Login 
          onLogin={lidarComLogin} 
          onNavigateToRegister={irParaCadastro} 
        />
      ) : (
        <Cadastro 
          onCadastro={lidarComCadastro} 
          onNavigateToLogin={irParaLogin} 
        />
      )}
    </div>
  );
}

export default App;