'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  AsyncStorage
} from 'react-native';
import NavigationExperimental from 'react-native-deprecated-custom-components';

import Signup from './src/pages/signup';
import Account from './src/pages/account';
import App from './src/app';

import Header from './src/components/header';

import firebase from 'firebase';
console.log('this is Firebase----', firebase)
// let app = new Firebase("rn-firebase-auth-23e09.firebaseapp.com");

import styles from './src/styles/common-styles.js';

class rnfirebaseauth extends Component {    

  constructor(props){
    super(props);
    this.state = {
      component: null,
      loaded: false
    };
  }

  componentWillMount(){

    AsyncStorage.getItem('user_data').then((user_data_json) => {

      let user_data = JSON.parse(user_data_json);
      console.log('this is the user data----', user_data)
      let component = {component: Signup};
      if(user_data != null){
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            this.setState({component: App})
          }
          else{
            this.setState(component)
          }
        })
      }else{
        this.setState(component);
      }
    });

  }

  render(){

    if(this.state.component){
      return (
        <NavigationExperimental.Navigator        
          initialRoute={{component: this.state.component}}
          configureScene={() => {
            return NavigationExperimental.Navigator.SceneConfigs.FloatFromRight;
          }}
          renderScene={(route, navigator) => {
            if(route.component){
              return React.createElement(route.component, { navigator });
            }
          }}
        />
      );
    }else{
      return (
        <View style={styles.container}>
          {/* <Header text="React Native Firebase Auth" loaded={this.state.loaded} />   */}
          {/* <View style={styles.body}></View> */}
        </View>
      );
    }

  }

}

AppRegistry.registerComponent('rnfirebaseauth', () => rnfirebaseauth);