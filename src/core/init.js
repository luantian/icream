const requireDirectory = require('require-directory')
const Router = require('@koa/router')
const config = require('@config')

const { shellLogo1, version } = require('@utils/shellLogo')

class InitManager {
  // 全局代码初始化
  static init(app) {
    InitManager.app = app
    InitManager.initLoadRouters()
    InitManager.loadConfig()
    InitManager.outputShellLog()
  }

  // 加载config，将config挂载到全局变量
  static loadConfig() {
    global.config = config
  }

  // 加载路由
  static initLoadRouters() {
    // 指定接口存放的路径
    const apiDirectory = `${process.cwd()}/src/app/controller`
    requireDirectory(module, apiDirectory, {
      visit: (router) => {
        if(router instanceof Router ){
          InitManager.app.use(router.routes())
          InitManager.app.use(router.allowedMethods())
        }
      }
    })
  }

  // 终端输出启动内容 
  static outputShellLog() {
    console.log(shellLogo1.value)
    console.log(version.color, ` :: Icream ::                 (v${version.value})\n`)
  }
}

module.exports = InitManager