import { NextResponse } from "next/server";

export default function middleware(req) {
  const { origin, pathname } = req.nextUrl;
  const verify = req.cookies.get("userInfoAuthenticateDetective");

  // Parse the JSON string stored in the `value` property
  const userInfo = verify ? JSON.parse(verify.value) : null;
  const role = userInfo?.apiRole;

  // Protect specific pages based on user roles
  if (!userInfo) {
    // If user is not logged in, allow access to all pages except protected ones
    if (
      pathname === "/update-password" ||
      pathname === "/user-edit" ||
      pathname === "/edit-profile" ||
      pathname === "/profile" ||
      pathname === "/update-profile" ||
      pathname === "/add-business"
    ) {
      return NextResponse.redirect(new URL("/login", origin));
    }
    return NextResponse.next();
  }

  // Role-based protection for "user"
  if (
    (role === "user" &&
      (pathname === "/update-password" ||
        pathname === "/user-edit" ||
        pathname === "/profile")) ||
    pathname === "/update-profile" ||
    pathname === "/add-business"
  ) {
    return NextResponse.next(); // Allow "user" role to access protected pages
  }

  // Role-based protection for "business-user"
  if (
    (role === "business-user" &&
      (pathname === "/update-password" ||
        pathname === "/edit-profile" ||
        pathname === "/profile")) ||
    pathname === "/update-profile" ||
    pathname === "/add-business"
  ) {
    return NextResponse.next(); // Allow "business-user" role to access protected pages
  }

  // Redirect to login if trying to access protected pages without proper role
  if (
    ((pathname === "/update-password" ||
      pathname === "/user-edit" ||
      pathname === "/update-profile" ||
      pathname === "/profile") &&
      role !== "user") ||
    ((pathname === "/update-password" ||
      pathname === "/edit-profile" ||
      pathname === "/update-profile" ||
      pathname === "/profile") &&
      role !== "business-user")
  ) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  // Allow access to all other pages
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico|_next/image).*)"],
};
