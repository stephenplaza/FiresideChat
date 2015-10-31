# FiresideChat 

##A Firebase Javascript Chat Application with Moderation

*(status: in progress, moderation not fully implemented)*

This package provides a simple, scalable Javascript chat application using the REACT framework and [Firebase](https://www.firebase.com/).

It currently allows annoymous user login to read/write messages to a common location (chat room).  The most recent messages in the chat room are first loaded.

Main TODO: Moderation mode that requires messages to be approved by a trusted moderator. 

##Installation and Usage

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

Permissions should be setup on Firebase that allows only the moderator user to delete children for the given chat location.

## TODO

* Add a moderator mode to accept/reject posts.
* Allow component to take a Firebase token for login to allow server side control of user access and moderation.
* Provide a panel to allow moderators to broadcast messages.
* Export chat widget component for reuse in other REACT environments, allow for multiple chat windows.
