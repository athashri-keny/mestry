import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/User";
import { User } from "next-auth";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest) {
    await dbConnect()

    
 const session = await getServerSession(authOptions) // getServerSession is used to check if the user is logged-in or not 
 const user: User = session?.user as User

 console.log("Session user:", session?.user); 

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
 const userId = new mongoose.Types.ObjectId(user._id) // converting 

 try {
    const user = await UserModel.aggregate([
        {$match: {_id: userId}},
        {$unwind: '$messages'},
        {$sort: {'messages.createdAt': -1}},
        {$group: {_id: '$_id' , messages: {$push: '$messages'}}}
    ])

    if (!user || user.length === 0) {
        return Response.json(
        {
            success: false,
            message: "User not Found"
        },
        {status: 401}
    )
    }
      return Response.json(
        {
            success: true,
            messages: user[0].messages
        },
        {status: 201}
    )

 } catch (error) {
    
      return Response.json(
        {
            success: false,
            message: "Failed"
        },
        {status: 401}
    )
 }


}