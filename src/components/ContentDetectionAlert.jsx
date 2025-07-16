const ContentDetectionAlert = () => {
  return (
    <div className="mt-4 flex flex-col items-center space-y-6">
      <p className="text-center text-sm text-red-500">
        앗! 이 페이지에서는 MoguRead에 필요한
        <br />
        글 영역이 감지되지 않아
        <br />
        사용할 수 없어요.
      </p>
      <img
        src="/images/mogu_unavailable.png"
        alt="모구 준비 불가"
        className="h-50 w-50"
      />
    </div>
  );
};

export default ContentDetectionAlert;
