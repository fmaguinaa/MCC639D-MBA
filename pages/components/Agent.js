import React, {Component} from 'react';
import styled from 'styled-components';
import Client from "./Client";

class Agent extends Component{

    render(){
        const {data} = this.props;
        const {name, status, clients, free} = (data || {})
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