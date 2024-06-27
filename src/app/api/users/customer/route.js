import { connect } from "@/app/config/dbConfig";

await connect();

export async function POST(request) {
  const reqBody = await request.json();
  console.log(reqBody);
}
