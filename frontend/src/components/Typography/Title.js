function Title({className, children}){
    return(
        <p className={`text-2xl font-bold text-primary ${className}`}>{children}</p>
    )
}

export default Title