import React, {Component} from 'react';
import styled from 'styled-components';
import {Button} from "antd";

class Client extends Component{

    render(){
        const {name, status} = this.props;
        return(
            <div>
                {name} <b>{status}</b>
            </div>
        )
    }

}

export default Client;