import React from 'react'

export default function Logs(props){
    return(
        <div>
            {(props.logs || []).map((log,id)=><p>Cliente {id}: {log.join(' / ')}</p>)}
        </div>
    )
}