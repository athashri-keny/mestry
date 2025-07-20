import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/User";
import { User } from "next-auth";


// checking the state
export async function POST(request:Request) {
    await dbConnect()


 const session = await getServerSession(authOptions) // getServerSession is used to check if the user is logged-in or not 
 const user: User = session?.user as User

 if (!session || !session.user) {
    return Response.json(
        {
            success: false,
            message: "Your are not logged in"
        },
        {status: 401}
    )
 }  

// finding the user in database
 const userId = user._id
 const {acceptMessage} =  await request.json()

 try {
     const UpdatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { isAcceptingMessage: acceptMessage },
        { new: true }
    )

    if (!UpdatedUser) {
        return Response.json(
        {
            success: false,
            message: "Failed to update U"
        },
        {status: 501}
    )
    } 

     return Response.json(
        {
            success: true,
            message: "Message acceptance status updated sucessfully",
            UpdatedUser
        },
        {status: 200}
    )

 } catch (error) {
    console.log("Failed to update User" , error)
     return Response.json(
        {
            success: false,
            message: "Failed to update User"
        },
        {status: 501}
    )
 }

}

// checking if the user is accpeting messasge for not 
export async function GET(_request: Request) {
    await dbConnect()

 const session = await getServerSession(authOptions)
 const user: User = session?.user as User

 if (!session || !session.user) {
    return Response.json(
        {
            success: false,
            message: "Not Authenticated"
        },
        {status: 401}
    )
 }
 
  const userId = user._id

  try {
     const FoundUser = await UserModel.findById(userId)
      if (!FoundUser) {
          return Response.json(
          {
              success: false,
              message: "User Not Found"
          },
          {status: 501}
      )
      } 
      return Response.json(
          {
              success: true,
             isAcceptingMessage: FoundUser.isAcceptingMessage
          },
          {status: 200}
      )
      
  } catch (error) {

     console.log("Failed To check user status to accept messages" , error)

    return Response.json(
        {
            success: false,
            message: "Error while getting status"
        },
        {status: 501}
    )
  }
}
