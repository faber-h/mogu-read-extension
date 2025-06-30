const ReadingSummary = ({ progress, onReset }) => {
  return (
    <div className="space-y-4 text-center">
      <h2 className="text-lg font-semibold">🏆 읽기 완료 요약</h2>
      <p>✔️ 읽은 시간: {progress.elapsed}초</p>
      <p>✔️ 총 줄 수: {progress.totalLines}줄</p>
      <p>🐣 모구 단계: 성장 단계</p>
      <button
        onClick={onReset}
        className="rounded-full border border-purple-500 px-6 py-2 text-gray-600 transition hover:bg-purple-100"
      >
        읽기 설정으로 돌아가기
      </button>
    </div>
  );
};

export default ReadingSummary;
