import jwt from "jsonwebtoken";

// Mengembalikan payload token (id, role, dll) atau null.
export const getAuthData = (request) => {
  try {
    const tokenCookies = request.cookies.get("token")?.value;
    const authHeader = request.headers.get("authorization");
    const token = tokenCookies ?? authHeader?.split(" ")[1];

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET, {
      algorithms: ["RS256"],
    });

    return { id: decoded.id, role: decoded.role || "user", email: decoded.email };
  } catch {
    return null;
  }
};
