import { Outlet } from "react-router";

import Header from "@/components/Header";
import Nav from "@/components/Nav";
import ToastContainer from "@/components/ToastContainer";

const App = () => {
  return (
    <div className="flex h-screen flex-col">
      <ToastContainer />
      <Header />
      <Nav />
      <div className="flex flex-1 flex-col overflow-hidden p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
