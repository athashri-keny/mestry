import  {NextAuthOptions} from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/Model/User'
import { error } from 'console'


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
             credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" }
    },

    // authorize 
    async authorize(credentials: any): Promise<any>{
        await  dbConnect()
        try {
           const user =  await UserModel.findOne({
                $or: [
                 {email: credentials.identifer},
                 {username: credentials.identifer}
                ]
            })
            if (!user) {
                throw new Error("No User found with this email")
            }
            if (!user.isVerified) {
                throw new Error("Please verify your first before login")
            }

             const isPassowrd = await bcrypt.compare(credentials.password , user.password)
             if (isPassowrd) {
                return user
             } else{
                throw new Error("Password is incorrect try again")
             }

        } catch (error:any) {
            throw new Error(error)
        }
    }
        })
    ],

    callbacks: {
    async jwt({ token, user }) {
    if (user) {
        token._id = user._id?.toString()
        token.isVerified = user.isVerified
        token.isAcceptingMessages =  user.isAcceptingMessages
        token.username = user.username
    }
      return token
    },

    async session({ session,  token }) {
        // if (token) {
        //     session.user._id = token._id
        // }
      return session
    },
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET

}
