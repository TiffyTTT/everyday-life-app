/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:      '#0a0f0b',   // พื้นหลังหลัก (เข้มกว่า student app นิด)
          surface: '#111a13',   // card / panel
          border:  '#1e2d20',   // ขอบ subtle
          accent:  '#34d399',   // เขียว emerald (main CTA)
          dim:     '#6ee7b7',   // accent อ่อน (text secondary)
          danger:  '#f87171',   // แดง (overdue / error)
          warn:    '#fbbf24',   // เหลือง (in-progress)
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}