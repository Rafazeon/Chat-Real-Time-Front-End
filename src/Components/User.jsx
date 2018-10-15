import React from 'react';
import { Input, InputLabel, Button, Card } from '@material-ui/core';

class User extends React.Component{

    constructor(props) {
        super(props)

        this.state = {
            name: '',
            message: ''
        }
    }

    onChange = name => e => {
        this.setState({
          [name]: e.target.value
        });
    }

    onFormSubmit(user) {
        if(!user) {
            this.setState({message: 'Informe um usuário válido'})
        }else{
            this.props.history.push({
                pathname: '/chat',
                state: { username: user }
            })
        }
        
    }

    render() {
        return (
            <div style={box}>
            <Card style={{padding: 50, marginTop: 20}}>
                <div id="chat">
                    <h3>Olá visitante informe seu nome e entre no chat</h3>
                    <Input
                        name="name"
                        type="text" 
                        placeholder="Nome"
                        id="inputName"
                        onChange={this.onChange('name')} 
                    />
                    <Button color="primary" onClick={() => this.onFormSubmit(this.state.name)} type="submit">Enviar</Button>
                    <div style={{marginTop: 10}}>{this.state.message}</div>
                </div>
            </Card>
            </div>
        )
    }
}

const box = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

export default User