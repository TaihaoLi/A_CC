const log4js =require('log4js');

//logger configuration
log4js.configure({
    appenders:{
        fileAppender:{
            type:'file',
            filename: './logs/csye6225.log'

        }
    },
    categories:{
        default:{
            appenders:['fileAppender'],
            level:'info'
        }
    }
});
//create the logger
const logger =log4js.getLogger();
module.exports = logger;