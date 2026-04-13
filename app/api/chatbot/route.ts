export async function GET() {
  return Response.json({
    resource: "chatbot",
    status: "scaffolded",
  });
}
