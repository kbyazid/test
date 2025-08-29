/* import Navbar from "./Navbar" */
type WrapperProps = {
    children : React.ReactNode
}

const Wrapper = ({children} : WrapperProps) => {
  return ( <>{children}</>
    // Retourne directement les enfants sans aucun wrapper
/*     <div>
        <Navbar/> 
        <div className="px-5 lg:px-[10%] mt-15 mb-10">
            {children}
        </div>
    </div> */
  )
}

export default Wrapper

