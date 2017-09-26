'use strict';
import React, { Component } from 'react'
import {
  AppRegistry,
  Text,
  TextInput,
  View
} from 'react-native';

import Button from '../components/button';
import Header from '../components/header';

import Login from './login';

import firebase from 'firebase';


import styles from '../styles/common-styles.js';

export default class signup extends Component {

  constructor(props){
    super(props);

    this.state = {
      loaded: true,
      email: '',
      password: ''
    };
  }

  signup(){

    this.setState({
      loaded: false
    });

    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(()=> {
            this.setState({loaded:false})
            alert("created user succesfully")
        })
        .catch((error) => {
            switch(error.code){

            case "auth/email-already-in-use":
                alert("The new user account cannot be created because the email is already in use.");
            break;

            case "auth/invalid-email":
                alert("The specified email is not a valid email.");
            break;

            default:
                alert("Error creating user:");
            }
        })

  }

  goToLogin(){
    this.props.navigator.push({
      component: Login
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header text="Signup" loaded={this.state.loaded} />
        <View style={styles.body}>

            <TextInput
                style={styles.textinput}
                onChangeText={(text) => this.setState({email: text})}
                value={this.state.email}
            placeholder={"Email Address"}
            autoCapitalize={"none"}
            autoCorrect={false}
            />
          <TextInput
            style={styles.textinput}
            onChangeText={(text) => this.setState({password: text})}
            value={this.state.password}
            secureTextEntry={true}
            placeholder={"Password"}
            autoCapitalize={"none"}
            autoCorrect={false}
          />
          <Button
            text="Signup"
            onpress={this.signup.bind(this)}
            button_styles={styles.primary_button}
            button_text_styles={styles.primary_button_text} />

          <Button
            text="Got an Account?"
            onpress={this.goToLogin.bind(this)}
            button_styles={styles.transparent_button}
            button_text_styles={styles.transparent_button_text} />
        </View>
      </View>
    );
  }
}

AppRegistry.registerComponent('signup', () => signup);