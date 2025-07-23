import Navbar from "./Navbar"
type WrapperProps = {
    children : React.ReactNode
}

const Wrapper = ({children} : WrapperProps) => {
  return (
    <div>
      <Navbar/>
        <div className="px-5 lg:px-[10%] mt-15 mb-10">
            {children}
        </div>
    </div>
  )
}

export default Wrapper