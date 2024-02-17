import { config } from "dotenv";
import { cleanEnv, str, url } from "envalid";

await config({ export: true });

export default cleanEnv(Deno.env.toObject(), {
  MONGO_URI: url(),
  SHORTENER_USERNAME: str(),
  SHORTENER_PASSWORD: str(),
});
