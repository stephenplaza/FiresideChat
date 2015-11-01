# FiresideChat 

##A Firebase Javascript Chat Application with Moderation

*(status: in progress, moderation not fully implemented)*

This package provides a simple, scalable Javascript chat application using the REACT framework and [Firebase](https://www.firebase.com/).

It currently allows annoymous user login to read/write messages to a common location (chat room).  The most recent messages in the chat room are first loaded.

Main TODO: Moderation mode that requires messages to be approved by a trusted moderator. 

## Quick Start Guide

This package contains a 'dist' directory which contains the chat widget in index.html (see release zip file).  Before launching this page, your Firebase account address must be specified in place of YOURADDR (signup for Firebase is free).  The moderator mode can be toggled by setting data-moderatormode to "true" or "false".  To use the moderator mode, an email/password must be registered for the given Firebase account.

## Installation and Usage

    % npm install
    % grunt dist

Installed js file located in build/js/bundle.js.  The application must include the built js.

    % <script src="js/bundle.min.js"></script>

For more detailed information on the libraries to include, please consult src/application.html.

To include the chat application do the following:

    % <div id="firesidechat" data=fireaddr="<FIREBASEADDRESS/LOCATION>" data-moderatormode="false">

A valid Firebase address must be provided and a location for the chat room should be specified (e.g., "chats/saturdaydiscussion").

This chat application orders messages by timestamp.  If there are a lot of messages at a given location (chat room), it might be beneficial to add a custom index rule in your Firebase account.  For the given location, add {".indexOn": "timestamp"}.

## Moderation Mode

To enable moderation mode, set "data-moderationmode" to "true".  Currently, moderation mode requires that a email/password has been setup on Firebase for the given reference location.  The moderator mode lets the user delete certain posts.  TBD: allow messages to pass to the moderator before being public.

## A Note on Authentication and Permissions

This package currently assumes anonymous read/writes are possible at the given database location provided to the package.  It is assumed that the moderator is the only one with priveleges to delete entries.  While not necessary for this application to work, this behavior can be enforced by setting rules in one's Firebase account.  For instance, the following rule prevents the deletion of an existing item unless the authenticated user has the uid of SOMEUID:

    ".write": "(!data.exists() && newData.exists()) || (auth.uid == 'SOMEUID')"

More elegant rules can be written that work over custom user groups created in a firebase database location.

It is also possible to ensure that only items with a certain format can be added.  The following validation rule admits the messages added by this application.

    ".validate": "newData.hasChildren(['text', 'timestamp', 'username'])"
    
For now, authentication is anonymous or uses a Firebase email/password for the moderator mode.  TBD: allow other forms of authentication for moderators (like google or twitter) and allow tokens to be passed for both moderator and non-moderator mode to allow server-side authentication and more restrictive access to non-moderators while not allowing public read/write.

## TODO

* Add a moderator mode to accept/reject posts.
* Allow component to take a Firebase token for login to allow server side control of user access and moderation.
* Provide a panel to allow moderators to broadcast messages.
* Export chat widget component for reuse in other REACT environments, allow for multiple chat windows.
