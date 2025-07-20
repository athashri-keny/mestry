"use client"

import MessageCard from '@/components/MessageCard'
import { Message } from '@/Model/User'
import { AcceptMEssageSchema } from '@/Schemas/AcceptMessageSchema'
import { ApiResponse } from '@/Types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import { Separator } from '@radix-ui/react-separator'
import { Switch } from '@/components/ui/switch'
import { Button } from '@react-email/components'
import axios, {AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'


function dashboard() {
  const [messages , setmessages]  = useState<Message[]>([]) // using MessageSchema  
  const [isloading , setIsloading] = useState(false)
  const [isSwitchLoading , setSwitchLoading] = useState(false)
  const router = useRouter()
  
  // handling Optimistic ui 
  const HandleDeleteMessage = (messageId: string) => {
    setmessages(messages.filter((messsage) => messsage._id !== messageId)) // removing
    
  }

  const {data: session} = useSession()


  const form = useForm({
    resolver: zodResolver(AcceptMEssageSchema)
  })


  const {register , watch , setValue} = form;

  const acceptMessage = watch('acceptMessages')


  const fetchAcceptMessage = useCallback(async () => {
    setSwitchLoading(true)

    try {
    const response =  await axios.get('/api/accept-messages'
      )
    setValue('acceptMessages' , response.data.isAcceptingMessage)
    console.log(response)
    } catch (error) {
      console.log("Error while checking the state ")
      toast.error("Error while checking state")
    }
    finally{
      setSwitchLoading(false)
    }
  } , [setValue])



const fetchMessages = useCallback(async(refresh: boolean = false) => {
setIsloading(true)
 setSwitchLoading(true) // kaam kar rahe hai

 try {

   const response =  await axios.get('/api/get-messages' , {
    withCredentials: true,

   })

setmessages(response.data.messages || [])
   if (refresh) {
    toast.success("Showing lastest  messages")
   }
 } catch (error) {
  console.log("Error while Fetching the message")

 } finally {
  setIsloading(false)
  setSwitchLoading(true)
 }
} , [setIsloading , setmessages])



useEffect(() => {
 if (!session || !session.user)  return
 fetchMessages()
 fetchAcceptMessage() // checking state
} , [session , setValue , fetchAcceptMessage , fetchMessages ])



// handle switch change
const handleSwitchChangee = async () => {
  try {
    const response = await axios.post('/api/accept-messages', {
      acceptMessage: !acceptMessage,
    });
    console.log(response , "State checked sucessfully")

    setValue('acceptMessages', !acceptMessage);
  } catch (error) {
    toast.error("Error ")
    console.error(error); 
  }
};

 const username = session?.user as User | undefined


 // todo more research on this 
 const baseUrl = `${window.location.protocol}//${window.location.host}` // copying the username 
 const profileUrl = `${baseUrl}/u/${username?.username}` // adding user username to it 

  
 const copyToClipboard = () => {
  navigator.clipboard.writeText(profileUrl)
  toast.success("Copied to clipboard successfully")
 }




if (!session || !session.user) {
  return <div>Please Login </div>
}
return (
  <div className="my-10 px-4 md:px-10 lg:px-20 py-8 bg-gradient-to-br from-blue-950 to-blue-900 rounded-2xl shadow-xl max-w-6xl mx-auto text-white">
    <h1 className="text-4xl font-bold mb-8 text-center">📬 User Dashboard</h1>

    {/* Unique Profile Link */}
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3">Copy Your Unique Link</h2>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          value={profileUrl}
          disabled
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button
          onClick={copyToClipboard}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          Copy
        </Button>
      </div>
    </div>

    {/* Accept Messages Switch */}
    <div className="mb-8 flex items-center gap-4">
      <Switch
        {...register('acceptMessages')}
        checked={acceptMessage}
        onCheckedChange={handleSwitchChangee}
        disabled={isSwitchLoading}
      />
      <span className="text-lg">
        Accept Messages: <strong>{acceptMessage ? 'On ✅' : 'Off ❌'}</strong>
      </span>
    </div>

    <Separator className="bg-gray-500 h-px my-6" />

    {/* Refresh Button */}
    <div className="mb-6 text-center">
      <Button
        className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isloading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <RefreshCcw className="h-4 w-4" />
            Refresh Messages
          </>
        )}
      </Button>
    </div>

    {/* Message Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {messages.length > 0 ? (
        messages.map((message) => (
          <MessageCard
            key={message._id as React.Key}
            message={message}
            onMessageDelete={HandleDeleteMessage}
          />
        ))
      ) : (
        <p className="text-center text-gray-300 text-lg">
          No messages to display.
        </p>
      )}
    </div>
  </div>
);

}

export default dashboard
