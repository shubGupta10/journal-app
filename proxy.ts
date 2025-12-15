import {NextResponse, NextRequest} from "next/server";

export default function proxy(request: NextRequest) {
    const {nextUrl} = request;
    const path = nextUrl.pathname;

    const publicRoutes = path === "/" || path.startsWith("/auth/login") || path.startsWith("/auth/signUp");

    const sessionCookie = request.cookies.get("better-auth.session_token") || request.cookies.get("__Secure-better-auth.session_token");

    if(!publicRoutes && !sessionCookie){
        return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }

    if(publicRoutes && sessionCookie && (path.startsWith("/auth/login") || path.startsWith("/auth/signUp"))){
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};