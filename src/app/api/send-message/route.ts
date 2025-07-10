import UserModel from "@/Model/User";
import { Message } from "@/Model/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(request:Request) {

 await dbConnect()
 
  const {username , content} = await request.json()

try {
   const user = await UserModel.findOne({username})
   if (!user) {
      return Response.json(
        {
            success: false,
            message: "User not Found"
        },
        {status: 404}
    )
   }

   // is user accepting the messages
   if (!user.isAcceptingMessage) {
      return Response.json(
        {
            success: false,
            message: "User is not accpeting the messages"
        },
        {status: 401}
    )
   }
  const newMessage = {content , createdAt: new Date()}

  user.messages.push(newMessage as Message)

  await user.save()

  return  Response.json(
        {
            success: true,
            message: "message send sucessfully"
        },
        {status: 201}
    )

} catch (error) {
      return Response.json(
        {
            success: false,
            message: "Internal server error"
        },
        {status: 401}
    )
}


}