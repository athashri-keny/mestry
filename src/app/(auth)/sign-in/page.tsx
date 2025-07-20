'use client'
import { SigninSchema } from '@/Schemas/SignInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl } from '@/components/ui/form' 
import z from 'zod'
import { toast } from 'sonner'
import {  FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { signIn } from 'next-auth/react'


function signin() {
 const router = useRouter()
 const [isSubmitting , setIsSubmitting] = useState(false)
 const [showpassword , setshowpassword] = useState(false)


const form =  useForm<z.infer <typeof SigninSchema>>({
  resolver: zodResolver(SigninSchema),
defaultValues: {
    identifier: "",
    password: ""
    }
})

const onSubmit = async (data: z.infer <typeof SigninSchema>) => {
  setIsSubmitting(true)
 
 const result =  await signIn('credentials' , {
    redirect: false, // maunally directing
    identifier: data.identifier,
    password: data.password
  })
  console.log(result) 

  if (result?.error) {
    toast.error("Login Failed Incorrect password or username")
  }
  
  if (result?.url) {
    router.replace('/dashboard')  
  }

}


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8  rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

          <FormField
  control={form.control}
  name="password"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Password</FormLabel>
      <FormControl>
        <div className='relative'>
        <Input type= {showpassword ? 'text' : 'password'} 
        {...field} />
        <button
        type='button'
        onClick={() => setshowpassword(!showpassword)}
         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-black-500"
        >
          {showpassword ? "Show" : "Hide"}
        </button>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
            <Button className='w-full' type="submit">Sign In</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default signin