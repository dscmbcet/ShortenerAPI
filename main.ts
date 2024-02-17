/*
Shortener API
GDSC MBCET
*/

import { Application, Router } from "oak";
import { createShortURL, getURL } from "./database.ts";

import config from "$env";

const router = new Router();

router.post("/api/shorten", async (ctx) => {
  const { url, hash, userName, userPass } = await ctx.request.body().value;
  if (!url || !hash || !userName || !userPass) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid request" };
    return;
  }

  // authorise
  if (userName !== config.USER_NAME || userPass !== config.USER_PASS) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Unauthorized" };
    return;
  }

  const success = await createShortURL(url, hash);
  if (!success) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Hash already exists" };
    return;
  }

  ctx.response.body = { error: null, hash };
});

router.post("/api/getURL", async (ctx) => {
  const { hash, userName, userPass } = await ctx.request.body().value;
  if (!hash || !userName || !userPass) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid request" };
    return;
  }

  // authorise
  if (userName !== config.USER_NAME || userPass !== config.USER_PASS) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Unauthorized" };
    return;
  }

  const url = await getURL(hash);
  if (!url) ctx.response.body = { error: "Not found" };
  else return (ctx.response.body = { error: null, ...url });
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("error", (e) => {
  console.log(e);
});

console.log("Listening on port 8000.");
await app.listen({ port: 8000 });
