import { Input } from "@/components/ui/input"
import { useGetInfinitePosts, useGetsearchPost } from "@/lib/react-query/queryAndMutations"
import useDebounce from "@/hooks/useDebounce"
import { useEffect, useState } from "react"
import Loader from "@/components/SharedCompo/Loader";
import GridPostList from "@/components/SharedCompo/GridPostList";
import {useInView} from "react-intersection-observer"

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
};

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};

const Explore = () => {
  const {data:posts,fetchNextPage,hasNextPage} = useGetInfinitePosts();
   
   const [searchValue, setsearchValue] = useState('')
   const debounceValue  = useDebounce(searchValue,500)
   const {data:searchPosts,isFetching} = useGetsearchPost(debounceValue)
   
    const {ref,inView} = useInView();

    useEffect(()=>{
        if(inView && !searchValue){
           fetchNextPage();
        }
    },[inView,searchValue])

   const shouldshowsearchresults = searchValue !== '';
   const shouldshowPosts = !shouldshowsearchresults && posts?.pages.every((item)=>item.documents.length===0);

   if (!posts)
   return (
     <div className="flex-center w-full h-full">
       <Loader />
     </div>
   );
  return (
    <div className="explore-container">
        <div className="explore-inner_container">
            <h2 className="h3-bold md:h2-bold w-full">Serach Posts</h2>
            <div className="flex gap-1 w-full rounded-lg bg-dark-4 px-4">
                 <img src="/assets/icons/search.svg" alt="SearchIcon"
                 width={24}
                 height={24}
                 />
                 <Input 
                 type="text"
                 placeholder="Search"
                 className="explore-search"
                 value={searchValue}
                 onChange={(e)=>setsearchValue(e.target.value)}
                 />
            </div>
        </div>

        <div className="flex-between w-full max-w-5xl mt-12 mb-7">
          <h3 className="h3-bold md:h2-bold w-full">Popular Today</h3>
            
            <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
                <p className="small-medium md:base-medium text-light-2">All</p>
                <img src="/assets/icons/filter.svg" alt="filterIcon"
                width={20}
                height={20}
                />
            </div>
        </div>

        <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldshowsearchresults ? (
          <SearchResults
            isSearchFetching={isFetching}
            searchedPosts={searchPosts}
          />
        ) : shouldshowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          posts?.pages.map((item, index) => (
            <GridPostList key={`page-${index}`} posts={item.documents} />
          ))
        )}
      </div>
      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  )
}

export default Explore