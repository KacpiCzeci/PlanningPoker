import "./NavBar.scss"

export default function NavBar(props:any){
    return(
        <nav className="navbar">
            <ul className="navbar-nav">{props.children}</ul>
        </nav>
    );
}