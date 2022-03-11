import React from 'react';
import { Client } from '@stomp/stompjs';

const SOCKET_URL = 'ws://localhost:8080/ws-messages';

class App_Stomp extends React.Component {

  constructor() {
    super();
    this.state = {
      messages: 'You server message here.',
    };
  };

  binArrayToJson(binArray){
    var str = "";
    for (var i = 0; i < binArray.length; i++) {
      str += String.fromCharCode(parseInt(binArray[i]));
    }
    return JSON.parse(str)
  }

  componentDidMount() {
    let currentComponent = this;
    let onConnected = () => {
      console.log("Connected!!")
      client.subscribe('/topic/messages', function (msg) {
        currentComponent.setState({ messages: msg.body })
      });
    }

    let onDisconnected = () => {
      console.log("Disconnected!!")
    }

    let client = new Client({
      brokerURL: SOCKET_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: onConnected,
      onDisconnect: onDisconnected
    });

    client.activate();

    setTimeout(() => {
      client.publish({
        destination: '/app/send',
        body: {
          from: "1",
          text: "Text"
        },
        headers: { priority: '9', 'content-type': 'application/json' },
      });
    }, 2000)

  };

  render() {
    return (
      <div>
        <div>{this.state.messages}</div>
      </div>
    );
  }

}

export default App_Stomp;