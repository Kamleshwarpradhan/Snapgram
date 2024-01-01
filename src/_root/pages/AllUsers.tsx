import Loader from '@/components/SharedCompo/Loader';
import UserCard from '@/components/SharedCompo/UserCard';
import { useGetAllusers } from '@/lib/react-query/queryAndMutations'


const AllUsers = () => {

  const {data:creators,isLoading} = useGetAllusers();
  
  
  return (
    <div className="common-container">
    <div className="user-container">
      <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
      {isLoading && !creators ? (
        <Loader />
      ) : (
        <ul className="user-grid">
          {creators?.documents.map((creator) => (
            <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
              <UserCard user={creator} />
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
  )
}

export default AllUsers