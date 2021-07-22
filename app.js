/* eslint-disable import/extensions */
import Koa from 'koa';
import cors from '@koa/cors';
import serve from 'koa-static';
import path from 'path';

import submitRouter from './routes/submit.js';

const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf('/'));

const app = new Koa();

app
  .use(
    cors({
      origin: '*',
      methods: 'GET, POST, PUT',
      allowedHeaders: '*',
      exposedHeaders: '*',
    }),
  )
  .use(serve(path.join(__dirname, '/client/public')))
  .use(submitRouter.routes())
  .use(submitRouter.allowedMethods());

app.listen(3000, () =>
  console.log(`Koa is listening to http://localhost:3000`),
);

export default app;
