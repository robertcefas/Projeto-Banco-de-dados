export default function StatCard({label,value,icon,color}){
    return(
    <div className="start-card" style={{borderLeft: `5px solid ${color}`}}>
        <div className="start-icon">{icon}</div>
        <div className="start-info">
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    </div>
) 
} 