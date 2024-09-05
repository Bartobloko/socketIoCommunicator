const { Server } = require('socket.io');

const io = new Server({
    cors: {
        origin: '*',
    }
});

const users = [];
const rooms = [];

io.on("connection", socket => {
    
    socket.on("send-message", (messageData) => {
        const { roomName, message, sender } = messageData;

        const room = rooms.find(r => r.roomName === roomName);

        if (room) {
            room.messages.push({ sender, message });

            socket.to(roomName).emit('newMessage', { sender, message });
        }
    });

    socket.on('addUser', user => {
        const userExists = users.some(u => u.username === user.username); 
        if (userExists) {
            socket.emit('userExists', 'User with this name already exists');
        } else {
            users.push({ ...user, socketId: socket.id }); 
            socket.emit('userCreated', 'User created successfully');
            socket.broadcast.emit('userList', users);
        }
    });

    socket.on('downloadUsers', () => {
        socket.emit('userList', users);
    });

    socket.on('createRoom', roomInfo => {
        let userToInv = roomInfo.invitedUser; 
        let userCreating = roomInfo.loginData; 

        const invitedUser = users.find(u => u.username === userToInv);

        if (invitedUser) {       
            const sortedUsers = [userCreating, userToInv].sort(); 
            const roomName = `room-${sortedUsers[0]}-${sortedUsers[1]}`;
            socket.join(roomName);

            let room = rooms.find(r => r.roomName === roomName);
            if (!room) {
                room = {
                    roomName: roomName,
                    participants: [userCreating, userToInv],
                    messages: [] 
                };
                rooms.push(room);
            }

            io.to(invitedUser.socketId).emit('invitedToRoom', { roomName, inviter: userCreating });
            io.emit('rooms', rooms);
         } else {
            socket.emit('error', 'Invited user not found');
        }
    });

    socket.on('joinRoom', roomToJoin => {
        socket.join(roomToJoin.roomName);
        const room = rooms.find(r => r.roomName === roomToJoin.roomName);
        if (room) {
            socket.emit('roomInfo', room);
        }
    });
});

io.listen(3000);
