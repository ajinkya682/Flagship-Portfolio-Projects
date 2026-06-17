import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import connectToDatabase from '@/core/database/mongoose';
import { Message } from '@/core/database/models/Message';
import { Candidate } from '@/core/database/models/Candidate';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function SocketHandler(req: NextApiRequest, res: any) {
  if (!res.socket.server.io) {
    console.log('New Socket.io server initializing...');
    
    // Connect to database to save messages
    await connectToDatabase();

    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: '/api/socket/io',
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('join_room', (candidateId: string) => {
        socket.join(candidateId);
        console.log(`Socket ${socket.id} joined room ${candidateId}`);
      });

      socket.on('leave_room', (candidateId: string) => {
        socket.leave(candidateId);
        console.log(`Socket ${socket.id} left room ${candidateId}`);
      });

      socket.on('send_message', async (data: { candidateId: string; senderId: string; text: string; time: string }) => {
        try {
          const candidate = await Candidate.findById(data.candidateId);
          if (candidate && candidate.isBlocked) {
            console.log(`Message rejected: Candidate ${data.candidateId} is blocked`);
            return;
          }

          // Save message to MongoDB
          const newMessage = await Message.create({
            candidateId: data.candidateId,
            senderId: data.senderId,
            text: data.text,
            time: data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });

          const messagePayload = {
            id: newMessage._id.toString(),
            candidateId: newMessage.candidateId,
            senderId: newMessage.senderId,
            text: newMessage.text,
            time: newMessage.time,
            createdAt: newMessage.createdAt,
          };

          if (data.senderId === 'candidate' && candidate) {
            const { Notification } = await import('@/core/database/models/Notification');
            const notif = await Notification.create({
              recipientUserId: 'all',
              type: 'candidate_message',
              title: 'New Message',
              message: `${candidate.name} sent you a message: "${data.text.substring(0, 50)}${data.text.length > 50 ? '...' : ''}"`,
              candidateId: candidate._id,
              linkHref: `/messages?candidateId=${candidate._id}`,
            });
            io.emit('new_notification', notif);
          }

          // Broadcast to the candidate-specific room (for detail view chat)
          io.to(data.candidateId).emit('receive_message', messagePayload);

          // Also broadcast globally so the /messages page sidebar can update in real-time
          io.emit('receive_message_global', messagePayload);
        } catch (error) {
          console.error('Error saving message:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  }
  
  // If it's just an awakening fetch from the client (no Socket.io query params)
  if (!req.query.EIO) {
    res.status(200).send('Socket server awoken');
    return;
  }
  
  // Important: Let Socket.io handle the actual polling/websocket requests
  // Do not call res.end() here unconditionally for Engine.IO requests.
}
