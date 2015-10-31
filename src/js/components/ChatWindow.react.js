"use strict";

var React = require('react');

var ChatWindow = React.createClass({
    getInitialState: function () {
        return {
            messages: []
        }
    },
    componentWillMount: function () {
        // get initial messages (only grab last few)
        // watch for changes
        this.props.firebase.orderByChild("timestamp").limitToLast(10).on("child_added", this.updateMsgs);
    },
    submitMsg: function () {
        // grab text and submit with username -- do not explicitly extend messages?
        var value = $("#message").val();
        document.getElementById("message").value = '';
        if (value === "") {
            return;
        }
        this.props.firebase.push({
            text: value,
            timestamp: Firebase.ServerValue.TIMESTAMP, 
            username: this.props.userName
        }); 
    },
    updateMsgs: function (snapdata) {
        // concatenate messages and set state
        var newdata = snapdata.val();
        var tmessages = this.state.messages.slice();
        tmessages.push(newdata);
        this.setState({messages:tmessages});
    },
    render: function () {
        // render submission box with button
        var msgbox = (
                    <div className="form">
                        <input type="text" className="form-control" id="message" />
    
                        <button style={{marginTop: "1em"}} type="button" className="btn btn-primary" onClick={this.submitMsg}>Submit Message</button>
                    </div>
            );
        // render text with messages (alternate colors)
        var messages = this.state.messages.slice().reverse();
        var count = 0;
        return (
            <div>
                <pre className="pre-scrollable" style={{overflow:scroll, height: "300"}}>
                <table width="100%">
                {messages.map(function (val) {
                    var currtime = new Date(val.timestamp);
                    var timestr = currtime.toLocaleTimeString();
                    
                    var color = "LightGray";
                    if (count % 2) {
                        color = "White";
                    }
                    count += 1;
                    var rowref = "crow"+count.toString();
                    return (
                        <tr key={rowref} style={{backgroundColor: color}}>
                            <td style={{width: "10em", padding: "1em"}}><b>{val.username}</b>:</td>
                            <td style={{padding: "1em"}}>{val.text}</td>
                            <td style={{width: "10em", align: "right", padding: "1em"}}><font style={{align: "right"}}><i>{timestr}</i></font></td>
                        </tr>
                    );
                })}
                </table>
                </pre>
                {msgbox}
            </div>



        );
    }
});

module.exports = ChatWindow;
