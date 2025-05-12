import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './assets/main.css'

const i18n = createI18n({
  locale: 'zh',
  messages: {
    zh: {
      serverList: {
        title: 'R1Delta 服务器列表(本页面开发中)',
        search: '搜索服务器...',
        filter: {
          all: '全部',
          attrition: '消耗战',
          campaign: '战役',
          coop: '合作',
          ctf: '夺旗',
          lts: '泰坦死斗',
          mfdp: '标记死亡',
          ps: '飞行员对战',
          tdm: '团队死斗'
        },
        status: {
          players: '玩家数',
          maxPlayers: '最大玩家数',
          map: '地图',
          mode: '模式',
          version: '版本'
        }
      }
    },
    en: {
      serverList: {
        title: 'Titanfall Server List',
        search: 'Search servers...',
        filter: {
          all: 'All',
          attrition: 'Attrition',
          campaign: 'Campaign',
          coop: 'Co-op',
          ctf: 'Capture the Flag',
          lts: 'Last Titan Standing',
          mfdp: 'Marked for Death Pro',
          ps: 'Pilot Skirmish',
          tdm: 'Team Deathmatch'
        },
        status: {
          players: 'Players',
          maxPlayers: 'Max Players',
          map: 'Map',
          mode: 'Mode',
          version: 'Version'
        }
      }
    }
  }
})

const app = createApp(App)
app.use(i18n)
app.mount('#app') 