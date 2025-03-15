import jwt from "jsonwebtoken";

export const getDataFromToken = (request) => {
  try {
    const tokenCookies = request.cookies.get("token")?.value;
    const authHeader = request.headers.get("authorization");

    const token = tokenCookies ?? authHeader?.split(" ")[1];

    console.log({token})
    console.log({TOKEN_SECRET: process.env.TOKEN_SECRET})
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET, {
      algorithms: ['RS256'] 
    });
    return decodedToken.id;
  } catch (error) {
    return;
  }
};
