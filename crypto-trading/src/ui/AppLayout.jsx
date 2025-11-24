import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Header from "./Header";

function AppLayout() {
  return (
    <div className="grid min-h-dvh grid-cols-[26rem_1fr] grid-rows-[auto_1fr]  bg-zinc-100 p-6">
      <Header className="col-start-2 h-14  border-b border-zinc-200 bg-white px-4 flex items-center justify-between" />

      <Sidebar className="row-start-1 row-span-2 border-r border-zinc-200 bg-white p-4" />

      <main className="row-start-2 col-start-2 bg-white p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
