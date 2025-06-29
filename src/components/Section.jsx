const Section = ({ title, flex, children }) => {
  return (
    <section
      className={`flex flex-col overflow-hidden rounded border border-purple-200 px-0 py-4 ${flex}`}
    >
      <h2 className="mb-2 px-4 text-sm font-semibold text-purple-700">
        {title}
      </h2>
      {children}
    </section>
  );
};

export default Section;
