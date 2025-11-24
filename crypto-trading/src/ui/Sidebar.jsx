import Logo from "./Logo";
import MainNav from "./MainNav";

function Sidebar({ className }) {
  return (
    <aside className={` ${className}`}>
      <Logo />
      <MainNav />
    </aside>
  );
}

export default Sidebar;
