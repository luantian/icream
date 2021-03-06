const Koa = require('koa');
const app = new Koa();

const router = require('koa-router')()

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);