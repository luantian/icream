const Router = require('@koa/router');
const requireDirectory = require('require-directory')
const { UserController } = require('@controller/UserController')
const { success } = require('@lib/success')
const Validate = require('@middlewares/Validate');

const prefix = '/v1/user'
const router = new Router({ prefix })

const apiDirectory = `${process.cwd()}/static/doc/`
requireDirectory(module, apiDirectory, {
  visit: (apiDoc) => {

    const url = apiDoc.url
    const method = apiDoc.method.toLowerCase()
    const staticFuncName = url.replace('/', '')

    router[method](url, async (ctx) => {
      const { params, retVo } = await new Validate().init(ctx, apiDoc)
      const data = await UserController[staticFuncName](params)
      success(data, retVo)
    })

  }
})

router.post('/test', async (ctx, next) => {

  ctx.body = ctx.request.params
})


module.exports = router
