"use strict";

var React = require('react');
var Login = require('./Login.react');
var ReadOnly = require('./ReadOnly.react');
var ChatWindow = require('./ChatWindow.react');

/*
 * Master component for the chat widget. 
*/
var ChatWidget = React.createClass({
    getInitialState: function () {
        return {
            userMode: false,
            userName: "default",
            chatRef: null,
            numUsers: 0
        };
    },
    userCallback: function (username) {
        this.setState({userMode: true, userName: username});
        var addr = this.props.fireaddr;
        var baseaddr = addr.slice(0, addr.indexOf('.com')+4)
        var listRef = new Firebase(baseaddr + "/activeusers");
        var userRef = listRef.push();

        var presenceRef = new Firebase(baseaddr + "/.info/connected");
        presenceRef.on("value", function(snap) {
            if (snap.val()) {
                userRef.set(true);
                userRef.onDisconnect().remove();
            }
        });

        listRef.on("value", function(snap) {
            this.setState({numUsers: snap.numChildren()});
        }.bind(this));
    },
    readOnlyCallback: function () {
        this.setState({userMode: true});
    },
    componentWillMount: function () {
        var chatRef = new Firebase(this.props.fireaddr);
        this.setState({chatRef: chatRef});
    },
    render: function () {
        if (this.props.readOnly) {
            if (this.state.userMode) {
                 return (
                        <div className="container-fluid"> 
                        <ChatWindow firebase={this.props.fireaddr} userName={this.state.userName} ismoderator={false} ismwindow={false} hasmwindow={false} readOnly={true} />
                        </div>
                       );
        
            } else {
                return (
                        <div className="container-fluid">
                            <ReadOnly firebase={this.state.chatRef} callback={this.readOnlyCallback} />
                        </div> 
                )
            }
        } else {
            var mwindow = <a />
                if (this.props.hasmwindow && this.props.ismoderator) {
                    mwindow = <ChatWindow firebase={this.props.fireaddr} userName={this.state.userName} ismoderator={this.props.ismoderator} ismwindow={true} hasmwindow={true} readOnly={false} />
                }

            if (this.state.userMode) {
                return (
                        <div className="container-fluid"> 
                        <Login callback={this.userCallback} />
                        <p>{this.state.numUsers} users are connected</p>
                        {mwindow}
                        <ChatWindow firebase={this.props.fireaddr} userName={this.state.userName} ismoderator={this.props.ismoderator} ismwindow={false} hasmwindow={this.props.hasmwindow} readOnly={false}  />
                        </div>
                       );
            } else {
                // ?! add blank for chat window
                return (    
                        <div className="container-fluid"> 
                        <Login callback={this.userCallback} firebase={this.state.chatRef} ismoderator={this.props.ismoderator} />
                        </div>
                       )
            }
        }
    }
});

module.exports = ChatWidget;
