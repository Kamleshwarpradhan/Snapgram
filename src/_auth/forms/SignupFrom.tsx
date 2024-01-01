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
import { SignupFormValidation } from "@/lib/validation"
import Loader from "@/components/SharedCompo/Loader"
import { useCreateUserAccountMutation, useSignInAccountMutation } from "@/lib/react-query/queryAndMutations"
import { useUserContext } from "@/Context/AuthContext"
import { useNavigate } from "react-router-dom"

const SignupFrom = () => {
  const {toast} = useToast();
  const {CheckAuthUser,isLoading: isUserLoading} = useUserContext();
  const navigate = useNavigate();

  const {mutateAsync: createUserAccount,isLoading:isCreatingAccount} = useCreateUserAccountMutation();
  const {mutateAsync: signInAccout, isLoading: isSigningIn} = useSignInAccountMutation();
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupFormValidation>>({
    resolver: zodResolver(SignupFormValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: ""
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupFormValidation>) {
     const newUser = await createUserAccount(values);
     
     if(!newUser){
      return toast({
         title: "Sign up faild !!!. Please try again",
         variant: "destructive",
         description: "There was a problem in your request"
      })
     }
     

     const session = await signInAccout({
        email: values.email,
        password: values.password
     })

     if(!session){
      toast({ title: "Something went wrong. Please login your new account", });
        
      navigate("/sign-in");
      
      return;
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
           <h2 className="h3-bold md:h2-bold pt-5 sm:pt-8">Create a new account</h2>
           <p className="text-light-3 small-medium md:base-regular mt-2">To explore the ultimate world of Snapgram please give the details
           </p>
     
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>name</FormLabel>
              <FormControl>
                <Input type="text" {...field} className="shad-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" {...field} className="shad-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
           {isCreatingAccount?(
               <div className="flex center gap-2">
                  <Loader/>Loading...
               </div>
           ):(
                "Sign up"
           )}
        </Button>

        <p className="text-small-regular text-light-2 text-center mt-2">
          Already have an acount?
          <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Log in</Link>
        </p>
      </form>
      </div>
    </Form>
  )
}

export default SignupFrom