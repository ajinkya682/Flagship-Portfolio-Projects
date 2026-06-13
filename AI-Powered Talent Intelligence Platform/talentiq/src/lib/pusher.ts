import Pusher from 'pusher'

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID || 'local',
  key: process.env.PUSHER_KEY || 'local',
  secret: process.env.PUSHER_SECRET || 'local',
  cluster: process.env.PUSHER_CLUSTER || 'mt1',
  useTLS: true,
})
