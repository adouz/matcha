var socketio = require('socket.io');
var messages = require('./controlers/messagescontroler');
var notification = require('./controlers/notification');
var userscontroller = require('./controlers/userscontroler');
const socketioJwt = require('socketio-jwt');
const jwt = require('jsonwebtoken');
var users = {};


function validmsg(data) {
  if (data.room && data.from && data.msg){
    if (!String(data.room).match(/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/g)){
      //console.log('ROOM name is inncorect');
      return false;
    }
    if (!String(data.from).match(/^[a-z]+([_-]?[a-z0-9])*$/g) || data.from.length > 50){
      //console.log('username name is inncorect');
      return false;
    }
    if (!String(data.msg).match(/.*\S.*/) || data.msg.length > 300){
      //console.log('msg is empty or is more than 300 charcters');
      return false;  
    }
  }else return false;
  return true;
}

exports.listen = (server) => {
  io = socketio().listen(server, {
    pingTimeout: 60000
  });

  io.use(socketioJwt.authorize({
    secret: appSecret,
    handshake: true
  }));

  io.on('connection', (client) => {
    //console.log('New user');

    // new user is connected
    client.on('new user', function (data) {
      //console.log('new user :: -------- ' + data.username);
      var username = data.username;
      if (username) {
        if (users[username]) {
          if (!users[username].includes(client)) // protect form socket duplicate
            users[username].push(client);
        }
        else {
          users[username] = [];
          users[username].push(client);
        }
      }
      // Online
      client.on('Online', (data) => {
        var username = data.username;
        //console.log('is online ' + username);
        setInterval(() => {
          if (users[username]) {
            client.emit('isOnline' + username, { online: true });
          } else {
            // get last connection
            let last = userscontroller.Getlastconnection(username);
            last.then((res) => {
              client.emit('isOnline' + username, { online: false, last: res });
            })
          }
        }, 1000);

      });
    });
    // notification
    client.on('notifyUser', (data) => {
      if (users[data.to]) {
        users[data.to].forEach(user_socket => {
          user_socket.emit('notification', { title: data.title, msg: data.msg });
        });
      }
      notification.addNotification({ user: data.to, msg: data.msg, title: data.title });
    });
    //block
    client.on('deleteroom', (data) => {
      var blocked = data.blocked;
      var blocker = data.blocker;
      if (users[blocked]) {
        users[blocked].forEach(user_socket => {
          user_socket.emit("deleteroom", {
            blocked: blocked,
            blocker: blocker
          });
        });
      }
      if (users[blocker]) {
        users[blocker].forEach(user_socket => {
          user_socket.emit("deleteroom", {
            blocked: blocked,
            blocker: blocker
          });
        });
      }
    });

    // logout
    client.on('logout', (data) => {
      var username = data.username;
      delete users[username];
      // send to date to database of last connection
      //console.log(username, ' is offline :: logout');
      if (username)
        userscontroller.Addlastconnection(username);
    });
    client.on('disconnect', function () {
      //console.log('client disconnect... xxx', client.id)
      for (const [key, value] of Object.entries(users)) {
        if (value.includes(client)) {
          value.splice(value.indexOf(client), 1);
          if (!value.length) {
            delete users[key];
            // send to date to database of last connection
            //console.log(key, ' is offline :: disconnnect');
            if(username)
              userscontroller.Addlastconnection(username);
          }
          //console.log(key, 'disconnected');
        }
      }
      //console.log(users);
    });
  });

  io.of("/messages").on('connection', (client) => {
    // jwt middleware for every new packet
    client.use((packet, next) => {
      if (packet[1] && packet[1].token) {
        jwt.verify(packet[1].token, appSecret, (err, decoded) => {
          if (err) return next(new Error('Authentication error'));
          packet.decoded = decoded;
          next();
        });
      } else {
        next(new Error('Authentication error'));
      }
    });

    client.on('room message', function (data) {
      // message length
      if (validmsg(data)) {
        if (data.msg.length <= 300) {
          messages.getRoom(data.room).then(res => {
            if (res[0]) {
              // checking user if is in the room before sending msg
              if (res[0].matcher === data.from || res[0].matched === data.from) {
                io.of("/messages").to(data.room).emit('message from room', { msg: data.msg, from: data.from, room: data.room });
                // send to controller
                messages.addMessage({ from: data.from, to: data.to, msg: data.msg, room: data.room });
                //send notification
                if (users[data.to]) {
                  users[data.to].forEach(user_socket => {
                    user_socket.emit('notification', { title: 'new message from ' + data.from, msg: '"' + data.msg + '"' });
                  });
                  notification.addNotification({ user: data.to, msg: data.msg, title: 'new message from ' + data.from });
                }
              }
            }
          },
            err => {
              //console.log(err);
            });
        }//else console.log('message too long');
      }
    })

    client.on('joinroom', function (data) {
      var room = data.room;
      client.join(room);
    })


    client.on('typing', function (data) {
      io.of("/messages").to(data.room).emit('typing', data.from);
    });

    client.on('stopTyping', function (data) {
      io.of("/messages").to(data.room).emit('stopTyping', data.from);
    });

    client.on('disconnect', function () {
      //console.log('client disconnect...', client.id)
    });

    client.on('error', function (err) {
      //console.log('received error from client:', client.id)
      //console.log(err)
    });
  });

}