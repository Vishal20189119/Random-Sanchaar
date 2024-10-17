import io from 'socket.io-client'
let url = process.env.REACT_APP_BACKEND_URL || 'https://random-sanchaar-msj0.onrender.com';
export const socket = io(url);
