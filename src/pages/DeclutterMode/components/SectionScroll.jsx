const SectionScroll = ({ children }) => (
  <div
    className="flex flex-1 flex-col gap-2 overflow-y-auto px-4"
    style={{ scrollbarGutter: "stable" }}
  >
    {children}
  </div>
);

export default SectionScroll;
