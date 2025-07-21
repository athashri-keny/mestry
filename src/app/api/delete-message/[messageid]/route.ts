import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/User";
import { User } from "next-auth";
import { NextRequest } from "next/server";

export async function DELETE(_request:NextRequest , {params}: {params: {messageid: string}}) {
  const messageId =  params.messageid
   
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

 try {
   const updatedResult =  await UserModel.updateOne(
        {_id: user._id},
        {$pull: {messages: {_id: messageId}}}
    )

    if (updatedResult.modifiedCount == 0) {
          return Response.json(
        {
            success: false,
            message: "Message Not found or already deleted"
        },
        {status: 401}
    )
    }
      return Response.json(
        {
            success: true,
            message: "Message Deleted Sucessfully"
        },
        {status: 200}
    )

 } catch (error) {
    console.log("Error while deleting the message" , error)
      return Response.json(
        {
            success: false,
            message: "Error In delete Message Route"
        },
        {status: 401}
    )
 }




}