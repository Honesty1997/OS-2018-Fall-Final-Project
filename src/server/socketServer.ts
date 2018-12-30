import socketServer from 'socket.io';
import http from 'http';

const ioOptions = {
  serveClient: false,
  path: '/channel',
};

const IOServer = (server: http.Server) => socketServer(server, ioOptions);

export default IOServer;
