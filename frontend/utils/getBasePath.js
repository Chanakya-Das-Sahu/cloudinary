export const getBasePath = () => {
  const basePath = import.meta.env.VITE_BASE_PATH || "";
  return basePath;
};