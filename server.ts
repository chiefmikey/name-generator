import path from 'node:path';

import Koa from 'koa';
import send from 'koa-send';
import serve from 'koa-static';

const app = new Koa();
const port = 8080;

app.use(serve('public'));

app.use(async (context) => {
  if (context.status === 404) {
    await send(context, 'index.html', { root: path.resolve('./public') });
  }
});

app.listen(port, () => console.log(`Client port: ${port}`));
