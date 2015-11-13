"use strict";

var React = require('react');

var ReadOnly = React.createClass({
    getInitialState: function () {
        return {
        };
    },
    readLogin: function () {
        this.props.firebase.authAnonymously(
            function(error, authData) {
                if (error) {
                    // do something
                } else {
                    this.props.callback();
                }
            }.bind(this)
        );
    },
    render: function () {
        return (
            <div className="jumbotron form">
                <h1>Live Chat Closed</h1>
                <button type="button" className="btn btn-primary" onClick={this.readLogin}>View Messages</button>
            </div>
        );
    }

});

module.exports = ReadOnly;

