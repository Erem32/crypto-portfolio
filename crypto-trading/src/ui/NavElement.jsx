import { NavLink } from "react-router-dom";

function NavElement({ link, children }) {
  return (
    <li>
      <NavLink
        className="flex items-center justify-center text-zinc-700 hover:text-zinc-800 hover:underline active:bg-zinc-100 aria-[current=page]:bg-zinc-100 p-4 rounded-2xl aria-[current=page]:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        to={link}
      >
        {children}
      </NavLink>
    </li>
  );
}

export default NavElement;
