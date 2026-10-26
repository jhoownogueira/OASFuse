import { NextRequest, NextResponse } from "next/server";

const MAX_BODY_BYTES = 4 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES)
    return NextResponse.json(
      {
        code: "PAYLOAD_TOO_LARGE",
        message: "Comparison payload exceeds 4 MiB.",
      },
      { status: 413 },
    );
  const upstream = process.env.INTERNAL_API_URL ?? "http://localhost:8080";
  try {
    const body = await request.text();
    if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES)
      return NextResponse.json(
        {
          code: "PAYLOAD_TOO_LARGE",
          message: "Comparison payload exceeds 4 MiB.",
        },
        { status: 413 },
      );
    const response = await fetch(`${upstream}/v1/comparisons`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": crypto.randomUUID(),
      },
      body,
      signal: AbortSignal.timeout(12_000),
      cache: "no-store",
    });
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      {
        code: "UPSTREAM_UNAVAILABLE",
        message: "The comparison service is unavailable.",
      },
      { status: 503 },
    );
  }
}
