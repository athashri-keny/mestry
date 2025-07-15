'use client'

import React from 'react'
import { Form, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'

function SendMmessagePage() {
const params = useParams()
const username = params?.username // extracting dynamic value from url


interface MessageData {
  content: string
}


const {register , handleSubmit} = useForm<MessageData>()

const onsubmit = async(data: MessageData) => {
  try {
    await axios.post('/api/send-message' , 
      {
      username,
      content: data.content
    }, {withCredentials: true})

     toast(`message send sucessfully to ${username}`)
    console.log("message send sucessfully to user")

     } catch (error) {
    console.log("Error while sending the message" , error)
    toast.error(`${username} is not receving aynomus messages`)
  }
}



  return (
   <form onSubmit={handleSubmit(onsubmit)} className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg">
  <div className="text-center">
    <h1 className="text-4xl font-semibold bg-blue-950 text-white py-4 px-6 rounded-2xl inline-block">
      Public Profile Link Enter a message for {username}
    </h1>
  </div>

  <div className="mt-6">
    <input
    {...register("content")}
      type="text"
      placeholder="Enter a message"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
    />
  </div>

  <div className="mt-4 flex justify-center">
   <Button className=' className="bg-blue-950 text-white px-6 py-3 rounded-xl'>
    send message 
    
   </Button>
  </div>
</form>


  )
}

export default SendMmessagePage
