import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgendaCliente.css';

function AgendaCliente() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState([]);
  const [agendamento, setAgendamento] = useState({ servico: '', data: '', hora: '' });
  const [configAgenda, setConfigAgenda] = useState(null);
  const [mostrarHoras, setMostrarHoras] = useState(false);

  // Controle de Meses (Atual e Próximo)
  const [mesAtivo, setMesAtivo] = useState(new Date().getMonth());
  const [anoAtivo, setAnoAtivo] = useState(new Date().getFullYear());
  const [diasVisiveis, setDiasVisiveis] = useState([]);

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  useEffect(() => {
    const servicosSalvos = JSON.parse(localStorage.getItem('servicos') || '[]');
    setServicos(servicosSalvos);
    const config = JSON.parse(localStorage.getItem('configAgenda'));
    setConfigAgenda(config);
  }, []);

  useEffect(() => {
    gerarDiasMes(mesAtivo, anoAtivo);
  }, [mesAtivo, anoAtivo, configAgenda]);

  const gerarDiasMes = (mes, ano) => {
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dias = [];
    for (let i = 1; i <= ultimoDia; i++) {
      const dataISO = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dataComparacao = new Date(dataISO + "T00:00:00");
      
      const bloqueado = configAgenda?.datasBloqueadas?.includes(dataISO);
      const passado = dataComparacao < hoje;

      dias.push({ dataISO, numero: i, disponivel: !bloqueado && !passado });
    }
    setDiasVisiveis(dias);
  };

  const navegarMes = (direcao) => {
    const dataRef = new Date();
    if (direcao === 'proximo' && mesAtivo === dataRef.getMonth()) {
      setMesAtivo(dataRef.getMonth() + 1);
    } else if (direcao === 'anterior' && mesAtivo > dataRef.getMonth()) {
      setMesAtivo(dataRef.getMonth());
    }
  };

  const gerarHorarios = () => {
    if (!configAgenda) return [];
    const horarios = [];
    let atual = parseInt(configAgenda.horaInicio.split(':')[0]);
    const fim = parseInt(configAgenda.horaFim.split(':')[0]);
    for (let h = atual; h <= fim; h++) {
      horarios.push(`${String(h).padStart(2, '0')}:00`);
      if (h !== fim) horarios.push(`${String(h).padStart(2, '0')}:30`);
    }
    return horarios;
  };

  const finalizarAgendamento = (e) => {
    e.preventDefault();
    if (!agendamento.servico || !agendamento.data || !agendamento.hora) return alert("Preencha tudo!");

    const novo = { id: Date.now(), clienteNome: usuarioLogado.nome, clienteEmail: usuarioLogado.email, ...agendamento };
    const banco = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    localStorage.setItem('agendamentos', JSON.stringify([...banco, novo]));
    alert("Agendado com sucesso!");
    navigate('/perfil'); // Ou onde desejar
  };

  return (
    <div className="cliente-wrapper">
      <nav className="cliente-nav">
        <div className="nav-content">
          <span>Olá, <strong>{usuarioLogado?.nome}</strong></span>
          <button onClick={() => { localStorage.removeItem('usuarioLogado'); navigate('/'); }} className="btn-sair">Sair</button>
        </div>
      </nav>

      <div className="cliente-container">
        <div className="card-agenda-cliente">
          <h2>Agende seu Horário</h2>
          
          <form onSubmit={finalizarAgendamento}>
            <label className="label-top">O que vamos fazer hoje?</label>
            <select value={agendamento.servico} onChange={e => setAgendamento({...agendamento, servico: e.target.value})} className="select-servico">
              <option value="">Selecione um serviço...</option>
              {servicos.map(s => <option key={s.id} value={s.nome}>{s.nome} - R$ {s.preco}</option>)}
            </select>

            <div className="seletor-mes-cliente">
              <button type="button" onClick={() => navegarMes('anterior')}>&lt;</button>
              <span className="mes-nome">{new Date(anoAtivo, mesAtivo).toLocaleString('pt-BR', { month: 'long' })}</span>
              <button type="button" onClick={() => navegarMes('proximo')}>&gt;</button>
            </div>

            <div className="calendario-cliente-grid">
              {diasVisiveis.map(dia => (
                <div 
                  key={dia.dataISO}
                  className={`dia-bolinha ${!dia.disponivel ? 'off' : agendamento.data === dia.dataISO ? 'selected' : 'on'}`}
                  onClick={() => dia.disponivel && setAgendamento({...agendamento, data: dia.dataISO})}
                >
                  {dia.numero}
                </div>
              ))}
            </div>

            {agendamento.data && (
              <div className="expander-horas-cliente">
                <button type="button" className="btn-toggle-horas-cliente" onClick={() => setMostrarHoras(!mostrarHoras)}>
                  {mostrarHoras ? "Ocultar Horários ▲" : "Ver Horários Disponíveis ▼"}
                </button>
                
                {mostrarHoras && (
                  <div className="grid-horas-cliente animado">
                    {gerarHorarios().map(h => (
                      <div 
                        key={h} 
                        className={`hora-item ${agendamento.hora === h ? 'active' : ''}`}
                        onClick={() => setAgendamento({...agendamento, hora: h})}
                      >
                        {h}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button type="submit" className="btn-confirmar-final">Confirmar Agendamento</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AgendaCliente;