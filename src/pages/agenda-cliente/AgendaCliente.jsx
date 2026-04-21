import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgendaCliente.css';

function AgendaCliente() {
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  
  const [agendamento, setAgendamento] = useState({ servico: '', data: '', hora: '' });
  const [meusAgendamentos, setMeusAgendamentos] = useState([]);
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    const servicosSalvos = JSON.parse(localStorage.getItem('servicos') || '[]');
    setServicos(servicosSalvos);

    const todosAgendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const filtrados = todosAgendamentos.filter(ag => ag.clienteEmail === usuarioLogado?.email);
    setMeusAgendamentos(filtrados);
  }, [usuarioLogado?.email]);

  const handleAgendar = (e) => {
    e.preventDefault();
    const todosAgendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');

    // --- REGRA DE NEGÓCIO: BLOQUEIO DE DIAS SEGUIDOS ---
    const novaData = new Date(agendamento.data);
    
    const temConflito = todosAgendamentos.some(ag => {
      if (ag.clienteEmail === usuarioLogado.email && ag.servico === agendamento.servico) {
        const dataExistente = new Date(ag.data);
        const diferencaTempo = Math.abs(novaData - dataExistente);
        const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));
        
        return diferencaDias < 2; // Bloqueia se for no mesmo dia ou no dia seguinte
      }
      return false;
    });

    if (temConflito) {
      alert(`Erro: Você já tem um agendamento de "${agendamento.servico}" para uma data muito próxima. Escolha um intervalo maior.`);
      return;
    }

    const novo = {
      id: Date.now(),
      clienteNome: usuarioLogado?.nome,
      clienteEmail: usuarioLogado?.email,
      ...agendamento
    };

    const listaAtualizada = [...todosAgendamentos, novo];
    localStorage.setItem('agendamentos', JSON.stringify(listaAtualizada));
    setMeusAgendamentos(listaAtualizada.filter(ag => ag.clienteEmail === usuarioLogado?.email));
    
    alert("Agendamento realizado com sucesso!");
    setAgendamento({ servico: '', data: '', hora: '' });
  };

  return (
    <div className="agenda-wrapper">
      <nav className="agenda-nav">
        <span>Bem-vinda, <strong>{usuarioLogado?.nome}</strong></span>
        <button onClick={() => { localStorage.removeItem('usuarioLogado'); navigate('/'); }} className="btn-logout">Sair</button>
      </nav>

      <div className="agenda-main">
        <div className="agenda-container">
          <h2>Agende seu Horário</h2>
          <form onSubmit={handleAgendar}>
            <div className="input-group-agenda">
              <label>Serviço:</label>
              <select value={agendamento.servico} onChange={(e) => setAgendamento({...agendamento, servico: e.target.value})} required>
                <option value="">Escolha um serviço...</option>
                {servicos.map(s => <option key={s.id} value={s.nome}>{s.nome} - R$ {s.preco}</option>)}
              </select>
            </div>
            <div className="input-group-agenda">
              <label>Data:</label>
              <input type="date" value={agendamento.data} onChange={(e) => setAgendamento({...agendamento, data: e.target.value})} required />
            </div>
            <div className="input-group-agenda">
              <label>Hora:</label>
              <input type="time" value={agendamento.hora} onChange={(e) => setAgendamento({...agendamento, hora: e.target.value})} required />
            </div>
            <button type="submit" className="btn-agendar">Confirmar Agendamento</button>
          </form>
        </div>

        <div className="meus-horarios">
          <h3>Meus Horários Marcados</h3>
          <div className="lista-cards">
            {meusAgendamentos.length === 0 ? (
              <p>Nenhum horário marcado.</p>
            ) : (
              meusAgendamentos.map(ag => (
                <div key={ag.id} className="card-agendamento">
                  <strong>{ag.servico}</strong>
                  <p>📅 {ag.data} ⏰ {ag.hora}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgendaCliente;