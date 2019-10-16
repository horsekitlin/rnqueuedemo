/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
var Queue=require('js-queue');
var Message=require('js-message');

var queue=new Queue;
const ws=new WebSocket('wss://echo.websocket.org/?encoding=text');

function startWS(){
  //websocket.org rocks


  ws.onmessage = handleResponse;
  ws.onopen = function(){
    
          //now that websocket is opened allow auto execution
          queue.stop=false;
      };

  ws.onerror = function(err){
          //stop execution of queue if there is an error because the websocket is likely closed
          queue.stop=true;
          //remove remaining items in the queue
          queue.clear();
          throw(err);
      }

  ws.onclose = function(){
          //stop execution of queue when the websocket closed
          queue.stop=true;
      }
}
startWS();

var messageID=0;

function handleResponse(e){
  var message=new Message;
  message.load(e.data);

  console.log(message.type,message.data);
}

function makeRequest(){
  messageID++;
  var message=new Message;
  message.type='testMessage';
  message.data=messageID;

  ws.send('something'); // send a message
  console.log("TCL: makeRequest -> message.JSON", message.JSON)

  this.next();
}
setTimeout(() => {
  for(var i=0; i<50; i++){
    queue.add(makeRequest);
  }
}, 3000);

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
