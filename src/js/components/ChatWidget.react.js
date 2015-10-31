"use strict";

var React = require('react');
var Login = require('./Login.react');
var ChatWindow = require('./ChatWindow.react');

/*
 * Master component for the chat widget. 
*/
var ChatWidget = React.createClass({
    getInitialState: function () {
        return {
            userMode: false,
            userName: "default",
            chatRef: null
        };
    },
    userCallback: function (username) {
        this.setState({userMode: true, userName: username});
    },
    componentWillMount: function () {
        var chatRef = new Firebase(this.props.fireaddr);
        this.setState({chatRef: chatRef});
    },
    render: function () {
        if (this.state.userMode) {
             return (
                <div className="container-fluid"> 
                    <Login callback={this.userCallback} />
                    <ChatWindow firebase={this.state.chatRef} userName={this.state.userName} />
                </div>
            );
        } else {
            // ?! add blank for chat window
            return (    
                <div className="container-fluid"> 
                    <Login callback={this.userCallback} firebase={this.state.chatRef} />
                </div>
            )
        }
    }
});

module.exports = ChatWidget;
