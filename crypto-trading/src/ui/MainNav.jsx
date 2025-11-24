import NavElement from "./NavElement";
import NavList from "./NavList";

function MainNav() {
  return (
    <nav>
      <NavList>
        <NavElement link="/dashboard">Dashboard</NavElement>
        <NavElement link="/portfolio">Portfolio</NavElement>
        <NavElement link="/market">Market</NavElement>
        <NavElement link="/account">Account</NavElement>
        <NavElement link="/settings">Settings</NavElement>
      </NavList>
    </nav>
  );
}

export default MainNav;
