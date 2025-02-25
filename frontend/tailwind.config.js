module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      sm: "640px",   // 모바일 기준
      md: "768px",   // 태블릿 기준
      lg: "1024px",  // 작은 데스크탑
      xl: "1280px",  // 일반적인 웹
      "2xl": "1536px" // 대형 화면
    }
  },
  plugins: [],
}
