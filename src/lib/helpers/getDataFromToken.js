import jwt from "jsonwebtoken";

export const getDataFromToken = (request) => {
  try {
    const tokenCookies = request.cookies.get("token")?.value;
    const authHeader = request.headers.get("authorization");

    const token = tokenCookies ?? authHeader?.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    return decodedToken.id;
  } catch (error) {
    return;
  }
};
