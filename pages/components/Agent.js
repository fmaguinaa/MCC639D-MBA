import React, {Component} from 'react';
import styled from 'styled-components';
import Client from "./Client";

class Agent extends Component{

    render(){
        const {name, status, clients, free} = this.props.data
        return(
            <div>
                {name} {free? 'libre':'ocupado'}
                {
                    (clients || []).map(client => <Client key={client.id} client={client}/>)
                }
            </div>
        )
    }
    
}

export default Agent;