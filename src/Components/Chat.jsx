import React from 'react';
import './styles.css';
import openSocket from 'socket.io-client';
import { Grid, Modal, Card } from '@material-ui/core';
const socket = openSocket('http://localhost:3030');

function subscribeToTimer(cb) {
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer');
}

// function previousMessage(message) {
//   socket.on('previousMessages', function(messages) {
//     for(message of messages) {
//       this.renderMessage(message);
//     }
//   })
// }



class Chat extends React.Component{
  constructor(props) {
    super(props) 

    this.state = {
      timestamp: 'no timestamp yet',
      obj: [],
      open: false
    }

    subscribeToTimer((err, timestamp) => this.setState({ 
      timestamp 
    }));

    this.receivedMessage(this.state.obj);
  }

  onChange = name => e => {
    this.setState({
      [name]: e.target.value
    });
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  receivedMessage(message) {
    const arr = this.state.obj
    socket.on('receivedMessage', message => {
      console.log(message)
      arr.push(message)
      this.setState({obj: arr})
    })  
  }

  getObj() {
    var obj = this.state.obj 
      return obj.map((item, index) => (
        <div key={index}>{item.username}: {item.message}</div>
      ))
  }

  sendMessageUser() {
    const arr = this.state.obj
    const messageObject = {
      username: this.props.location.state && this.props.location.state.username,
      message: this.state.message
    }

    arr.push(messageObject)
    this.setState({obj: arr})
    socket.emit('sendMessage', messageObject);
  }

  leaveMessageUser() {
    this.props.history.push('/user');
  }

  formatDate() {
    var date = new Date();

    // Formatando o tempo inicial
    var actualDate = this.state.timestamp.split(' ');
    var d = actualDate[1].split(':');
    var initialHour = parseInt(d[0]);
    var initialMinutes = parseInt(d[1]);
    var initialSeconds = parseInt(d[2]);

    // Formatando o tempo final
    var day = date.toLocaleString('pt-BR').split(' ');
    var f = day[1].split(':');
    var finalHour = parseInt(f[0]);
    var finalMinutes = parseInt(f[1]);
    var finalSeconds = parseInt(f[2]);

    var calculateTimeHour = finalHour - initialHour;
    var calculateTimeMinutes = finalMinutes - initialMinutes;
    var calculateTimeSeconds = finalSeconds - initialSeconds;
  
    if(calculateTimeHour !== 0) {
      return (
        <div>{calculateTimeHour + ' hour ' + calculateTimeMinutes + ' minutes ' + calculateTimeSeconds + ' seconds'}</div>
      )
    }

    if(calculateTimeMinutes !== 0) {
      return (
        <div>{calculateTimeMinutes + ' minutes ' + calculateTimeSeconds + ' seconds'}</div>
      )
    }

    if(calculateTimeSeconds !== 0) {
      return (
        <div>{calculateTimeSeconds + ' seconds'}</div>
      )
    }
    
  }

  render(){
    return (
      <div id="chat">
        the conversation started on: {this.state.timestamp}
        
          <div className="messages">
            <div>{this.getObj()}</div>
          </div>
          <input type="text" name="message" placeholder="Write your message" onChange={this.onChange('message')} />
          <Grid item xs={6}>
            <button onClick={() => this.sendMessageUser()} type="submit">Send</button>
          </Grid>
          
          <Grid item xs={6}>
            <button onClick={() => this.handleOpen()} style={{backgroundColor: '#c45a5a'}} type="submit">Leave</button>
          </Grid>

          <Modal style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.open}
            onClose={this.handleClose}
          >
          <Card className={'modal'}>
            <div style={{marginLeft: '30%', marginBottom: 20}}>His session lasted: {this.formatDate()} </div>
            <div style={{marginLeft: '30%'}}>Are you sure you want to leave?</div>
            <button className={'btnModal'} onClick={() => this.leaveMessageUser()} style={{backgroundColor: '#069'}} type="submit">Yes</button>
            <button className={'btnModal'} onClick={() => this.handleClose()} style={{backgroundColor: '#c45a5a'}} type="submit">No</button>
          </Card>
          </Modal>
        </div>
    )
  }
}

export default Chat             