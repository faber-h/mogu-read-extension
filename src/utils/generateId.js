export const generateId = () => {
  const randomBytes = crypto.getRandomValues(new Uint8Array(8));
  const hexString = Array.from(randomBytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
  const id =
    `${hexString.slice(0, 4)}-` +
    `${hexString.slice(4, 8)}-` +
    `${hexString.slice(8, 12)}-` +
    `${hexString.slice(12, 16)}`;

  return id;
};
