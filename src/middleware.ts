import { NextRequest ,  NextResponse } from 'next/server'
export {default} from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'


// this is used for 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

const token  = await getToken({req: request}) // getting the token 
const url = new URL(request.url); // current url 

// if token is there then the user can go in these pages
 if (token && 
    (
        url.pathname.startsWith('/sign-in') || 
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') || 
        url.pathname.startsWith('/')
    )
 ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
 }
 // if token is not there and user tries to access dashboard it redirects to sign-in
 if (!token && url.pathname.startsWith('/dashboard')) {
   return NextResponse.redirect(new URL ('/sign-in' , request.url))
 }
   return NextResponse.next()
}
 
// this is for where to run middleware 
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
]
}