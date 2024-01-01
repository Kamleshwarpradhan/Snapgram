import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import FileUploader from "../SharedCompo/FileUploader"
import { Textarea } from "../ui/textarea"
import { PostValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "@/Context/AuthContext"
import { toast } from "../ui/use-toast"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queryAndMutations"

type PostFormProps = {
   action: "create" | "update";
   post?: Models.Document; 
}

const PostForm = ({action,post}:PostFormProps) => {

  // console.log(post?.imageURL);
  
    const {mutateAsync: createPost, isLoading: isLoadingCreate} = useCreatePost();
 
    const {mutateAsync: updatePost,isLoading:isLoadingUpdate} = useUpdatePost();

    const {user} = useUserContext();

    const navigate = useNavigate();
    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
          caption: post ? post?.caption: "",
          file: [],
          location: post?post?.location:"",
          tags: post ? post.tags.join(','):''
        },
      })
     
      // 2. Define a submit handler.
      async function onSubmit(values: z.infer<typeof PostValidation>) {
        if(post && action === 'update'){
            const updatedPost = await updatePost({
               ...values,
               postId: post.$id,
               imageid: post?.imageid,
               imageURL: post?.imageURL
            })

            if(!updatedPost){
               toast({title: "Please try again...!"})
            }

            return navigate(`/posts/${post.$id}`)
        }

        const newPost =  await createPost({
           ...values,
           userId: user.id,
        })
        
        if(!newPost) {
            toast({
               title: "please try again..."
            })
        }
        navigate('/')
      }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                   fieldChange = {field.onChange}
                   mediaUrl = {post?.imageURL}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled = {isLoadingCreate || isLoadingUpdate}
            >
              {isLoadingCreate || isLoadingUpdate && "Loading..."}
              {action} Post
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm