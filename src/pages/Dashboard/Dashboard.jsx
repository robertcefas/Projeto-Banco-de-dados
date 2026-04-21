import { useState, useEffect } from 'react';
import StatCard from './components/StatCard';
import AppointmentRow from './components/AppointmentRow';
import './Dashboard.css';

export default function Dashboard() {
  const [agendamentos, setAgendamentos] = useState([]);

  // LER do LocalStorage ao abrir
  useEffect(() => {
    const salvos = localStorage.getItem('@NailsDash:agendamentos');
    if (salvos) setAgendamentos(JSON.parse(salvos));
  }, []);

  // SALVAR no LocalStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem('@NailsDash:agendamentos', JSON.stringify(agendamentos));
  }, [agendamentos]);

  // Funções de Gerenciamento
  const deletarAgendamento = (id) => {
    setAgendamentos(agendamentos.filter(a => a.id !== id));
  };

  const alternarStatus = (id) => {
    setAgendamentos(agendamentos.map(a => 
      a.id === id ? { ...a, concluido: !a.concluido } : a
    ));
  };

  // Cálculos para os Cards
  const totalHoje = agendamentos.length;
  const concluidos = agendamentos.filter(a => a.concluido).length;

  return (
    <div className="dashboard-page">
      <header className="dash-header">
        <h1>Painel de Controle </h1>
        <p>{new Date().toLocaleDateString()}</p>
      </header>

      <section className="stats-container">
        <StatCard label="Total do Dia" value={totalHoje} color="#ff85a2" />
        <StatCard label="Concluídos" value={concluidos} color="#4caf50" />
        <StatCard label="Restantes" value={totalHoje - concluidos} color="#ff9800" />
      </section>

      <section className="table-container">
        <h2>Próximos Atendimentos</h2>
        <table>
          <thead>
            <tr>
              <th>Hora</th>
              <th>Cliente</th>
              <th>Serviço</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map(item => (
              <AppointmentRow 
                key={item.id} 
                item={item} 
                onDelete={deletarAgendamento}
                onComplete={alternarStatus}
              />
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}