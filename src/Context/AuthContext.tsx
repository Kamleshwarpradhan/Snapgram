import { getCurrentUser } from '@/lib/appwrite/api';
import { IContextType } from '@/types'
import {createContext,useContext,useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';

export const INTITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: ''
}
const INTITIAL_STATE = {
     user: INTITIAL_USER,
     isLoading: false,
     isAuthenticated: false,
     setUser: ()=>{},
     setIsAuthenticated: ()=>{},
     CheckAuthUser: async ()=> false as boolean
}

   const AuthContext = createContext<IContextType>(INTITIAL_STATE);

export function AuthProvider({children}:{children: React.ReactNode}){
  
  const [user, setUser] = useState(INTITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
   const navigate = useNavigate();

  const CheckAuthUser = async ()=>{
     setIsLoading(true);
     try {
        const currentAccount = await getCurrentUser();

        if(currentAccount){
            setUser({
                 id: currentAccount.$id,
                 name: currentAccount.name,
                 username: currentAccount.username,
                 email: currentAccount.email,
                 imageUrl: currentAccount.imageUrl,
                 bio: currentAccount.bio
            })

            setIsAuthenticated(true);
            return true;
        }
        return false;
     } catch (error) {
        console.log(error);
        return false;
     } finally{
         setIsLoading(false);
     }

    }
    useEffect(()=>{
        if(
            localStorage.getItem('cookieFallback') === '[]' 
            || localStorage.getItem('cookiesFallback') === null 
        ){navigate('/sign-in')}

        CheckAuthUser();
    },[])
  
  const value = {
      user,
      setUser,
      isLoading,
      isAuthenticated,
      setIsAuthenticated,
      CheckAuthUser
  }
  return <AuthContext.Provider value={value}>
          {children}
     </AuthContext.Provider>
}

export const useUserContext = ()=>useContext(AuthContext)