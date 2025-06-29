const Header = () => {
  const historyUrl = import.meta.env.VITE_MOGUREAD_HISTORY_URL;

  const handleGoToDashboard = () => {
    window.open(historyUrl, "_blank");
  };

  return (
    <header className="flex items-center justify-between border-purple-200 p-4">
      <h1 className="text-lg font-bold text-purple-600">MoguRead</h1>
      <button
        onClick={handleGoToDashboard}
        className="cursor-pointer rounded-full border border-purple-500 px-4 py-1 text-sm text-gray-600 shadow-sm transition hover:bg-purple-500/90 hover:text-white"
      >
        대시보드
      </button>
    </header>
  );
};

export default Header;
