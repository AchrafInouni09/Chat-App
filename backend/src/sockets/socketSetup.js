const jwt = require ('jsonwebtoken');
const config = require ('../config/config');


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

            const decoded = jwt.verify (token, config.jwtSecret);
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

         io.to(`conv:${conversationId}`).emit("message:new", full);

        });
    });
    

}

module.exports = {setupSocket};