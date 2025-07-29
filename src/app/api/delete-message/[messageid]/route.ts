import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/User";
import { User } from "next-auth";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { messageid: string } } // Fixed type declaration
) {
  const messageId = params.messageid;
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "You are not logged in" },
      { status: 401 }
    );
  }

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 } // Changed to 404 Not Found
      );
    }
    
    return Response.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      { success: false, message: "Error deleting message" },
      { status: 500 } // Changed to 500 Internal Server Error
    );
  }
}