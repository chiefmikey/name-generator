import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import path from 'node:path';

import submitRouter from './routes/submit.js';
import './db/mongo/index.js';
// import './db/cassandra/index.js';

const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf('/'));

const app = new Koa();

app
  .use(
    cors({
      origin: '*',
      methods: 'GET, POST',
      allowedHeaders: '*',
      exposedHeaders: '*',
    }),
  )
  .use(bodyParser())
  .use(serve(path.join(__dirname, '/client/public')))
  .use(submitRouter.routes())
  .use(submitRouter.allowedMethods());

app.listen(3001, () =>
  console.log(`Koa is listening to http://localhost:3001`),
);

export default app;
