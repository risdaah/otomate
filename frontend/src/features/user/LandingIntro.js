

import TemplatePointers from "./components/TemplatePointers"

function LandingIntro(){

    return(
        <div className="hero min-h-full rounded-l-xl bg-base-200">
            <div className="hero-content py-12">
              {/* <div className="max-w-md">
              <h1 className='text-3xl text-center font-bold text-primary'><img src="/logo192.png" className="w-12 inline-block mr-2 mask mask-circle" alt="dashwind-logo" />OTOMATE</h1>
              </div> */}
            <div className="max-w-md">
                  {/* Logo dan title */}
                  <div className="text-center">
                    <img 
                      src="/logo192.png" 
                      className="w-30 inline-block mask mask-circle mb-2" 
                      alt="otomate-logo" 
                    />
                    {/* <h1 className="text-2xl font-bold">DashStack</h1> */}
            <h1 className="text-2xl mt-0 font-bold text-center">
              <span className="text-primary">OTO</span>
              <span className="text-info-content">MATE</span>
            </h1>
          </div>
          <TemplatePointers />
          </div>
        </div>

          </div>
    )
      
  }
  
  export default LandingIntro