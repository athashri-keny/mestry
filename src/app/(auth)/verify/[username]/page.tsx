'use client'

import { useParams } from 'next/navigation'
import { useRouter } from "next/navigation"
import React from 'react'
import { toast } from 'sonner'
import {useForm} from 'react-hook-form'
import { verifySchema } from '@/Schemas/VerifySchema'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import {
  Form, FormControl,  FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


function VerifyAccount() {
    const router = useRouter()
    const param = useParams<{username: string}>()
 

      const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),       
        defaultValues: {
          code: ''
        }
      }
    );

    const onSubmit =  async (data: z.infer<typeof verifySchema>) => {
    try {
  const respone =  await axios.post(`/api/verify-code` , 
        {
            username: param.username,
            code: data.code
        }
    )    
    
   toast.success(respone.data.message)
   router.replace('/sign-in')

    } catch (error) {
        console.log("Error occured while verifying the code", error)
           toast.error("Error while plz try again  ")

    }
    }
    
  return (
    <div>
       <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="enter your code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
    </div>
    </div>
  )
}

export default VerifyAccount


