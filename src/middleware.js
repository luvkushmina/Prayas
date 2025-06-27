import { NextResponse } from "next/server";

export const config = {
  matcher: "/integrations/:path*",
};

export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-createxyz-project-id", "4d1bfe3f-228a-44e3-997d-aa7d3d5c3341");
  requestHeaders.set("x-createxyz-project-group-id", "285674fa-8f34-436c-a123-ca6c4f01f4aa");


  request.nextUrl.href = `https://www.create.xyz/${request.nextUrl.pathname}`;

  return NextResponse.rewrite(request.nextUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}