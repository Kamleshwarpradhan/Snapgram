import { useGetCurrentUser, usedeletesavedPost, uselikePost, usesavePost } from "@/lib/react-query/queryAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite"
import { useEffect, useState } from "react";
import Loader from "./Loader";

type PostStatsProps = {
    post?: Models.Document;
    userId: string
}

const PostStats = ({post,userId}:PostStatsProps) => {
  
  const likesList = post?.likes.map((user: Models.Document)=> user.$id);
  const [likes, setLikes] = useState(likesList) 
  const [isSaved,setIsSaved] = useState(false);

  const {mutate: likePost} = uselikePost();
  const {mutate: savePost, isLoading: isSavingPost} = usesavePost();
  const {mutate: deleteSavedPost, isLoading: isDeletingPost} = usedeletesavedPost();

  const {data: currentUser} = useGetCurrentUser();

  const savePostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post?.$id);
  
  useEffect(()=>{
      setIsSaved(!!savePostRecord)
  },[currentUser])

  const handleLikePost = (e:React.MouseEvent)=>{
     e.stopPropagation();

     let newLikes = [...likes];

     const hasLiked = newLikes.includes(userId);

     if(hasLiked){ // i.e user wants to remove the like
          newLikes = newLikes.filter((id)=> id!==userId);
     }else{
          newLikes.push(userId);
     }

     setLikes(newLikes);
     likePost({postId: post?.$id || '',likesArray: newLikes});
  }

  const handleSavePost = (e:React.MouseEvent)=>{
      e.stopPropagation();

      if(savePostRecord){
         setIsSaved(false);
         return deleteSavedPost(savePostRecord.$id)
      }

      setIsSaved(true);
      savePost({postId:post?.$id || '',userId})
     
  }
  return (
    <div className="flex justify-between items-center z-20"> 
        <div className="flex gap-2 mr-5">
          <img 
           src={`${checkIsLiked(likes,userId)?"/assets/icons/liked.svg":"/assets/icons/like.svg"}`} 
           alt="like"
           height={20}
           width={20}
           onClick={handleLikePost}
           className="cursor-pointer" 
          />
          <p className="small-medium lg:base-medium">{likes.length}</p>
        </div> 
        <div className="flex gap-2 mr-5">
          {isSavingPost || isDeletingPost ? <Loader/>:
          <img 
           src={`${isSaved? "/assets/icons/saved.svg":"/assets/icons/save.svg"}`} 
           alt="like"
           height={20}
           width={20}
           onClick={handleSavePost}
           className="cursor-pointer" 
          />
          }
        </div> 
    </div>
  )
}

export default PostStats