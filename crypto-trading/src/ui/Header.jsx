import { useLocation } from "react-router-dom";
import HeaderProfile from "./HeaderProfile";

function Header({ className }) {
  const { pathname } = useLocation();
  const correctPage = pathname.slice(1);
  return (
    <header
      className={`h-14 flex items-center justify-between  border-b border-zinc-200 bg-white px-4  ${className}`}
    >
      <p className="capitalize font-semibold text-zinc-700 text-2xl">
        {correctPage}
      </p>
      <HeaderProfile />
    </header>
  );
}

export default Header;
