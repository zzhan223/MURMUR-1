var React = require('react');
var ReactRouter = require('react-router');
// var url = 'http://0.0.0.0:3000/';


var Home = React.createClass({
  mixins: [ReactRouter.Navigation],

  emailPersist: '',

  getInitialState: function() {
    return {
      loggedIn: false,
      roomname: '',
      email: '',
      password: '',
      url: 'signin',
      button: 'create an account',
      emailStore: ''
    };
  },

  handleRoomnameChange: function(event) {
    this.setState({
      roomname: event.target.value
    })
  },

  handlePasswordChange: function(event){
    this.setState({
      password: event.target.value
    })
  },

  handleEmailChange: function(event){
    this.setState({
      email: event.target.value
    })
  },

  enterPressed: function(event) {
    var self = this;
    if(event.keyCode === 13 && this.state.loggedIn) {
      this.submitRoom(event);
    }

    if(event.keyCode === 13 && !this.state.loggedIn) {
      this.submitAuth(event);
    }
  },

  submitRoom: function(event){
    var that = this;
    event.preventDefault();
    $.ajax({ // Post message
      type: 'POST',
      url: '/create',
      contentType: 'application/json',
      data: JSON.stringify({
        roomname: this.state.roomname,
        email: this.state.emailStore
      }),
      success: function(data){
        console.log('server response:', data);
        if (data.success) {
          that.transitionTo('room', {id: data.id});
        }
      }
    });
    this.setState({ roomname: '' }); // Clear input box
    console.log('create:', this.state);
    console.log(this.state.url);
  },

  CreateRoom: function() { 
    return (
      <div className="input-group" style = {{padding: '15px', marginTop: '100px'}}>
        <h1>create a room</h1>
        <input value={this.state.roomname} onChange={this.handleRoomnameChange} onKeyDown={this.enterPressed} type="text" className="form-control"  placeholder="Enter your room's name" />
        <span className="input-group-btn" >
          <button onClick={this.submitRoom} className="btn btn-success" type="button"> Submit </button>
        </span>      
      </div>
    )
  },

  submitAuth: function(event){
    event.preventDefault();
    var that = this;
    $.ajax({ // Post message
      type: 'POST',
      url: '/' + this.state.url,
      contentType: 'application/json',
      data: JSON.stringify({ "email": this.state.email, "password": this.state.password }),
      success: function (d){
        if (d.token !== 'null') {
          that.setState({
            loggedIn : true,
            emailStore : that.state.email
          })
        }
      }
    });
    console.log(this.state);
  },

  toggleAuth: function(event){
    event.preventDefault();
    if(this.state.url==="signin") {
      this.setState({
        button: "already have an account?",
        url: "signup"
      });
    } else {
      this.setState({
        button: "create an account",
        url: "signin"
      });
    }
  },

  Auth: function(){
    return (
      <div className="input-group" style={{ padding: '15px', marginTop: '100px' }} >
        <h1>{this.state.url}</h1>
        <input value={this.state.email} onChange={this.handleEmailChange} onKeyDown={this.enterPressed} type="text" className="form-control"  placeholder="Enter e-mail address" />
        <input value={this.state.password} onChange={this.handlePasswordChange} onKeyDown={this.enterPressed} type="password" className="form-control"  placeholder="Enter password" />
        <span className="input-group-btn">
          <button onClick={this.submitAuth} className="btn btn-success" type="button"> Submit </button>
        </span>
        <span className="input-group-btn">
          <input type="button" onClick={this.toggleAuth} className="btn btn-success" value={this.state.button} />
        </span>        
      </div>
    )
  },

  render: function(){
    return (
      <div>
        { !this.state.loggedIn ? this.Auth() : null }
        { this.state.loggedIn ? this.CreateRoom() : null }
      </div>
    )
  }
});

module.exports = Home;

// var element = React.createElement(HOM);
// React.render(element, document.querySelector('.container'));