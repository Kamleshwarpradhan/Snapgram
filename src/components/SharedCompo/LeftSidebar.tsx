import { Link,NavLink,useNavigate,useLocation } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignIOutAccountMutation } from "@/lib/react-query/queryAndMutations"
import { useEffect } from "react";
import { useUserContext } from "@/Context/AuthContext";
import { sidebarLinks } from "@/constant";
import { INavLink } from "@/types";


const LeftSidebar = () => {
    const {pathname} = useLocation();
    const {mutate: signOut, isSuccess} = useSignIOutAccountMutation();
    const navigate = useNavigate();
    const {user} = useUserContext();
    useEffect(()=>{
         if(isSuccess) navigate(0); 
    },[isSuccess])

  return (
    <nav className="leftsidebar">
          <div className="flex flex-col gap-11"> 
          <Link to="/" className="flex gap-3 items-center">
                    <img
                      src="/assets/images/logo.svg"
                      alt="logo"
                      width={170}
                      height={36}
                    />
          </Link>

          <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
                      <img 
                          src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
                          alt="profile"
                          className="h-14 w-14 rounded-full" 
                      />

                     <div className="flex flex-col">
                      <p className="body-bold">{user.name}</p>
                      <p className="small-regular text-light-3">@{user.username}</p>
                     </div> 
          </Link>

          <ul className="flex flex-col gap-2">
              {sidebarLinks.map((link: INavLink)=>(
                   <li key={link.label} className={`leftsidebar-link ${pathname===link.route?"bg-primary-500":""} group`}>
                       <NavLink 
                       to={link.route}
                       className="flex gap-4 items-center p-4"
                       >
                       <img src={link.imgURL} alt="logo"
                       className=
                       {`group-hover:invert-white ${pathname===link.route?"invert-white":""}`} 
                       />
                           {link.label}
                       </NavLink>
                   </li>
              ))}
          </ul>
          </div>

          <Button variant="ghost" className="shad-button_ghost" onClick={()=>signOut()}>
                          <img src="/assets/icons/logout.svg" alt="logout" />
                          <p className="small-medium lg:base-medium">Logout</p>
          </Button>
    </nav>
  )  
}

export default LeftSidebar