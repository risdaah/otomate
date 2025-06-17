 function Subtitle({styleClass, children}){
    return(
        <div className={`text-xl text-primary font-semibold ${styleClass}`}>{children}</div>
    )
}

export default Subtitle