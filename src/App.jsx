import { Outlet } from "react-router";

import Header from "@/components/Header";
import Nav from "@/components/Nav";

const App = () => {
  return (
    <div>
      <Header />
      <Nav />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
