var socketio = require('socket.io');
var messages = require('./controlers/messagescontroler');
var notification = require('./controlers/notification');
var users = {};

exports.listen = (server) => {
  io = socketio().listen(server, {
    pingTimeout: 60000,
  });

  io.on('connection', (client) => {
    console.log("client Connected  ", client.id);
    client.on('new user', function (data) {
      console.log("we have new socket for user ", data);
      var username = data;
      if (username){
        if (users[username]){
            console.log("new socket added for ", username); 
            users[username].push(client);
            console.log(users);
          }
        else{
          users[username] = [];
          users[username].push(client);
        }
      }
      // Online
      client.on('Online', (username) => {
        console.log(username, 'is online?');
        setInterval(() => {
          if (users[username]){
            client.emit('isOnline'+username, true);
          }else{
            client.emit('isOnline'+username, false);
          }
        }, 1000);

      });
    });

    client.on('notifyUser', (data) => {
      if (users[data.to]){
        users[data.to].forEach( user_socket => {
          user_socket.emit('notification', {title: data.title, msg: data.msg});
        });
      }
    });

    client.on('logout', (username) => {
      console.log('logout  ', users);
      delete users[username];
      console.log(users);
    });
    client.on('disconnect', function () {
      console.log('client disconnect...', client.id)

    });
    // client.on('reconnect', () => {
    //   console.log('reconnecting...');
    //   client.socket.reconnect();
    // })
  });

  io.of("/messages").on('connection', (client) => {
    console.log("client Connected  ", client.id);

    client.on('room message', function (data) {
      //console.log('new message from ' + data.from, 'to ' + data.to + ' in ' + data.room);
      io.of("/messages").to(data.room).emit('message from room', { msg: data.msg, from: data.from, room: data.room });
      // send to controller
      messages.addMessage({ from: data.from, to: data.to, msg: data.msg, room: data.room });
      if (users[data.to]){
        //console.log("sending notification to "+data.to);
        users[data.to].forEach(user_socket => {
          console.log('sent notification to '+data.to);
          user_socket.emit('notification', {title: 'new message from '+data.from, msg: '"'+data.msg+'"'});          
        });
        notification.addNotification({user: data.to, msg: data.msg, title: 'new message from '+data.from});
      }
    })
    client.on('joinroom', function (room) {
      client.join(room);
    })

    client.on('typing', function (data) {
      io.of("/messages").to(data.room).emit('typing', data.from);
      //   if (users[data.to])
      //     users[data.to].emit('typing', data.from);
    });

    client.on('stopTyping', function (data) {
      io.of("/messages").to(data.room).emit('stopTyping', data.from);
      // if (users[data.to])
      //   users[data.to].emit('stopTyping');
    });

    client.on('disconnect', function () {
      console.log('client disconnect...', client.id)
    });

    client.on('error', function (err) {
      console.log('received error from client:', client.id)
      console.log(err)
    });
  });

}