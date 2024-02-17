import { config } from "dotenv";
import { cleanEnv, str, url } from "envalid";

await config({ export: true });

export default cleanEnv(Deno.env.toObject(), {
  MONGO_URI: url(),
  USER_NAME: str(),
  USER_PASS: str(),
});
