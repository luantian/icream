const path = require('path');
const log4js = require('koa-log4');

log4js.configure({
  appenders: {
    application: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log', //生成文件的规则
      filename: path.join('logs/', 'application.log')  //生成文件名
    },
    http: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log', //生成文件的规则
      filename: path.join('logs/', 'http.log')  //生成文件名
    },
    console: {
      type: 'console'
    }
  },
  categories: {
    default: { appenders: [ 'console' ], level: 'info' },
    application: { appenders: [ 'application' ], level: 'WARN'},
    http: { appenders: [ 'http' ], level: 'WARN'},
  }
})

const appLogger = log4js.getLogger('application')  // 记录所有应用级别的日志
const httpLogger = log4js.getLogger('http')  // 记录所有应用级别的日志

module.exports = { appLogger, httpLogger }