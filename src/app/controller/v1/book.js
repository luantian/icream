const Router = require('@koa/router')
const { success } = require("@lib/success")
const router = new Router({
  prefix: '/v1/book'
})

router.get('/name', async (ctx) => {
  success({name: '坏蛋是怎样'})
})

module.exports = router
