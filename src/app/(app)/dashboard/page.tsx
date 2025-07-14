"use client"

import MessageCard from '@/components/MessageCard'
import { Message } from '@/Model/User'
import { AcceptMEssageSchema } from '@/Schemas/AcceptMessageSchema'
import { ApiResponse } from '@/Types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import { Separator } from '@radix-ui/react-separator'
import { Switch } from '@radix-ui/react-switch'
import { Button } from '@react-email/components'
import axios, {AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'


function dashboard() {
  const [messages , setmessages]  = useState<Message[]>([]) // using MessageSchema  
  const [isloading , setIsloading] = useState(false)
  const [isSwitchLoading , setSwitchLoading] = useState(false)
  
  // handling Optimistic ui 
  const HandleDeleteMessage = (messageId: string) => {
    setmessages(messages.filter((messsage) => messsage._id !== messageId)) // removing
  }

  const {data: session} = useSession()

  const form = useForm({
    resolver: zodResolver(AcceptMEssageSchema)
  })


  const {register , watch , setValue} = form;

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async () => {
    setSwitchLoading(true)

    try {
    const response =  await axios.get('/api/accept-messages' , {
      withCredentials: true
    })
    setValue('acceptMessages' , response.data.isAcceptingMessage)

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
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
    withCredentials: true
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
} , [session , setValue , fetchAcceptMessage , fetchMessages])



// handle switch change
const handleSwitchChangee = async () => {
  try {
    const response = await axios.post('/api/accept-messages', {
      acceptMessages: !acceptMessages,
    });

    setValue('acceptMessages', !acceptMessages);
  } catch (error) {
    toast.error("Error ")
    console.error(error); 
  }
};

 const username = session?.user as User | undefined

 // todo more research on this 
 const baseUrl = `${window.location.protocol}//${window.location.host}` // copying the username 
 const profileUrl = `${baseUrl}/u/${username}` // adding user username to it 

  
 const copyToClipboard = () => {
  navigator.clipboard.writeText(profileUrl)
  toast.success("Copied to clipboard successfully")
 }


if (!session || !session.user) {
  return <div>Please Login </div>
}


   return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChangee}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index ) => (
            <MessageCard
              message={message}
              onMessageDelete={HandleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default dashboard
