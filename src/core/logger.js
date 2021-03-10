const path = require('path');
const log4js = require('koa-log4');

log4js.configure({
  appenders: {
    application: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log', //生成文件的规则
      filename: path.join('logs/', 'application.log')  //生成文件名
    },
    out: {
      type: 'console'
    }
  },
  categories: {
    default: { appenders: [ 'out' ], level: 'info' },
    application: { appenders: [ 'application' ], level: 'WARN'}
  }
})

const logger = log4js.getLogger('application')  //记录所有应用级别的日志

module.exports = { logger }