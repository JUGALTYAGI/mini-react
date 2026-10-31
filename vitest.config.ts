import { defineConfig } from "vitest/config";

export default defineConfig({
  // Compile JSX to plain createElement(type, props, ...children) calls.
  // `development: false` stops the compiler injecting React's dev-only
  // __self / __source props — real React strips those out itself; we don't.
  oxc: {
    jsx: {
      runtime: "classic",
      pragma: "createElement",
      pragmaFrag: "Fragment",
      development: false,
    },
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.{ts,tsx}"],
    silent: false,            // show the M2 demo output even when tests pass
  },
});
