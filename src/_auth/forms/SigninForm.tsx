import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SigninFormValidation } from "@/lib/validation"
import Loader from "@/components/SharedCompo/Loader"
import { useSignInAccountMutation } from "@/lib/react-query/queryAndMutations"
import { useUserContext } from "@/Context/AuthContext"
import { useNavigate } from "react-router-dom"

const SigninFrom = () => {
  const {toast} = useToast();
  const {CheckAuthUser,isLoading: isUserLoading} = useUserContext();
  const navigate = useNavigate();

  
  const {mutateAsync: signInAccout} = useSignInAccountMutation();
  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninFormValidation>>({
    resolver: zodResolver(SigninFormValidation),
    defaultValues: {
      email: "",
      password: ""
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninFormValidation>) {
     const session = await signInAccout({
        email: values.email,
        password: values.password
     })

     if(!session){
        return toast({title: "Sign in failed."})
     }

     const isLoggedIn = await CheckAuthUser();

     if(isLoggedIn){
        form.reset();
        
        navigate('/')
     }else{
      return toast({title: "Sign in failed. Please try again later."})
     }
  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col px-4 sm:px-0">
           <img src="./assets/images/logo.svg" alt="logo"/>
           <h2 className="h3-bold md:h2-bold pt-5 sm:pt-8">Log in to your account</h2>
           <p className="text-light-3 small-medium md:base-regular mt-2">Welcome back please enter your details
           </p>
     
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} className="shad-input" />
              </FormControl>
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
                <Input type="password" {...field} className="shad-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="shad-button_primary">
           {isUserLoading?(
               <div className="flex center gap-2">
                  <Loader/>Loading...
               </div>
           ):(
                "Sign in"
           )}
        </Button>

        <p className="text-small-regular text-light-2 text-center mt-2">
          Don't have an account?
          <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">Sign up</Link>
        </p>
      </form>
      </div>
    </Form>
  )
}

export default SigninFrom