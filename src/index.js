const Koa = require('koa');
const path = require('path');
const static = require('koa-static');
const Router = require('koa-router');
const _ = require('lodash');
const protobuf = require('protobufjs');
const data = require('./data');
const miniJSON = {
  code: 0,
  meg: '成功',
};

let _proto = protobuf.loadSync(
  path.resolve(__dirname, './proto/MessageType.proto')
);

const app = new Koa();
const router = new Router();

/**
 * protobuf 接口
 */
router.get('/api/protobuf', (ctx) => {
  const ResponseMessage = _proto.lookupType('framework.Response');
  const playload = data;
  const errMsg = ResponseMessage.verify(playload);
  if (errMsg) {
    throw Error(errMsg);
  }
  var message = ResponseMessage.create(playload);
  var buffer = ResponseMessage.encode(message).finish();
  ctx.body = buffer;
});


/**
 * json 接口
 */
router.get('/api/JSON', (ctx) => {
  ctx.body = data;
});

router.get('/api/miniJSON', (ctx) => {
  ctx.body = miniJSON;
});

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './static';

app.use(static(path.join(__dirname, staticPath)));

app.use(router.routes());


app.listen(3000, () => {
  console.log('server is starting at port 3000');
});
