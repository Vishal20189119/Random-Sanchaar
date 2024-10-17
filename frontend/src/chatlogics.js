import io from 'socket.io-client'
let url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
export const socket = io(url);
