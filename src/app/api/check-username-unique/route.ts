import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/User";
import {z} from 'zod'
import { usernameValidation } from "@/Schemas/SignupSchema";


// qurey schema
const UsernameQureySchema = z.object({
    username: usernameValidation
})


export async function GET(request: Request) {


    await dbConnect()
    try {
        const {searchParams} = new URL(request.url) // localhost:3000/api/cuu?username=hitesh?phone=android

        const queryParam = {
            username: searchParams.get("username") // extracting username from url 
        }
        // validate with zod
     const result =  UsernameQureySchema.safeParse(queryParam) // checking if the username is unique through ZOD
     console.log(result)

     if (!result.success) {
        const usernameErrors = result.error.format().username?._errors || [] // extracting error 
        return Response.json({
            success: false,
            message: "Username must be 3 char long"
        },
        {
            status: 400
        }
    )
     }

     const {username} = result.data
    const existingVerifiedUser = await UserModel.findOne({ username , isVerified: true})

    if (existingVerifiedUser) {
        return  Response.json({
            success: false,
            message: "username is already taken"
        } , {status: 400})
    }

      return  Response.json({
            success: true,
            message: "username is Unique"
        } , {status: 200})


    } catch (error) {
        console.error("Error while checking the username " , error)
        return Response.json({
            success:false,
            message: "Error checking  username"
        },
        {status: 500}
    
    )
    }
}