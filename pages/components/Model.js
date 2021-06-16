import React, {Component, Fragment} from 'react';
import styled from 'styled-components';
import {Button,Row, Col} from 'antd'

import Agent from './Agent.js'
import Clients from './Clients'
import Log from './Log'

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

const RowLeyend = (props) => <p style={{padding: '0', margin:'0'}}><b>{props.abv}</b>: {props.name}</p>

class Model extends Component{

    state = {
        idInterval: 0,
        clients: [],
        agentTickets: {},
        agentAlimentos: {},
        logs:[]
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
        const {clients, agentTickets, agentAlimentos, logs} = this.state;
        const updatedClients = clients.map(client=>{
            const updatedClient = {...client}
            switch(updatedClient.status){
                case statusClient.inicio:
                    updatedClient.status = statusClient.colaTickets
                    updatedClient.agentName = agentTickets.id
                    agentTickets.clients.push(updatedClient)
                    logs[updatedClient.id].push(statusClient.colaTickets)
                    break;
                case statusClient.colaTickets:
                    break;
                case statusClient.atendidoTickets:
                    updatedClient.status = statusClient.colaAlimentos
                    updatedClient.agentName = agentAlimentos.id
                    agentAlimentos.clients.push(updatedClient)
                    logs[updatedClient.id].push(statusClient.colaAlimentos)
                    break;
                case statusClient.colaAlimentos:
                    break;
                case statusClient.atendidoAlimentos:
                    updatedClient.status = statusClient.fin
                    logs[updatedClient.id].push(statusClient.fin)
                    break;
            }
            return updatedClient
        })
        this.setState({
            clients: updatedClients,
            agentTickets: agentTickets,
            agentAlimentos: agentAlimentos,
            logs: logs
        })
    }

    handleAddClient = () => {
        const {clients, logs} = this.state;
        const id = clients.length ? clients[clients.length - 1].id + 1 : 1;
        const client = {
            id: id,
            name: `cliente${id}`,
            status: statusClient.inicio,
            agentName: ''
        }
        logs[client.id] = [statusClient.inicio]
        clients.push(client)
        this.setState({
            clients: clients,
            logs: logs
        })
        this.enqueueClients()
    }

    changeStatusClient = (idClient, agent, status) => {
        const {clients, logs} = this.state;
        const indexClient = clients.findIndex(client => client.id===idClient)
        if(clients[indexClient]){
            clients[indexClient].status = status
            logs[idClient].push(status)
            clients[indexClient].agentName = agent.id
            agent.free = true;
            this.setState({
                clients:clients,
                logs: logs,
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

    leyend(){
        return(
            <Fragment>
                <RowLeyend name='Inicio' abv={statusClient.inicio}/>
                <RowLeyend name='Cola de Tickets' abv={statusClient.colaTickets}/>
                <RowLeyend name='Atendido Tickets' abv={statusClient.atendidoTickets}/>
                <RowLeyend name='Cola de Alimentos' abv={statusClient.colaAlimentos}/>
                <RowLeyend name='Atendido Alimentos' abv={statusClient.atendidoAlimentos}/>
                <RowLeyend name='Fin' abv={statusClient.fin}/>
            </Fragment>
        )
    }

    render(){
        const {clients, agentTickets, agentAlimentos, logs} = this.state;
        return(
            <div>
                <Row gutter={16}>
                    <Col span={8}>
                        <Clients clients={clients} addClients={this.handleAddClient}/>
                    </Col>
                    <Col span={8}>
                        <Agent
                            key={agentTickets.id}
                            name={agentTickets.name}
                            clients={agentTickets.clients}
                            free={agentTickets.free}
                        />
                    </Col>
                    <Col span={8}>
                        <Agent
                            key={agentAlimentos.id}
                            name={agentAlimentos.name}
                            clients={agentAlimentos.clients}
                            free={agentAlimentos.free}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <h4>
                            Leyenda:
                        </h4>
                         {this.leyend()}
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <h4>
                            Registro
                        </h4>
                        <Log logs={logs}/>
                    </Col>
                </Row>
            </div>
        )
    }
    
}

export default Model;