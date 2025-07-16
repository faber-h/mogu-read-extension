import { Outlet } from "react-router";

import ContentDetectionAlert from "@/components/ContentDetectionAlert";
import Header from "@/components/Header";
import Nav from "@/components/Nav";
import ToastContainer from "@/components/ToastContainer";
import { useAppMessaging } from "@/hooks/useAppMessaging";
import { useAppStore } from "@/stores/useAppStore";

const App = () => {
  useAppMessaging();
  const isContentDetected = useAppStore((store) => store.isContentDetected);

  return (
    <div className="flex h-screen flex-col">
      <ToastContainer />
      <Header />
      <Nav />
      <div className="flex flex-1 flex-col overflow-hidden p-4">
        {!isContentDetected && <ContentDetectionAlert />}
        {isContentDetected && <Outlet />}
      </div>
    </div>
  );
};

export default App;
