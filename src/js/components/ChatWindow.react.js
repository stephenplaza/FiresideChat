"use strict";

var React = require('react');

var PageLimit = 100;
var InitialLimit = 10;

var ChatWindow = React.createClass({
    getInitialState: function () {
        return {
            messages: [],
            loadedAll: false
        }
    },
    componentWillMount: function () {
        // get initial messages (only grab last few)
        // watch for changes
        this.props.firebase.orderByChild("timestamp").limitToLast(InitialLimit).on("child_added", this.updateMsgs);
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
    showMore: function () {
        // show in increments of PageLimit
        var query = this.props.firebase.orderByChild("timestamp").endAt(this.state.messages[0].timestamp).limitToLast(PageLimit);

        // query older data and prepend to the currently loaded data
        query.once("value", function (datasnapshot) {
            if (datasnapshot.numChildren() < PageLimit) {
                this.setState({loadedAll: true});
            }

            var tempslice = [];
            var count = 1;
            var maxcount = datasnapshot.numChildren(); 
            // do not readd the last one
            datasnapshot.forEach(function(data) {
                if (count != maxcount) {
                    tempslice.push(data.val());
                }
                count += 1;
            });

            var newslice= tempslice.concat(this.state.messages);
            this.setState({messages:newslice});

        }.bind(this));
    },
    render: function () {
        // render submission box with button
        var msgbox = (
                    <div className="form">
                        <input type="text" maxLength="256" className="form-control" id="message" />
    
                        <button style={{marginTop: "1em"}} type="button" className="btn btn-primary" onClick={this.submitMsg}>Submit Message</button>
                    </div>
            );
        // render text with messages (alternate colors)
        var messages = this.state.messages.slice().reverse();
        var count = 0;
        
        // support pagination
        var pagination = <tr />;

        if (!this.state.loadedAll) {
            pagination = (
                            <center><a onClick={this.showMore}>Show More</a></center>
                    )
        }
        
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
                {pagination}
                </pre>
                {msgbox}
            </div>



        );
    }
});

module.exports = ChatWindow;
