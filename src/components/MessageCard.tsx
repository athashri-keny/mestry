'use client'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import {X} from 'lucide-react'
import { Message } from "@/Model/User"
import { toast } from "sonner"
import axios from "axios"
import { ApiResponse } from "@/Types/ApiResponse"




type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({message }: MessageCardProps) => {
  
const handleDeleleConfirm = async () => {
try {
   await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
   toast.success("Message Deleted sucessfully")
   window.location.reload()




} catch (error) {
  console.log("Error while Deleting the message", error)
  toast.error("Error while deleting the message")
}
}


  return (
   <Card>
  <CardHeader>
    <CardTitle>{message.content}</CardTitle>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"><X className="w-5 h-5"/> </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDeleleConfirm()}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </CardHeader>
  <CardContent>
  </CardContent>
</Card>
  )
}

export default MessageCard
