import React, {Component} from 'react';
import styled from 'styled-components';
import {Button} from 'antd'

import Client from './Client'

class Clients extends Component{

    state = {
        cola : [],
        libre : true,
        
    }

    render(){
        const {clients, addClients} = this.props
        return(
            <div>
                <Button
                    onClick={addClients}
                >
                    Agregar cliente
                </Button>
                {
                    clients.map(client => <Client key={client.id} client={client}/>)
                }
            </div>

        )
    }
    
}

export default Clients;