const Router = require('@koa/router');
const InitManager = require('@core/init')
const fs = require('fs')
const Validate = require('@middlewares/Validate');
const { success } = require('@lib/success')
const { Auth } = require('@middlewares/Auth');
const Enum = require('../../utils/Enum');

class Annotation {

  static prefix = ''

  /**
   * 注册控制器的类
   * @param { 注解标记的类名 } target 
   * @param { 注解标记方法名 } key 
   * @param {  } description 
   * @returns 
   */
  static Controller (prefix) {
    Annotation.prefix = prefix || '/'
    Annotation.router = new Router({ prefix: Annotation.prefix })
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
      throw new Error('未定义json接口文件或者在配置了Mapping注解的类上未配置Controller注解')
    }

    Annotation.checkApiDoc(apiDoc, Annotation.prefix + '/' + key)

    const url = apiDoc.url
    const method = apiDoc.method.toLowerCase()
    

    const role = Enum.role[(apiDoc.role || 'ALL')]
    
    Annotation.router[method](url, new Auth(role).m, async (ctx, next) => {
      const { params, retVo } = await new Validate().init(ctx, apiDoc)
      const data = await target[key](params, ctx, next)
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

  /**
   * 检查 开发人员定义的接口，是否缺少必填字段
   * @param { 接口文档的数据 } apiDoc 
   */
  static checkApiDoc(apiDoc, key) {
    const keys = ['url', 'method', 'title', 'params', 'ret']
    keys.map((item) => {
      if (!apiDoc.hasOwnProperty(item)) throw new Error(`定义的${key}.json文件缺少${item}`)
    })
  }
}

module.exports = {
  Controller: Annotation.Controller,
  Mapping: Annotation.Mapping
}
