import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgendaCliente.css';

function AgendaCliente() {
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  // Estado para o formulário de agendamento
  const [agendamento, setAgendamento] = useState({
    servico: '',
    data: '',
    hora: ''
  });

  const servicos = [
    { id: 1, nome: 'Manicure (Mão)', preco: 'R$ 30,00' },
    { id: 2, nome: 'Pedicure (Pé)', preco: 'R$ 35,00' },
    { id: 3, nome: 'Combo Pé e Mão', preco: 'R$ 60,00' },
    { id: 4, nome: 'Alongamento em Gel', preco: 'R$ 120,00' }
  ];

  const handleAgendar = (e) => {
    e.preventDefault();

    const agendamentosExistentes = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    
    const novoAgendamento = {
      id: Date.now(),
      clienteNome: usuarioLogado?.nome || 'Cliente',
      clienteEmail: usuarioLogado?.email,
      ...agendamento
    };

    agendamentosExistentes.push(novoAgendamento);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentosExistentes));

    alert(`Agendamento de ${agendamento.servico} realizado com sucesso!`);
    setAgendamento({ servico: '', data: '', hora: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/');
  };

  return (
    <div className="agenda-wrapper">
      <nav className="agenda-nav">
        <span>Bem-vinda, <strong>{usuarioLogado?.nome}</strong></span>
        <button onClick={handleLogout} className="btn-logout">Sair</button>
      </nav>

      <div className="agenda-container">
        <h2>Agende seu Horário</h2>
        <form onSubmit={handleAgendar}>
          <div className="input-group-agenda">
            <label>Selecione o Serviço:</label>
            <select 
              value={agendamento.servico} 
              onChange={(e) => setAgendamento({...agendamento, servico: e.target.value})}
              required
            >
              <option value="">Escolha um serviço...</option>
              {servicos.map(s => (
                <option key={s.id} value={s.nome}>{s.nome} - {s.preco}</option>
              ))}
            </select>
          </div>

          <div className="input-group-agenda">
            <label>Data:</label>
            <input 
              type="date" 
              value={agendamento.data}
              onChange={(e) => setAgendamento({...agendamento, data: e.target.value})}
              required 
            />
          </div>

          <div className="input-group-agenda">
            <label>Horário:</label>
            <input 
              type="time" 
              value={agendamento.hora}
              onChange={(e) => setAgendamento({...agendamento, hora: e.target.value})}
              required 
            />
          </div>

          <button type="submit" className="btn-agendar">Confirmar Agendamento</button>
        </form>
      </div>
    </div>
  );
}

export default AgendaCliente;