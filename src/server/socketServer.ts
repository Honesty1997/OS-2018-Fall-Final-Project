import Server from 'socket.io';

const ioOptions = {
  serveClient: false,
  path: '/channel',
};

const IOServer = (server)  => Server(server, ioOptions);

export default IOServer;
