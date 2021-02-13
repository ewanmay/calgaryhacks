import Socket from 'socket.io-client'
const url = process.env.NODE_ENV === "production" ? process.env.REACT_APP_BACKEND_URL || "" : "http://localhost:5000";
export const socket: SocketIOClient.Socket = Socket(url, { transports: ["websocket", "polling", "flashsocket"]});


