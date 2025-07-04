import {z} from 'zod'


// for checking username validation
export const usernameValidation = z
.string()
.min(2, "Username must be aleast 2 characters long")
.max(20 , "Must be Be no More than 20 characters")
.regex( /^[a-zA-Z0-9_]+$/ , "Username Must not contain special Charactor")


// for checking  signup vaildation
 export const signUpSchema = z.object({
   username: usernameValidation,
   email: z.string().email({message: "Invaild Email address"}),
   password: z.string().min(6 , {message: "Password must be at least 6 charactors"})
 })

