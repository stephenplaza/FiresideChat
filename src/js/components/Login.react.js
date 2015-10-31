"use strict";

var React = require('react');

var Login = React.createClass({
    getInitialState: function () {
        return {
            userName: ""
        };
    },
    anonymousLogin: function () {
        var value = $("#username").val();
        if (value === "") {
            return;
        }
        
        this.props.firebase.authAnonymously(function(error, authData) {
            if (error) {
                // do something
                alert("login failed");
            } else {
                this.setState({userName: value});
                this.props.callback(value);
            }
        }.bind(this));
    },
    render: function () {
        if (this.state.userName === "") {
            // text box and event
            return (
                <div className="form">
                    <input type="text" className="form-control" id="username" />
    
                    <button style={{marginTop: "1em"}} type="button" className="btn btn-primary" onClick={this.anonymousLogin}>Join Chat</button>
                </div>
            );
        } else {
            return (
                <div>
                <label>User: {this.state.userName}</label>
                </div>
            );
        }
    }


});

module.exports = Login;
