const requireDirectory = require('require-directory')
const Router = require('@koa/router')
const config = require(`${process.cwd()}/config`)

class InitManager {
  static init(app) {
    InitManager.app = app
    InitManager.initLoadRouters()
    InitManager.loadConfig()
  }

  static loadConfig() {
    global.config = config
  }

  static initLoadRouters() {
    //path config
    const apiDirectory = `${process.cwd()}/app/controller`
    requireDirectory(module, apiDirectory, {
      visit: (router) => {
        if(router instanceof Router ){
          InitManager.app.use(router.routes())
          InitManager.app.use(router.allowedMethods())
        }
      }
    })
  }
}

module.exports = InitManager