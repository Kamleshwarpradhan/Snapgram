import Loader from "@/components/SharedCompo/Loader";
import { useGetCurrentPosts } from "@/lib/react-query/queryAndMutations";
import PostCard from "@/components/SharedCompo/PostCard";
import { Models } from "appwrite";

const Home = () => {
  
  const {data:posts,isLoading: isPostLoading} = useGetCurrentPosts();
 
  return (
    <div className="flex flex-1">
         <div className="home-container">
              <div className="home-posts">
                    <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
                    {isPostLoading && !posts?
                       (<Loader />)
                    :
                    (
                       <ul className="flex flex-col flex-1 gap-9 w-full">
                           {posts?.documents.map((post: Models.Document)=>(
                               <PostCard key={post.caption} post={post} />
                           ))}
                       </ul>
                    )}
              </div>
         </div>
    </div>
  )
}

export default Home