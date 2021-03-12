const Router = require('@koa/router');
const InitManager = require('@core/init')
const fs = require('fs')
const Validate = require('@middlewares/Validate');
const { success } = require('@lib/success')

class Annotation {

  static prefix = '/'

  /**
   * 注册控制器的类
   * @param { 注解标记的类名 } target 
   * @param { 注解标记方法名 } key 
   * @param {  } description 
   * @returns 
   */
  static Controller (prefix) {
    Annotation.router = new Router({ prefix })
    Annotation.prefix = prefix
    return (target, key, description) => {
      return description
    }
  }

  /**
   * 注册路由 默认加载 与 控制器方法名称相同的json文件
   * @param { 注解标记的类名 } target 
   * @param { 注解标记方法名 } key 
   * @param {  } description 
   * @returns 
   */
  static Mapping (target, key, description) {

    let apiDoc 
    try {
      apiDoc = Annotation.readFile(Annotation.prefix + '/' + key)
    } catch (error) {
      throw error
    }

    const url = apiDoc.url
    const method = apiDoc.method.toLowerCase()

    Annotation.router[method](url, async (ctx) => {
      const { params, retVo } = await new Validate().init(ctx, apiDoc)
      const data = await target[key](params, ctx)
      success(data, retVo)
    })

    InitManager.loadRouter(Annotation.router)

    return description
  }

  static readFile(pathname) {
    const apiDocPath = global.config.apiDocPath || '/static/doc'
    const apiPath = `${process.cwd()}${apiDocPath}${pathname}.json`
    return JSON.parse(fs.readFileSync(apiPath))
  }
}

module.exports = {
  Controller: Annotation.Controller,
  Mapping: Annotation.Mapping
}
