---
year: "2016"
month: "03"
day: "21"
filename: "socket-to-me"
title: "Socket To Me"
date: 2016-03-21 12:00:00
desc: The first things I learned when using Socket.IO
tags: ["JavaScript", "Socket.IO", "NodeJS"]
---

[Socket.IO](http://socket.io/) is a WebSocket API built for Node.js. For a while I'd been intimidated by the idea of diving into WebSockets, but after looking over the documentation for Socket.IO I decided it was time to dive in. I was really surprised by how painless it was to get sockets up and running.

To get started, `npm install --save socket.io` into your project, require it in your server and include `<script src="/socket.io/socket.io.js"></script>` in your client index.html file. Checking out the [Socket.IO docs](http://socket.io/docs/) is probably the best way to start. On the server, Socket.IO listens for a 'connection' event initiated when a client establishes a socket connection. From the Socket.IO docs example:

```
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
});
```

Once a connection is established, the callback function can send out (`emit`) messages to all connected clients. Likewise, within this callback is where you can also set up listeners for other event types, including custom event types of your choosing that you can set-up on the client. For instance:

```
io.on('connection', function (socket) {
  // whenever a client connects, a news message gets emitted out 
  // to all connected clients
  socket.emit('news', { hello: 'world' });

  // the socket listen for any incoming news
  socket.on('myNews', function (newsReport) {
    // when new news comes in, it gets emitted out to all 
    // connected clients
    socket.emit( 'news', newsReport );
  });
});
```

On the client, we can grab a reference to the global `io` variable, then handle sending and receiving news reports:

```
var socket = io();
var newsReport = { hello: 'universe' };

// we listen for news coming in on the client, and when it does we 
// log the incoming message to the console the first 
// report.hello message we get will console out 'world'
socket.on('news', function(report) {
  console.log( report.hello );
});

// we send out our own news report using 'myNews'. this message 
// will be received by the server and immediately sent back 
// to us thanks to the listener for 'myNews' on the server. 
// we should see 'universe' logged to the console.
socket.emit( 'myNews', newsReport );
```

I haven't gotten too deep into the Socket.IO API, but one thing that I came to realize pretty quickly was that I wanted to be able to identify clients, both on the server and in messages emitted from one client and received by others. The `socket` argument passed to the callback on `'connection'` has a unique ID applied on a per client/per session basis. By accessing this `.id` property, we can keep track of the clients that are connected to a session at a given time. There is likely a better way to do this, but I also ended up sending the client id back to the client so that it could be affixed to all subsequent emitted messages. This gave me an easy way to identify unique user messages on a given client. So, on the server:

```
// make an array to store the current client list on the server
var allClients = [];

io.on('connection', function (socket) {
  // grab the id property of the new connection and add it to the list 
  // of connected clients
  allClients.push(socket.id);
  
  // send the id back to the client
  socket.send(socket.id);

  // when the client disconnects, remove the corresponding id from 
  // the allClients array
  socket.on('disconnect', function () {
    allClients = allClients.filter(function (id) {
      return id !== socket.id;
    });
  });
});
```

Then on the client:
```
var socket = io(), clientId;

// this corresponds to the 'socket.send(socket.id)' line in the
// server code. the id is the incoming message supplied to the 
// callback here
socket.on('message', function (message) {
  clientId = message;
});

/****
** now the clientId can be affixed to outgoing messages so
** that the origin of incoming messages can be easily identified 
****/
```