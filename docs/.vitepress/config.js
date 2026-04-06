import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/Vibe_Camp_Textbook/',
  title: "Vibe Coding Camp",
  description: "게임 아티스트를 위한 C# 오케스트레이션 교재",
  cleanUrls: true,
  appearance: 'dark', // 다크모드 강제 고정
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Outfit:wght@400;600;800&family=Pretendard:wght@400;600;800&display=swap' }]
  ],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Month 1', link: '/month1/week1' }
    ],
    sidebar: [
      {
        text: 'Month 1: C# 해부학',
        items: [
          { text: 'Week 1: 데이터의 본질', link: '/month1/week1' },
          { text: 'Week 2: 행동과 생산', link: '/month1/week2' },
          { text: 'Week 3: 흐름의 통제', link: '/month1/week3' },
          { text: 'Week 4: 붕어빵 공장', link: '/month1/week4' },
          { text: 'Week 5: 실전 유니티 적용', link: '/month1/week5' }
        ]
      }
    ],
    outline: {
      label: '이 페이지의 목차'
    },
    search: {
      provider: 'local'
    }
  }
})
