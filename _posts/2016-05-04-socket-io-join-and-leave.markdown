---
layout: post
title: "Socket.IO Join and Leave"
date: 2016-05-04 12:00:00
desc: Handling subscribing and unsubscribing with Socket.IO
tags: ["Socket.IO", "join", "leave", "JavaScript"]
---

Several weeks ago I wrote about [getting up and running with Socket.IO](/2016/03/21/socket-to-me.html). I've used Socket.IO a bunch since, and have found one of the most useful features to be the ease with which you can join and leave rooms. To the extent that you can, your filtering of data and socket management should be occurring on the server, not on the client &mdash; `join` and `leave` let you easily sort out which sockets get what data emitted to them. 

I am currently working on a project where we have a continuous, hot stream of data coming into our server from a variety of sources. When a new piece of data comes in to the server, we want to be able to process it, then push it out to connected clients in a slightly altered form. However, we want connected clients to be able to pick and choose which source they are receiving data from. I'm not sure that this is an ideal use case for Socket.IO. However, we already had a socket server in place for other purposes, so it seemed worthwhile to give it a shot.

This problem can be broken down into three main parts, with Socket.IO serving as the linchpin:

1. We need a way for Socket.IO to listen for the data coming into the server and getting processed. We want to send the processed data out over the socket connections. We ended up using the Node.js `EventEmitter` for this purpose.

2. We need the incoming data to have some identifiable property that splits it into rooms/channels/sources. One `EventEmitter` instance is going to be passing in the aggregated data to the socket server from all sources, and we need an identifier on each incoming object in order to know where to send it. Socket rooms are identified by strings.

3. We need the connected clients to be able to join and leave socket rooms at will from the browser. Ideally we have all of the room names available to us on the client-side so we can easily identify a given room on the server.

Let's start with the first problem. The source of the data is irrelevant, so let's assume that we have an SDK that abstracts away any complexity with receiving the data. What we want is to be able to listen for incoming data:

{% highlight javascript %}
// let's first get an instance of the EventEmitter
const events = require('events');
const eventEmitter = new events.EventEmitter();

// once we have connected an instance of our imaginary
// sdk, let's assume that we have an event listener
// available to us that can listen for events of type
// 'dataReceived'
myDataConnection.on('dataReceived', (dataObj) => {
  // now that we are listening for incoming data, 
  // let's respond by emitting out that data. the
  // event naming here is arbitrary...
  eventEmitter.emit('newData', dataObj);
});
{% endhighlight %}

Now we have a `newData` event emitting out data when it comes in. All we need to do is have our socket server listen for this event, then pass the data onto the connected clients.

{% highlight javascript %}
io.on('connection', (socket) => {

  // we listen for a 'newData' event from the eventEmitter
  eventEmitter.on('newData', (data) => {
    // when that event fires, we send the associated data
    // out to all of our connected clients
    io.emit('data:update', data);
  });

});
{% endhighlight %}

This brings us to the problem of filtering out the incoming data so that only some portion of the stream is going out to a given client. Let's assume that the `dataObj` coming in on `myDataConnection` has a property that we can use for this room assignment, something like `.name` or `.channel`. We can update our socket server so that we only emit incoming data out to sockets subscribed to the room that shares this name:

{% highlight javascript %}
io.on('connection', (socket) => {

  eventEmitter.on('newData', (data) => {
    // the data passed in is an object with a property 
    // .name that we will use as a room name
    const roomName = data.name;

    // we now will only emit data to the room that shares 
    // this name, using .to
    io.to(roomName).emit('data:update', data);
  });

});
{% endhighlight %}

We still need a way for a client to subscribe to a given room. Likewise, a client should be able to easily unsubscribe. Let's add some listeners to the socket server to handle this.

{% highlight javascript %}
io.on('connection', (socket) => {

  // listen for a room:subscribe event
  socket.on('room:subscribe', (roomName) => {
    // when a room:subscribe event comes in, the socket that
    // emitted the event joins the room that was passed
    socket.join(roomName);
  });

  // listen for a room:unsubscribe event
  socket.on('room:unsubscribe', (roomName) => {
    // when a room:unsubscribe event comes in, the socket that
    // emitted the event leaves the room that was passed
    socket.leave(roomName);
  });

  eventEmitter.on('newData', (data) => {
    const roomName = data.name;
    io.to(roomName).emit('data:update', data);
  });

});
{% endhighlight %}

The implementation on the client is highly dependent on what framework we are using, if any. As a basic example, we could do something like the following (after including `<script src="/socket.io/socket.io.js"></script>` in your html file):

{% highlight javascript %}
const socket = io();

// the below can be used as updateSubscription(roomName) on,
// for instance, a click handler
const updateSubscription = (() => {
  let currentRoom = null;

  return (roomName) => {
    if (currentRoom) {
      // if there is a room already set, unsubcribe from it
      socket.emit('room:unsubscribe', currentRoom);
    }
    // subscribe to roomName, set currentRoom
    socket.emit('room:subscribe', roomName);
    currentRoom = roomName;
  }
})();

// the final step is to listen for data coming into the
// room that we've subscribed to.
socket.on('data:update', (data) => {
  // do something with the incoming data!
});
{% endhighlight %}