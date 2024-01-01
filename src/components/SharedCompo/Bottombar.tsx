import { bottombarLinks } from "@/constant"
import { Link, useLocation } from "react-router-dom"

const Bottombar = () => {
  const {pathname} = useLocation();

  return (
    <section className="bottom-bar sticky bottom-0">
      {bottombarLinks.map((link)=>(
                       <Link 
                       to={link.route}
                       className={`${pathname===link.route?"bg-primary-500 rounded-[10px]":""} flex-center flex-col gap-1 p-3 transition`}
                       key={link.label}
                       >
                       <img src={link.imgURL}
                        alt="logo"
                       className=
                       {`${pathname===link.route?"invert-white":""}`} 
                       />
                           <p className="tiny-medium text-light-2">{link.label}</p>
                       </Link>
              ))}
    </section>
  )
}

export default Bottombar