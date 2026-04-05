/* eslint-disable */
import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req
  
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = ["/", "/catalog", "/categories", "/about", "/products", "/contact"].some(path => 
    nextUrl.pathname === path || nextUrl.pathname.startsWith(path + "/")
  )
  const isAuthRoute = nextUrl.pathname.startsWith("/auth")
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isPublicApi = (nextUrl.pathname.startsWith("/api/products") || nextUrl.pathname.startsWith("/api/categories")) && req.method === "GET"

  if (isApiAuthRoute) return undefined

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/", nextUrl))
    }
    return undefined
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/auth/login", nextUrl))
    }
    const role = (req.auth?.user as any)?.role
    if (role !== "ADMIN") {
      return Response.redirect(new URL("/", nextUrl))
    }
    return undefined
  }

  if (!isLoggedIn && !isPublicRoute && !isPublicApi) {
    // Return JSON error for API routes instead of redirecting to the login page
    if (nextUrl.pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }
    return Response.redirect(new URL("/auth/login", nextUrl))
  }

  return undefined
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
