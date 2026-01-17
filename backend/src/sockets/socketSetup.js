const jwt = require ('jsonwebtoken');
const config = require ('../config/config');

const {Conversations} = require ('../models/Conversations');
const {Messages} = require ('../models/Messages');


function setupSocket (io)
{
    const convModel = new Conversations();
    const msgModel = new Messages();
    
    io.use ((socket, next) => {
        try
        {
            const token = socket.handshake.auth?.token;

            if (!token)
            {
                return next (new Error ('token missing'));
            }

            const decoded = jwt.verify (token, config.jwt_secret);
            socket.user = decoded;
            next ();
        }
        catch (err)
        {
            next (new Error ('invalid or expired token'));
        }
    });

    io.on ("connection", (socket) =>
    {
        console.log('User connected:', socket.user.username, socket.id);

        socket.on ("conversation:join", async ({conversationId})  => {
            if (!conversationId) return;
            const ok = await convModel.isParticipant (conversationId, socket.user.id);
            if (!ok) return;
            socket.join (`conversation_${conversationId}`);
        });

        socket.on ("message:send", async ({conversationId, content}) => {
            if (!conversationId || !content) return;

        const ok = await convModel.isParticipant(conversationId, socket.user.id);
        if (!ok) return;

        const created = await  msgModel.createMessage (conversationId, socket.user.id, content);
         const full = await msgModel.getMessageById (created.insertId);

         io.to(`conversation_${conversationId}`).emit("message:new", full);

        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.user.username);
        });
    });
    

}
module.exports = {setupSocket};