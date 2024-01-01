import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from "@tanstack/react-query"
import { createPost, createUserAccount, deletePost, deleteSavedPost, getAllusers, getCurrentUser, getInfinitePost, getPostById, getRecentPosts, getUserById, likePost, savePost, searchPost, signInAccount, signOutAccount, updatePost, updateUser } from "../appwrite/api"
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types"
import { QUERY_KEYS } from "./query-Keys"

// When we require fetch ===> useQuery
// when we have to update ===> useMutation
export const useCreateUserAccountMutation = ()=>{
     return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccountMutation = ()=>{
    return useMutation({
       mutationFn: (user: {email:string; password:string}) => signInAccount(user)
   })
}

export const useSignIOutAccountMutation = ()=>{
    return useMutation({
       mutationFn: () => signOutAccount()
   })
}

export const useCreatePost = ()=>{
     const queryClient = useQueryClient();
     // We invalidateQueries so that data dont go stale and everytime when we try to get a recent post we fetches from the server not from the caches
     return useMutation({
         mutationFn: (post: INewPost) => createPost(post),
         onSuccess: ()=>{
              queryClient.invalidateQueries({
                  queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
              })
         }
     })
}

export const useGetCurrentPosts = ()=>{
     return useQuery({
         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
         queryFn: getRecentPosts
     })
}

export const uselikePost = ()=>{
     // Here we invalidate the Queries as every post in React
     // will be cached so that it takes less time to reload and changes are also kept. We invalided the post so that it doesn't changes the cached data only changes must be reflect on server data so that changes will be appear on each section like here in postDetails section after clicking the post
     const queryClient = useQueryClient();
     return useMutation({
        mutationFn: ({postId,likesArray}:{postId:string; likesArray: string[]}) => likePost(postId,likesArray),
        onSuccess: (data)=>{
             queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID,data?.$id]
             })
             queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
             })
             queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
             })
             queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
             })
        }
     })
}
export const usesavePost = ()=>{
     
     const queryClient = useQueryClient();
     return useMutation({
        mutationFn: ({postId,userId}:{postId:string; userId: string}) => savePost(postId,userId),
        onSuccess: ()=>{
             queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
             })
             queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
             })
             queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
             })
        }
     })
}
export const usedeletesavedPost = ()=>{
     
     const queryClient = useQueryClient();
     return useMutation({
        mutationFn: (saveRecordId:string) => deleteSavedPost(saveRecordId),
        onSuccess: ()=>{
             queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
             })
             queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
             })
             queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
             })
        }
     })
}


export const useGetCurrentUser = ()=>{
     return useQuery({
         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
         queryFn: getCurrentUser
     })
}

export const useGetPostByID = (postId: string)=>{
    return useQuery({
         queryKey: [QUERY_KEYS.GET_POST_BY_ID,postId],
         queryFn: ()=>getPostById(postId),
         enabled: !!postId
    })
}

export const useUpdatePost = ()=>{
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: (post: IUpdatePost) => updatePost(post),
     onSuccess: () => {
       queryClient.invalidateQueries({
         queryKey: [QUERY_KEYS.GET_POST_BY_ID],
       });
     },
   });
}
export const useDeletePost = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
       mutationFn: ({postId,imageid}:{postId:string; imageid:string})=> deletePost(postId,imageid),
       onSuccess: ()=>{
            queryClient.invalidateQueries({
               queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
       }
    })
}

export const useGetInfinitePosts = () => {
   return useInfiniteQuery({
     queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
     queryFn: getInfinitePost as any,
     getNextPageParam: (lastPage: any) => {
       // If there's no data, there are no more pages.
       if (lastPage && lastPage.documents.length === 0) {
         return null;
       }
 
       // Use the $id of the last document as the cursor.
       const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
       return lastId;
     },
   });
}

export const useGetsearchPost = (searchTerm:string)=>{
    return useQuery({
       queryKey: [QUERY_KEYS.SEARCH_POSTS,searchTerm],
       queryFn:()=>searchPost(searchTerm),
       enabled: !!searchTerm
    })
}

export const useGetAllusers = (limit?: number)=>{
    return useQuery({
       queryKey: [QUERY_KEYS.GET_USERS],
       queryFn: ()=>getAllusers(limit || 0)
    })
}

export const useGetUserById = (userId: string)=>{
   return useQuery({
      queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
      queryFn: () => getUserById(userId),
      enabled: !!userId,
    });
}


export const useUpdateUser = ()=>{
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: (user: IUpdateUser) => updateUser(user),
     onSuccess: (data) => {
       queryClient.invalidateQueries({
         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
       });
       queryClient.invalidateQueries({
         queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
       });
     },
   });
}