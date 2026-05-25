import jwt from "jsonwebtoken";

export const getCustomerFromToken = (request) => {
  try {
    const token =
      request.cookies.get("customer-token")?.value ||
      request.headers.get("authorization")?.split(" ")[1];

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET, {
      algorithms: ["RS256"],
    });

    return decoded; // { id, username, bankSampah, role: "customer" }
  } catch {
    return null;
  }
};
