import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgendaCliente.css';

function AgendaCliente() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState([]);
  const [agendamento, setAgendamento] = useState({ servico: '', data: '', hora: '' });
  const [meusAgendamentos, setMeusAgendamentos] = useState([]);
  const [configAgenda, setConfigAgenda] = useState(null);
  const [mostrarHoras, setMostrarHoras] = useState(false);
  const [agendadoComSucesso, setAgendadoComSucesso] = useState(false);

  const dataRef = new Date();
  const [mesAtivo, setMesAtivo] = useState(dataRef.getMonth());
  const [anoAtivo, setAnoAtivo] = useState(dataRef.getFullYear());
  const [diasVisiveis, setDiasVisiveis] = useState([]);

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');

  // Função para carregar dados do LocalStorage
  const carregarDados = () => {
    if (!usuarioLogado) return;

    const agendamentosDB = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const filtrados = agendamentosDB.filter(a => a.clienteEmail === usuarioLogado.email);
    setMeusAgendamentos(filtrados);

    const servicosDB = JSON.parse(localStorage.getItem('servicos') || '[]');
    setServicos(Array.isArray(servicosDB) ? servicosDB : []);

    const config = JSON.parse(localStorage.getItem('configAgenda') || '{}');
    setConfigAgenda(config);
  };

  useEffect(() => {
    if (!usuarioLogado) {
      navigate('/');
    } else {
      carregarDados();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const ultimoDia = new Date(anoAtivo, mesAtivo + 1, 0).getDate();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dias = [];
    for (let i = 1; i <= ultimoDia; i++) {
      const dataISO = `${anoAtivo}-${String(mesAtivo + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const bloqueado = configAgenda?.datasBloqueadas?.includes(dataISO);
      const dataComparacao = new Date(`${dataISO}T00:00:00`);
      dias.push({ dataISO, numero: i, disponivel: !bloqueado && dataComparacao >= hoje });
    }
    setDiasVisiveis(dias);
  }, [mesAtivo, anoAtivo, configAgenda]);

  const gerarHorasDinamicas = () => {
    const inicio = configAgenda?.horaInicio ? parseInt(configAgenda.horaInicio.split(':')[0]) : 9;
    const fim = configAgenda?.horaFim ? parseInt(configAgenda.horaFim.split(':')[0]) : 18;
    const horas = [];
    for (let h = inicio; h < fim; h++) {
      horas.push(`${String(h).padStart(2, '0')}:00`);
    }
    return horas;
  };

  const finalizarAgendamento = (e) => {
    e.preventDefault();
    if (!agendamento.servico || !agendamento.data || !agendamento.hora) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const novo = { 
      id: Date.now(), 
      clienteNome: usuarioLogado.nome, 
      clienteEmail: usuarioLogado.email, 
      ...agendamento 
    };
    
    const banco = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    localStorage.setItem('agendamentos', JSON.stringify([...banco, novo]));
    
    setAgendadoComSucesso(true);
    carregarDados();
  };

  const cancelarHorario = (id, dataAg, horaAg) => {
    const agora = new Date();
    const dataHoraAtendimento = new Date(`${dataAg}T${horaAg}:00`);
    const diffHoras = (dataHoraAtendimento - agora) / (1000 * 60 * 60);

    if (diffHoras < 2) {
      alert("Cancelamento indisponível (mínimo 2h de antecedência).");
      return;
    }

    if (window.confirm("Deseja cancelar?")) {
      const todos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const filtrados = todos.filter(a => a.id !== id);
      localStorage.setItem('agendamentos', JSON.stringify(filtrados));
      carregarDados();
    }
  };

  if (agendadoComSucesso) {
    return (
      <div className="sucesso-wrapper">
        <div className="card-sucesso">
          <h2>✅ Agendado!</h2>
          <button onClick={() => { setAgendadoComSucesso(false); setAgendamento({ servico: '', data: '', hora: '' }); }} className="btn-novo">
            Voltar
          </button>
        </div>
      </div>
    );
  }

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
          <h2>Novo Agendamento</h2>
          <form onSubmit={finalizarAgendamento}>
            <select value={agendamento.servico} onChange={e => setAgendamento({...agendamento, servico: e.target.value})} className="select-servico">
              <option value="">Escolha o serviço...</option>
              {servicos.map(s => <option key={s.id} value={s.nome}>{s.nome} - R$ {s.preco}</option>)}
            </select>

            <div className="seletor-mes-cliente">
              <button type="button" onClick={() => setMesAtivo(prev => prev - 1)}>&lt;</button>
              <span className="mes-nome">{new Date(anoAtivo, mesAtivo).toLocaleString('pt-BR', { month: 'long' })}</span>
              <button type="button" onClick={() => setMesAtivo(prev => prev + 1)}>&gt;</button>
            </div>

            <div className="calendario-cliente-grid">
              {diasVisiveis.map(dia => (
                <div key={dia.dataISO} className={`dia-bolinha ${!dia.disponivel ? 'off' : agendamento.data === dia.dataISO ? 'selected' : 'on'}`} onClick={() => dia.disponivel && setAgendamento({...agendamento, data: dia.dataISO})}>
                  {dia.numero}
                </div>
              ))}
            </div>

            {agendamento.data && (
              <div className="expander-horas-cliente">
                <button type="button" className="btn-toggle-horas-cliente" onClick={() => setMostrarHoras(!mostrarHoras)}>Horários Disponíveis</button>
                {mostrarHoras && (
                  <div className="grid-horas-cliente">
                    {gerarHorasDinamicas().map(h => (
                      <div key={h} className={`hora-item ${agendamento.hora === h ? 'active' : ''}`} onClick={() => setAgendamento({...agendamento, hora: h})}>
                        {h}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button type="submit" className="btn-confirmar-final">Confirmar</button>
          </form>

          <div className="meus-agendamentos-fixo">
            <h3>🗓️ Meus Horários</h3>
            {meusAgendamentos.map(m => (
              <div key={m.id} className="card-meu-horario">
                <div className="info">
                  <strong>{m.servico}</strong>
                  <span>{m.data.split('-').reverse().join('/')} às {m.hora}</span>
                </div>
                <button onClick={() => cancelarHorario(m.id, m.data, m.hora)} className="btn-cancelar">Cancelar</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ESTA LINHA É O QUE ESTÁ FALTANDO NO SEU CÓDIGO
export default AgendaCliente;