import React, { useState, useEffect, useCallback } from 'react';
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

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  // Função central para garantir que o agendamento SEMPRE apareça
  const atualizarListaAgendamentos = useCallback(() => {
    if (!usuarioLogado) return;
    const todos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    // Filtra apenas os agendamentos do cliente logado
    const filtrados = todos.filter(a => a.clienteEmail === usuarioLogado.email);
    setMeusAgendamentos(filtrados);
  }, [usuarioLogado]);

  useEffect(() => {
    if (!usuarioLogado) {
      navigate('/');
      return;
    }
    setServicos(JSON.parse(localStorage.getItem('servicos') || '[]'));
    setConfigAgenda(JSON.parse(localStorage.getItem('configAgenda')));
    atualizarListaAgendamentos();
  }, [navigate, atualizarListaAgendamentos]);

  useEffect(() => {
    const ultimoDia = new Date(anoAtivo, mesAtivo + 1, 0).getDate();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dias = [];
    for (let i = 1; i <= ultimoDia; i++) {
      const dataISO = `${anoAtivo}-${String(mesAtivo + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const bloqueado = configAgenda?.datasBloqueadas?.includes(dataISO);
      const passado = new Date(dataISO + "T00:00:00") < hoje;
      dias.push({ dataISO, numero: i, disponivel: !bloqueado && !passado });
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
      alert("Por favor, selecione o serviço, o dia e o horário.");
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
    atualizarListaAgendamentos(); // Atualiza a lista imediatamente após agendar
  };

  const cancelarHorario = (id, dataAg, horaAg) => {
    const agora = new Date();
    const dataHoraAtendimento = new Date(`${dataAg}T${horaAg}`);
    const diffHoras = (dataHoraAtendimento - agora) / (1000 * 60 * 60);

    if (diffHoras < 2) {
      alert("Cancelamento indisponível: Faltam menos de 2h para o atendimento.");
      return;
    }

    if (window.confirm("Deseja cancelar este agendamento?")) {
      const todos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const filtrados = todos.filter(a => a.id !== id);
      localStorage.setItem('agendamentos', JSON.stringify(filtrados));
      atualizarListaAgendamentos();
    }
  };

  if (agendadoComSucesso) {
    return (
      <div className="sucesso-wrapper">
        <div className="card-sucesso">
          <h2>✅ Agendamento Confirmado!</h2>
          <p>O seu horário foi guardado. Pode consultá-lo na sua lista de agendamentos.</p>
          <button onClick={() => setAgendadoComSucesso(false)} className="btn-novo">Ver Meus Horários</button>
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
              <button type="button" onClick={() => setMesAtivo(dataRef.getMonth())}>&lt;</button>
              <span className="mes-nome">{new Date(anoAtivo, mesAtivo).toLocaleString('pt-BR', { month: 'long' })}</span>
              <button type="button" onClick={() => setMesAtivo(dataRef.getMonth() + 1)}>&gt;</button>
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
                  {mostrarHoras ? "Ocultar Horários ▲" : "Escolher Horário ▼"}
                </button>
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

            <div className="alerta-obs">
               <strong>Nota:</strong> O horário pode variar ligeiramente conforme o procedimento anterior.
            </div>

            <button type="submit" className="btn-confirmar-final">Confirmar Agora</button>
          </form>

          {/* SEÇÃO SEMPRE VISÍVEL PARA O CLIENTE NÃO ESQUECER */}
          <div className="meus-agendamentos-fixo">
            <h3>🗓️ Meus Horários Marcados</h3>
            {meusAgendamentos.length === 0 ? (
              <p className="txt-vazio">Ainda não tem agendamentos para mostrar.</p>
            ) : (
              meusAgendamentos.map(m => (
                <div key={m.id} className="card-meu-horario">
                  <div className="info">
                    <span className="servico-nome">{m.servico}</span>
                    <span className="data-hora">{m.data.split('-').reverse().join('/')} às {m.hora}</span>
                  </div>
                  <button onClick={() => cancelarHorario(m.id, m.data, m.hora)} className="btn-cancelar">
                    Cancelar
                  </button>
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