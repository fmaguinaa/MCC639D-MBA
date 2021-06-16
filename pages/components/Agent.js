import React, {Component} from 'react';
import styled from 'styled-components';
import Client from "./Client";

class Agent extends Component{

    render(){
        const {name, clients, free} = this.props
        return(
            <div>
                {name || ''} {free? 'libre':'ocupado'}
                {
                    (clients || []).map(client => <Client key={client.id} name={client.name} status={client.status}/>)
                }
            </div>
        )
    }
    
}

export default Agent;