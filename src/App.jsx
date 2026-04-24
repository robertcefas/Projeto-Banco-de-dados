import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PainelManicure from './pages/painel-manicure/PainelManicure';
// 1. Importações dos componentes REAIS que você criou
import Login from './pages/login/Login';
import Cadastro from './pages/cadastro/Cadastro';
import AgendaCliente from './pages/agenda-cliente/AgendaCliente';


function App() {
  return (
    <Router>
      <Routes>
        {/* Rota inicial: Login */}
        <Route path="/" element={<Login />} />
        
        {/* Rota de Cadastro */}
        <Route path="/cadastro" element={<Cadastro />} />
        
        {/* Rota da Agenda (Cliente logado) */}
        <Route path="/agenda-cliente" element={<AgendaCliente />} />
        
        {/* Rota do Painel (Manicure/Admin logado) */}
        <Route path="/painel-manicure" element={<PainelManicure />} />
      </Routes>
    </Router>
  );
}

export default App;