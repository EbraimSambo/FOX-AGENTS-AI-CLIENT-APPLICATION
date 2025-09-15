import { generateUUID } from "@/helpers/generate-uuid";
import { cookies } from "next/headers";

export async function setCookieTemporary() {
  const uuid = generateUUID();
  const cookie = await cookies();
  cookie.set("user", uuid, {
    path: "/",
    httpOnly: true,
    secure: true,
    maxAge: 3600,
  });
}
