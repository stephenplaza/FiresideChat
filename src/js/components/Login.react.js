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

        if (this.props.ismoderator) {
            var email = $("#email").val();
            var pass = $("#password").val();

            if (!email || !password) {
                return
            }

            this.props.firebase.authWithPassword({
                email    : email,
                password : pass 
            }, function(error, authData) {
                if (error) {
                    // do something
                    alert("login failed");
                } else {
                    this.setState({userName: value});
                    this.props.callback(value);
                }
            }.bind(this), { remember: "sessionOnly" });
        } else {  
            this.props.firebase.authAnonymously(function(error, authData) {
                if (error) {
                    // do something
                    alert("login failed");
                } else {
                    this.setState({userName: value});
                    this.props.callback(value);
                }
            }.bind(this));
        }
    },
    render: function () {
        if (this.state.userName === "") {
            // text box and event
            if (this.props.ismoderator) {
                return (
                    <div className="form">
                        Name <input type="text" maxLength="14" className="form-control" id="username" />
                        Username <input type="text" className="form-control" id="email" />
                        Password <input type="password" className="form-control" id="password" />
                        <button style={{marginTop: "1em"}} type="button" className="btn btn-primary" onClick={this.anonymousLogin}>Join Chat</button>
                    </div>
                );
            } else {
                return (
                        <div className="form">
                        Name <input type="text" maxLength="14" className="form-control" id="username" />
                        <button style={{marginTop: "1em"}} type="button" className="btn btn-primary" onClick={this.anonymousLogin}>Join Chat</button>
                        </div>
                );
            }
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
