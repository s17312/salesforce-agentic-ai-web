import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get all cookies from the request
  const cookies = req.headers.cookie;
  if (cookies) {
    cookies.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      res.setHeader("Set-Cookie", `${name.trim()}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`);
    });
  }
  res.status(200).json({ message: "All cookies cleared" });
}