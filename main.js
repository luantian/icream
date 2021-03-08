require('module-alias/register')

const Koa = require('koa')
const path = require('path')
const koaBody = require('koa-body')
const static = require('koa-static')
const InitManager = require('./core/init')
const catchError = require('./middlewares/exception')

const app = new Koa()

app.use(catchError)
app.use(koaBody())
app.use(static(path.join(__dirname, './static')))

InitManager.init(app)

app.listen(3000); 