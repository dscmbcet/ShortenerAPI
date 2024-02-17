/*
Shortener API
GDSC MBCET
*/

import { Application, Router } from "oak";
import { createShortURL, getURL, deleteURL } from "./database.ts";

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
  if (
    userName !== config.SHORTENER_USERNAME ||
    userPass !== config.SHORTENER_PASSWORD
  ) {
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
  const { hash, userName, userPass, userIp } = await ctx.request.body().value;

  if (!hash || !userName || !userPass || !userIp) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid request" };
    return;
  }

  // authorise
  if (
    userName !== config.SHORTENER_USERNAME ||
    userPass !== config.SHORTENER_PASSWORD
  ) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Unauthorized" };
    return;
  }

  const url = await getURL(hash, userIp);
  if (!url) ctx.response.body = { error: "Not found" };
  else return (ctx.response.body = { error: null, ...url });
});

router.post("/api/deleteURL", async (ctx) => {
  const { hash, userName, userPass } = await ctx.request.body().value;
  if (!hash || !userName || !userPass) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid request" };
    return;
  }

  // authorise
  if (
    userName !== config.SHORTENER_USERNAME ||
    userPass !== config.SHORTENER_PASSWORD
  ) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Unauthorized" };
    return;
  }

  // delete hash
  await deleteURL(hash);
  ctx.response.body = { error: null };
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("error", (e) => {
  console.log(e);
});

console.log("Listening on port 8000.");
await app.listen({ port: 8000 });
