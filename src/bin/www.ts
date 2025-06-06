#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app'; // Will resolve to app.ts
import debugLib from 'debug';
import http from 'http';

const debug = debugLib('mock-api:server');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3006');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server: http.Server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): number | string | boolean {
  const portNumber: number = parseInt(val, 10);

  if (isNaN(portNumber)) {
    // named pipe
    return val;
  }

  if (portNumber >= 0) {
    // port number
    return portNumber;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind: string = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(): void {
  const addr = server.address();
  let bind: string;
  if (typeof addr === 'string') {
    bind = 'pipe ' + addr;
  } else if (addr) {
    bind = 'port ' + addr.port;
  } else {
    bind = 'an unknown address'; // Should not happen in normal circumstances
  }
  debug('Listening on ' + bind);
}
