export default function AppointmentRow({ item, onDelete, OnComplete }) {
    return (
        <tr>
            <td>{item.horario}</td>
            <td>{item.cliente}</td>
            <td>{item.serviço}</td>
            <td>
                <span className={`badge ${item.concluido ? 'done' : 'pending'}`} onClick={() => OnComplete(item.id)}>
                    {item.concluido ? 'Concluído' : 'Pendente'}
                </span>
            </td>
            <td>
                <button onClick={() => onDelete(item.id)} className="delete-btn">Excluir</button>
                
            </td>
        </tr>
    )
}