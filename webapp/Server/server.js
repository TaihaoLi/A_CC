const http =require('http');
const app =require('./app');
const LOGGER=require('./logger/logger');
const port =3000;

const server =http.createServer(app);

server.listen (port, () => {
    console.log('Server started on port 3000');
    LOGGER.info('Application has been deployed successfully')

});