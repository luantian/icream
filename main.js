require('module-alias/register')
require('@babel/register')

const Koa = require('koa')
const path = require('path')
const koaBody = require('koa-body')
const static = require('koa-static')
const InitManager = require('@core/init')
const catchError = require('@exception')

const app = new Koa()

app.use(catchError)
app.use(koaBody())
app.use(static(path.join(__dirname, './src/static')))


InitManager.init(app)


app.listen(3000);