'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue } from 'usehooks-ts';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/Schemas/SignupSchema";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/Types/ApiResponse";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


function SignInPage() {
  const [username, setUsername] = useState("");
  const [usernamemessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debouncedUsername] = useDebounceValue(username, 300); // returns an array 
  const [showpassword , setshowpassword]  = useState(false)
  const router = useRouter();

  // zod implementation 
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    // setting the default value of form 
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage('');

        try {
          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);
          setUsernameMessage(response.data.message);
          console.log(response)

        } catch (error) {
          const AxiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(AxiosError.response?.data?.message || "Error checking Username Failed");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsernameUnique();
  }, [debouncedUsername]);

  // form submit 
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      await axios.post<ApiResponse>('/api/sign-up', data);
      console.log(data)
      toast("Sign up successful!");
      router.replace(`verify/${username}`);

    } catch (error) {
      const AxiosError = error as AxiosError<ApiResponse>;
      const errorMessage = AxiosError.response?.data?.message || "Signup failed!";

      toast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                    />
                     </FormControl>
                  <FormMessage />
                  {usernamemessage && (
                    <p className="text-sm text-gray-500 mt-1">{usernamemessage}</p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

        <FormField
  name="password"
  control={form.control}
  render={({ field }) => (
    <FormItem>
      <FormLabel>Password</FormLabel>
      <FormControl>
        <div className="relative">
          <Input
            type={showpassword ? "text" : "password"}
            placeholder="Password"
            {...field}
          />
          <button
            type="button"
            onClick={() => setshowpassword(!showpassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-black"
          >
            {showpassword ? "Hide" : "Show"}
          </button>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

             
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Please wait..." : "Sign up"}
            </Button>
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
  );
}

export default SignInPage;
        