import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PainelManicure.css';

function PainelManicure() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [editandoServico, setEditandoServico] = useState(null);
  const [clienteInfo, setClienteInfo] = useState(null);
  const [mostrarHoras, setMostrarHoras] = useState(false);

  const [configAgenda, setConfigAgenda] = useState({
    datasBloqueadas: [], 
    horaInicio: "09:00",
    horaFim: "18:00"
  });

  // Novos estados para navegação entre Meses
  const dataHoje = new Date();
  const [mesAtivo, setMesAtivo] = useState(dataHoje.getMonth());
  const [anoAtivo, setAnoAtivo] = useState(dataHoje.getFullYear());
  const [diasDoMes, setDiasDoMes] = useState([]);

  useEffect(() => {
    const dadosAg = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    setAgendamentos(dadosAg);
    const servicosSalvos = JSON.parse(localStorage.getItem('servicos') || '[]');
    setServicos(servicosSalvos);
    const agendaSalva = JSON.parse(localStorage.getItem('configAgenda'));
    if (agendaSalva) setConfigAgenda(agendaSalva);
  }, []);

  // Recalcula os dias sempre que mudar o mês
  useEffect(() => {
    const ultimoDia = new Date(anoAtivo, mesAtivo + 1, 0).getDate();
    const dias = [];
    for (let i = 1; i <= ultimoDia; i++) {
      const dataFormatada = `${anoAtivo}-${String(mesAtivo + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      dias.push({ data: dataFormatada, numero: i });
    }
    setDiasDoMes(dias);
  }, [mesAtivo, anoAtivo]);

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/');
  };

  const alternarData = (data, numero) => {
    const hojeComp = new Date();
    hojeComp.setHours(0,0,0,0);
    const dataClicada = new Date(data + "T00:00:00");
    
    if (dataClicada < hojeComp) return; // Mantém vermelho se passou

    let novasDatas = [...configAgenda.datasBloqueadas];
    if (novasDatas.includes(data)) {
      novasDatas = novasDatas.filter(d => d !== data);
    } else {
      novasDatas.push(data);
    }
    setConfigAgenda({ ...configAgenda, datasBloqueadas: novasDatas });
  };

  // Lógica para limitar apenas a +1 mês de antecedência
  const navegarMes = (direcao) => {
    const mesAtualReal = new Date().getMonth();
    if (direcao === 'proximo' && mesAtivo === mesAtualReal) {
      setMesAtivo(mesAtivo + 1);
    } else if (direcao === 'anterior' && mesAtivo > mesAtualReal) {
      setMesAtivo(mesAtivo - 1);
    }
  };

  const salvarConfigAgenda = () => {
    localStorage.setItem('configAgenda', JSON.stringify(configAgenda));
    alert("Disponibilidade atualizada!");
  };

  return (
    <div className="painel-wrapper">
      <nav className="painel-nav">
        <div className="nav-content">
          <span>Painel Administrativo - <strong>Nails for You</strong></span>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </nav>

      <div className="painel-grid">
        <section className="secao-admin">
          <h2>Próximos Agendamentos</h2>
          <div className="tabela-container">
            <table>
              <thead>
                <tr>
                  <th>CLIENTE</th>
                  <th>SERVIÇO</th>
                  <th>DATA/HORA</th>
                  <th>AÇÃO</th>
                </tr>
              </thead>
              <tbody>
                {agendamentos.map(ag => (
                  <tr key={ag.id}>
                    <td><button className="btn-link-cliente" onClick={() => setClienteInfo(ag)}>{ag.clienteNome}</button></td>
                    <td>{ag.servico}</td>
                    <td>{ag.data} às {ag.hora}</td>
                    <td><button className="btn-remover">Concluir</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="coluna-direita">
          <section className="secao-admin">
            <div className="seletor-mes">
              <button type="button" className="btn-mes" onClick={() => navegarMes('anterior')}>&lt;</button>
              <h2 className="titulo-agenda">
                Agenda de {new Date(anoAtivo, mesAtivo).toLocaleString('pt-BR', { month: 'long' })}
              </h2>
              <button type="button" className="btn-mes" onClick={() => navegarMes('proximo')}>&gt;</button>
            </div>
            
            <div className="calendario-grid-mes">
              {diasDoMes.map(item => {
                const bloqueado = configAgenda.datasBloqueadas.includes(item.data);
                const hoje = new Date();
                hoje.setHours(0,0,0,0);
                const diaComp = new Date(item.data + "T00:00:00");
                const isPassado = diaComp < hoje;
                
                return (
                  <div 
                    key={item.data} 
                    className={`cal-dia-mes ${isPassado || bloqueado ? 'dia-off' : 'dia-on'}`}
                    onClick={() => alternarData(item.data, item.numero)}
                  >
                    {item.numero}
                  </div>
                );
              })}
            </div>

            <div className="expander-horas">
              <button className="btn-toggle-horas" onClick={() => setMostrarHoras(!mostrarHoras)}>
                {mostrarHoras ? "Ocultar Horários ▲" : "Configurar Horários ▼"}
              </button>
              
              {mostrarHoras && (
                <div className="horarios-container">
                  <div className="input-hora-group">
                    <label>Início</label>
                    <input type="time" value={configAgenda.horaInicio} onChange={e => setConfigAgenda({...configAgenda, horaInicio: e.target.value})} />
                  </div>
                  <div className="input-hora-group">
                    <label>Fim</label>
                    <input type="time" value={configAgenda.horaFim} onChange={e => setConfigAgenda({...configAgenda, horaFim: e.target.value})} />
                  </div>
                </div>
              )}
            </div>

            <button className="btn-save-disponibilidade" onClick={salvarConfigAgenda}>Salvar Disponibilidade</button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PainelManicure;