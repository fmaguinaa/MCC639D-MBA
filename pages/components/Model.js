import React, {Component} from 'react';
import styled from 'styled-components';
import {Button,Row, Col} from 'antd'

import Agent from './Agent.js'
import Clients from './Clients'

const statusClient = {
    inicio: 'I',
    colaTickets: 'CT',
    atendidoTickets: 'AT',
    colaAlimentos: 'CA',
    atendidoAlimentos: 'AA',
    fin: 'F'
}

const statusAgent = {
    libre: true,
    ocupado: false,
}

const idAgents = {
    tickets:'agentTickets',
    alimentos:'agentAlimentos'
}

class Model extends Component{

    state = {
        idInterval: 0,
        clients: [],
        agentTickets: {},
        agentAlimentos: {},

    }

    componentDidMount() {
        const idInterval = window.setInterval(() => {
            this.onValidateAgentsClients();
        }, 1000);

        this.setState({
            idInterval: idInterval,
            agentTickets: {
                id: idAgents.tickets,
                name: 'Agente Tickets',
                free: true,
                clients: []
            },
            agentAlimentos: {
                id: idAgents.alimentos,
                name: 'Agente Alimentos',
                free: true,
                clients: []
            },
        })
    }

    componentWillUnmount() {
        clearInterval(this.state.idInterval)
    }

    onValidateAgentsClients = () => {
        this.scheduleAgent(idAgents.tickets);
        this.scheduleAgent(idAgents.alimentos);
        this.enqueueClients();
    }

    randomWorkTime = () => 1000*(Math.random()*2+1)

    getStatusAttended = (agent) => {
        switch (agent.id){
            case idAgents.tickets:
                return statusClient.atendidoTickets;
            case idAgents.alimentos:
                return statusClient.atendidoAlimentos;
        }
    }

    enqueueClients = () => {
        const {clients, agentTickets, agentAlimentos} = this.state;
        const updatedClients = clients.map(client=>{
            const updatedClient = {...client}
            switch(updatedClient.status){
                case statusClient.inicio:
                    updatedClient.status = statusClient.colaTickets
                    updatedClient.agentName = agentTickets.id
                    agentTickets.clients.push(updatedClient)
                    break;
                case statusClient.colaTickets:
                    break;
                case statusClient.atendidoTickets:
                    updatedClient.status = statusClient.colaAlimentos
                    updatedClient.agentName = agentAlimentos.id
                    agentAlimentos.clients.push(updatedClient)
                    break;
                case statusClient.colaAlimentos:
                    break;
                case statusClient.atendidoAlimentos:
                    updatedClient.status = statusClient.fin
                    break;
            }
            return updatedClient
        })
        this.setState({
            clients: updatedClients
        })
    }

    handleAddClient = () => {
        const {clients} = this.state;
        const id = clients.length ? clients[clients.length - 1].id + 1 : 1;
        const client = {
            id: id,
            name: `cliente${id}`,
            status: statusClient.inicio,
            agentName: ''
        }
        clients.push(client)
        this.setState({
            clients: clients
        })
        this.enqueueClients()
    }

    changeStatusClient = (idClient, agent, status) => {
        const {clients} = this.state;
        const indexClient = clients.findIndex(client => client.id===idClient)
        if(clients[indexClient]){
            clients[indexClient].status = status
            clients[indexClient].agentName = agent.id
            agent.free = true;
            this.setState({
                clients:clients,
                [agent.id]:agent
            })
        }
    }

    workAgent = (agent, status) => {
        if(agent.clients.length){
            agent.free = false
            this.setState({[agent.id]:agent},()=>{
                setTimeout(()=>{
                    const client = agent.clients.shift()
                    this.changeStatusClient(client.id,agent,status)
                }, this.randomWorkTime())
            })
        }
    }

    scheduleAgent = (idAgent) => {
        const agent = this.state[idAgent]
        if(agent.free){
            this.workAgent(agent,this.getStatusAttended(agent))
        }
    }

    render(){
        const {clients, agentTickets, agentAlimentos} = this.state;
        return(
            <Row gutter={16}>
                <Col span={8}>
                    <Clients clients={clients} addClients={this.handleAddClient}/>
                </Col>
                <Col span={8}>
                    <Agent key={agentTickets.id} {...agentTickets}/>
                </Col>
                <Col span={8}>
                    <Agent key={agentAlimentos.id} {...agentAlimentos}/>
                </Col>
            </Row>
        )
    }
    
}

export default Model;