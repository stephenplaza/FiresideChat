"use strict";

window.$ = window.jQuery = require('jquery');
require('bootstrap');
var React = require('react');
var Master = require('./components/ChatWidget.react');


/* 
 * Renders component just to a DIV with DVIDServiceWidget.
*/
function loadInterface() {
    var fireaddr, ismoderator,
        element = document.getElementById("firesidechat");

    fireaddr = element.getAttribute("data-fireaddr");
    var moderator = element.getAttribute("data-moderatormode");
    ismoderator = false;
    if (moderator == "true") {
        ismoderator = true;
    }
    React.render(<Master fireaddr={fireaddr} ismoderator={ismoderator} />, element);
}

// do not render component until
if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', loadInterface);
} else { 
    $(document).ready(loadInterface);
}





