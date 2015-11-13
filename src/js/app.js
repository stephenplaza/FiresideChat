"use strict";

window.$ = window.jQuery = require('jquery');
require('bootstrap');
var React = require('react');
var Master = require('./components/ChatWidget.react');


/* 
 * Renders component just to a DIV with DVIDServiceWidget.
*/
function loadInterface() {
    var fireaddr, ismoderator, hasmwindow,
        element = document.getElementById("firesidechat");

    fireaddr = element.getAttribute("data-fireaddr");
    
    var moderator = element.getAttribute("data-moderatormode");
    ismoderator = false;
    if (moderator == "true") {
        ismoderator = true;
    }

    var mwindow = element.getAttribute("data-moderatorwindow");
    hasmwindow = false;
    if (mwindow == "true") {
        hasmwindow = true;
    }

    var readonly = element.getAttribute("data-readonly");
    var isreadonly = false;
    if (readonly == "true") {
        isreadonly = true;
    }

    React.render(<Master fireaddr={fireaddr} ismoderator={ismoderator} hasmwindow={hasmwindow} readOnly={isreadonly} />, element);
}

// do not render component until
if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', loadInterface);
} else { 
    $(document).ready(loadInterface);
}





