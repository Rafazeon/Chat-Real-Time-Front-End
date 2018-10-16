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
    // Formatando o tempo inicial
    var actualDate = this.state.timestamp;
    
    var formatAd = new Date(actualDate)
    
    // Formatando o tempo final
    
    var date = new Date();

    var d = date.toUTCString('pt-BR')

    var formatFd = new Date(d)

    var res = Math.abs(formatAd - formatFd) / 1000;
         
    // get total days between two dates
    var days = Math.floor(res / 86400);
    console.log("<br>Difference (Days): "+days);                        
    
    // get hours        
    var hours = Math.floor(res / 3600) % 24;        
    console.log("<br>Difference (Hours): "+hours);  
    
    // get minutes
    var minutes = Math.floor(res / 60) % 60;
    console.log("<br>Difference (Minutes): "+minutes);  

    // get seconds
    var seconds = res % 60;
    console.log("<br>Difference (Seconds): "+seconds);

    if(days !== 0) {
      return days + ' days ' + hours + ' hours ' + minutes + ' minutes ' + seconds + ' seconds'
    }
    
    if(hours !== 0) {
      return hours + ' hours ' + minutes + ' minutes ' + seconds + ' seconds'
    }

    if(minutes !== 0) {
      return minutes + ' minutes ' + seconds + ' seconds'
    }

    if(seconds !== 0) {
      return seconds + ' seconds'
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