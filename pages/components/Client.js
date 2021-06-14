import React, {Component} from 'react';
import styled from 'styled-components';
import {Button} from "antd";

class Client extends Component{

    state = {
    }

    render(){
        const {name, status} = this.props.client
        return(
            <div>
                {name} <b>{status}</b>
            </div>
        )
    }

}

export default Client;