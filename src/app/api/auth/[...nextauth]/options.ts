import  {NextAuthOptions} from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/Model/User'

// NEXT-AUTH
export const authOptions: NextAuthOptions = {
    // this provider always required a id and name as its a  syntax
    providers: [
        CredentialsProvider({
            id: "credentials", // unique identifier for this provider
            name: "Credentials", // display name 
             credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" }
    },

        // authorize checking the information is recevied correct or not 
    async authorize(credentials: any): Promise<any>{
        await  dbConnect() // IMP
        try {
            // finding the user based on email or password provided
           const user =  await UserModel.findOne({
                $or: [
                 {email: credentials.identifier},
                 {username: credentials.identifier}
                ]
            })
            // if user is not 
            if (!user) {
                throw new Error("No User found with this email")
            }
            // if user is not verified (custom field)
            if (!user.isVerified) {
                throw new Error("Please verify your first before login")
            }
            // checking the password
             const isPassowrdCorrect = await bcrypt.compare(credentials.password , user.password)
             if (isPassowrdCorrect) {
                return user

             } else {
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
        // adding custom fields
    if (user) {
        token._id = user._id?.toString()
        token.isVerified = user.isVerified
        token.isAcceptingMessages =  user.isAcceptingMessages
        token.username = user.username
    }
      return token
    },

    async session({ session,  token }) {
       if (token) {
  session.user._id = token._id;
  session.user.isVerified = token.isVerified;
  session.user.username = token.username;
}
      return session
    },
    },
    pages: {
        signIn: '/sign-in', // overide pages    
    },
    session: {
        strategy: "jwt"
    },
   secret: process.env.NEXTAUTH_SECRET

}
