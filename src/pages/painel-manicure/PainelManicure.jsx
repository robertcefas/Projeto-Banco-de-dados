import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PainelManicure.css';

function PainelManicure() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [editandoServico, setEditandoServico] = useState(null);
  
  // Estado para o Modal de informações do cliente
  const [clienteInfo, setClienteInfo] = useState(null);

  useEffect(() => {
    // Carrega Agendamentos
    const dadosAg = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    setAgendamentos(dadosAg);

    // Carrega Serviços
    const servicosSalvos = JSON.parse(localStorage.getItem('servicos') || '[]');
    setServicos(servicosSalvos);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/');
  };

  // Função para buscar dados do cadastro do cliente
  const verDetalhesCliente = (email) => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const dadosCompletos = usuarios.find(u => u.email === email);
    
    if (dadosCompletos) {
      setClienteInfo(dadosCompletos);
    } else {
      alert("Dados de cadastro não encontrados para este e-mail.");
    }
  };

  const removerAgendamento = (id) => {
    const novos = agendamentos.filter(a => a.id !== id);
    localStorage.setItem('agendamentos', JSON.stringify(novos));
    setAgendamentos(novos);
    alert("Atendimento concluído!");
  };

  const salvarServico = (e) => {
    e.preventDefault();
    let novosServicos;
    if (editandoServico.id) {
      novosServicos = servicos.map(s => s.id === editandoServico.id ? editandoServico : s);
    } else {
      const novo = { ...editandoServico, id: Date.now() };
      novosServicos = [...servicos, novo];
    }
    setServicos(novosServicos);
    localStorage.setItem('servicos', JSON.stringify(novosServicos));
    setEditandoServico(null);
  };

  const excluirServico = (id) => {
    const novos = servicos.filter(s => s.id !== id);
    setServicos(novos);
    localStorage.setItem('servicos', JSON.stringify(novos));
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
        {/* COLUNA ESQUERDA: AGENDAMENTOS */}
        <section className="secao-admin">
          <h2>Próximos Agendamentos</h2>
          <div className="tabela-container">
            {agendamentos.length === 0 ? (
              <p className="sem-dados">Nenhum agendamento pendente.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Cliente (Ver Info)</th>
                    <th>Serviço</th>
                    <th>Data/Hora</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {agendamentos.map(ag => (
                    <tr key={ag.id}>
                      <td>
                        <button className="btn-link-cliente" onClick={() => verDetalhesCliente(ag.clienteEmail)}>
                          {ag.clienteNome}
                        </button>
                      </td>
                      <td>{ag.servico}</td>
                      <td>{ag.data} às {ag.hora}</td>
                      <td>
                        <button className="btn-remover" onClick={() => removerAgendamento(ag.id)}>Concluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* COLUNA DIREITA: SERVIÇOS E PREÇOS */}
        <section className="secao-admin">
          <h2>Serviços e Preços</h2>
          <button className="btn-novo" onClick={() => setEditandoServico({ nome: '', preco: '' })}>
            + Novo Serviço
          </button>
          
          {editandoServico && (
            <form className="form-servico" onSubmit={salvarServico}>
              <input 
                type="text" placeholder="Nome do Serviço" required
                value={editandoServico.nome}
                onChange={e => setEditandoServico({...editandoServico, nome: e.target.value})}
              />
              <input 
                type="number" placeholder="Preço" required
                value={editandoServico.preco}
                onChange={e => setEditandoServico({...editandoServico, preco: e.target.value})}
              />
              <div className="form-btns">
                <button type="submit" className="btn-save">Salvar</button>
                <button type="button" className="btn-cancel" onClick={() => setEditandoServico(null)}>Cancelar</button>
              </div>
            </form>
          )}

          <ul className="lista-servicos">
            {servicos.map(s => (
              <li key={s.id}>
                <span>{s.nome} - R$ {s.preco}</span>
                <div className="acoes-servico">
                  <button className="btn-edit" onClick={() => setEditandoServico(s)}>Editar</button>
                  <button className="btn-del" onClick={() => excluirServico(s.id)}>Excluir</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* MODAL DE INFORMAÇÕES DO CLIENTE */}
      {clienteInfo && (
        <div className="modal-overlay" onClick={() => setClienteInfo(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Detalhes do Cliente</h3>
            <hr />
            <div className="info-item">
              <label>Nome Completo:</label>
              <p>{clienteInfo.nome}</p>
            </div>
            <div className="info-item">
              <label>E-mail de Contato:</label>
              <p>{clienteInfo.email}</p>
            </div>
            {clienteInfo.telefone && (
              <div className="info-item">
                <label>Telefone/WhatsApp:</label>
                <p>{clienteInfo.telefone}</p>
              </div>
            )}
            <button className="btn-fechar-modal" onClick={() => setClienteInfo(null)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PainelManicure;