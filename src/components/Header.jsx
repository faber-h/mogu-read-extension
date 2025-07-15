import ButtonSecondary from "@/components/ButtonSecondary";

const Header = () => {
  const handleGoToDashboard = () => {
    window.open(chrome.runtime.getURL("src/options/settings.html"));
  };

  return (
    <header className="flex items-center justify-between border-purple-200 p-4">
      <h1 className="text-lg font-bold text-purple-600">MoguRead</h1>
      <ButtonSecondary onClick={handleGoToDashboard}>대시보드</ButtonSecondary>
    </header>
  );
};

export default Header;
