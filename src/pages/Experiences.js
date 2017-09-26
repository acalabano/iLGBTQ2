import React, { Component } from 'react'
import {
  ListView,
  NetInfo,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Button
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ItemsActions from '../actions/items'
import Item from './Item'
import firebase from 'firebase';

class Experiences extends Component {
  constructor(props) {
    super(props)

    this.state = {
      newItem: '',
      text: '',
      height: 0,
      currentUserId: '',
      currentUsername:''
    }
  }

  componentWillMount() {
    this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

    this.props.loadOfflineItems()

    if (NetInfo) {
      NetInfo.isConnected.fetch().done(isConnected => {
        if (isConnected) {
          this.props.checkConnection()
        } else {
          this.props.goOffline()
        }
      })
    } else {
      this.props.checkConnection()
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ currentUserId: user.uid, currentUsername: user.displayName })
      }
    })
  }

  renderRow(rowData) {
    console.log(this.props.connected)
    return (
      <Item name={rowData.title}
            removable={this.props.connected}
            onRemove={() => this._remove(rowData.id)} />
    )
  }

  _add() {
    this.props.addItem(this.state.newItem);

    this.setState({newItem: ''})
    setTimeout(() => this.refs.newItem.focus(), 1)
  }

  _remove(id) {
    this.props.removeItem(id)
  }

  render() {
    console.log('PROPS!')
    console.log(this.props)
    console.log('This is the currentUsername', this.state.currentUsername)
    let items, readonlyMessage
    if (this.props.connected) {
      items = this.props.onlineItems
    } else if (this.props.connectionChecked) {
      items = this.props.offlineItems
      readonlyMessage = <Text style={styles.offline}>Offline</Text>
    } else {
      items = []
      readonlyMessage = <Text style={styles.offline}>Loading...</Text>
    }

    return (
      <View style={styles.container}>
        {readonlyMessage}
        <TextInput placeholder="Share your LGBT experiences or questions here"
                   style={styles.newItem}
                   ref="newItem"
                   editable={this.props.connected}
                   value={this.state.newItem}
                   multiline={true}
                   onChangeText={(newItem) => this.setState({newItem})}
                   onContentSizeChange={(event) => {
                      this.setState({ height: event.nativeEvent.contentSize.height })
                   }}
                   style={[styles.default, {height: Math.max(35, this.state.height)}]}
                   onSubmitEditing={() => this._add()} />
        <Button onPress={this._add.bind(this)} title= "Submit it!"/>
        <ListView
          dataSource={this.dataSource.cloneWithRows(items)}
          enableEmptySections={true}
          renderRow={this.renderRow.bind(this)}
        />
        {/* <Text>This is where the experience page will go</Text> */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#F6F6F6'
  },
  newItem: {
    backgroundColor: '#FFFFFF',
    height: 42,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 10,
    borderRadius: 5,
    fontSize: 20
  },
  offline: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    paddingTop: 5,
    paddingBottom: 5
  }
})
function mapStateToProps(state) {
  return {
    onlineItems: state.items.onlineList,
    offlineItems: state.items.offlineList,
    connectionChecked: state.items.connectionChecked,
    connected: state.items.connected
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ItemsActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Experiences)
