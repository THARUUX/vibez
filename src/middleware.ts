/* eslint-disable */
import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req
  
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = ["/", "/products", "/categories", "/about"].includes(nextUrl.pathname) || nextUrl.pathname.startsWith("/products/")
  const isAuthRoute = nextUrl.pathname.startsWith("/auth")
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")

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

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl))
  }

  return undefined
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
