import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PainelManicure.css';

function PainelManicure() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    setAgendamentos(dados);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/');
  };

  return (
    <div className="painel-wrapper">
      <nav className="painel-nav">
        <span>Painel Administrativo - <strong>Nails for You</strong></span>
        <button onClick={handleLogout} className="btn-logout">Sair</button>
      </nav>
      <div className="painel-container">
        <h2>Próximos Agendamentos</h2>
        {agendamentos.length === 0 ? (
          <p>Nenhum agendamento encontrado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Serviço</th>
                <th>Data</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              {agendamentos.map((ag, index) => (
                <tr key={index}>
                  <td>{ag.clienteNome}</td>
                  <td>{ag.servico}</td>
                  <td>{ag.data}</td>
                  <td>{ag.hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PainelManicure;