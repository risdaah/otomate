import TemplatePointers from "./components/TemplatePointers"



function LandingIntro(){

  return (
    // <div className="hero min-h-full rounded-l-xl bg-base-200 relative">
    <div className="hero min-h-full rounded-l-xl relative">
          
    {/* Gambar TransLogi di atas background */}
      <div className="hero-content py-12">
        <div className="max-w-md">
          {/* Logo dan title */}
          <div className="text-center">
            {/* <img 
              src="LogoIconLogin.svg" 
              className="w-30 inline-block mask mask-circle mb-2" 
              alt="dashwind-logo" 
            /> */}
            {/* <h1 className="text-2xl font-bold">DashStack</h1> */}
            <h1 className="text-2xl mt-0 font-bold text-center">
                <span className="text-primary">Oto</span>
                <span className="text-info-content">Mate</span>
            </h1>

          </div>
          <TemplatePointers />
        </div>
      </div>
    </div>
  );
      
  }
  
  export default LandingIntro