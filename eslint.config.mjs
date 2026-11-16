import next from "eslint-config-next/core-web-vitals";
const config = [
  ...next,
  {
    ignores: [".next/**", ".next-admin/**", "node_modules/**", "public/sw.js"],
  },
];
export default config;
