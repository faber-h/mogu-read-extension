export const getFilteredData = (data, mode, year, month, dateField) => {
  if (mode === "all") return data;

  return data.filter((item) => {
    const itemDate = new Date(item[dateField]);
    const itemYear = itemDate.getFullYear().toString();
    const itemMonth = itemDate.getMonth() + 1;

    if (month === "전체") return itemYear === year;

    const targetMonth = typeof month === "string" ? parseInt(month) : month;

    return itemYear === year && itemMonth === targetMonth;
  });
};

export const getAvailableYears = (data, dateField) => {
  const years = new Set();
  data.forEach((item) => {
    if (item[dateField]) {
      years.add(new Date(item[dateField]).getFullYear().toString());
    }
  });

  return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
};

export const getAvailableMonths = (data, dateField, selectedYear) => {
  const months = new Set();
  data.forEach((item) => {
    const itemDate = new Date(item[dateField]);
    const itemYear = itemDate.getFullYear().toString();
    if (itemYear === selectedYear) {
      months.add(itemDate.getMonth() + 1);
    }
  });
  const sortedMonths = Array.from(months).sort((a, b) => a - b);

  return ["전체", ...sortedMonths];
};
