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
        // get initial messages (only grab last few) -- watch for changes
        // check if child was removed
        this.props.firebase.orderByChild("timestamp").limitToLast(InitialLimit).on("child_added", this.updateMsgs);
        this.props.firebase.orderByChild("timestamp").limitToLast(InitialLimit).on("child_removed", this.delMsgs);
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
    delMsgs: function (snapdata) {
        // concatenate messages and set state
        var key = snapdata.key();
        var tmessages = [];

        // add non-deleted keys
        for (var i = 0; i < this.state.messages.length; i++) {
            if (this.state.messages[i].key != key) {
                tmessages.push(this.state.messages[i]);
            } 
        }
        this.setState({messages:tmessages});
    },
    updateMsgs: function (snapdata) {
        // concatenate messages and set state
        var newdata = snapdata.val();
        var key = snapdata.key();
        newdata.key = key;

        var tmessages = this.state.messages.slice();
        tmessages.push(newdata);
        this.setState({messages:tmessages});
    },
    componentWillUnmount: function() {
        // global deref -- dangerous ?!
        this.props.firebase.off()
    },
    showMore: function () {
        // show in increments of PageLimit
        var query = this.props.firebase.orderByChild("timestamp").endAt(this.state.messages[0].timestamp).limitToLast(PageLimit);

        // query older data and prepend to the currently loaded data
        // only need to call once
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
                    var tval = data.val();
                    tval.key = snapdata.key();
                    tempslice.push(tval);
                }
                count += 1;
            });

            var newslice= tempslice.concat(this.state.messages);
            this.setState({messages:newslice});

        }.bind(this));
    },
    removeKey: function (delkey) {
        // get child and delete
        this.props.firebase.child(delkey).remove();
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

                    // moderator mode allows messages to be deleted                   
                    var that = this;
                    if (this.props.ismoderator) {
                        var removeMessage = <td />;
                        removeMessage = <td><button key={val.key} id={val.key} onClick={that.removeKey.bind(null, val.key)} className="btn btn-default" aria-label="Left Align"> <span className="glyphicon glyphicon-remove" aria-hidden="true"></span></button></td>;
                    }

                    return (
                        <tr key={rowref} style={{backgroundColor: color}}>
                            {removeMessage}
                            <td style={{width: "10em", padding: "1em"}}><b>{val.username}</b>:</td>
                            <td style={{padding: "1em"}}>{val.text}</td>
                            <td style={{width: "10em", align: "right", padding: "1em"}}><font style={{align: "right"}}><i>{timestr}</i></font></td>
                        </tr>
                    );
                }.bind(this))}
                </table>
                {pagination}
                </pre>
                {msgbox}
            </div>



        );
    }
});

module.exports = ChatWindow;
