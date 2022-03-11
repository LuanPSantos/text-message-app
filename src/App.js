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

  componentDidMount() {
    let currentComponent = this;
    let onConnected = () => {
      console.log("Connected!!")
      client.subscribe('/topic/messages', function (msg) {
        console.log(msg)
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
        body: 'Hello Socket',
        headers: { 'content-type': 'text/plain;charset=UTF-8' },
      });

      const quote = { symbol: 'APPL', value: 195.46 };
      client.publish({
        destination: '/app/send',
        body: JSON.stringify(quote),
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