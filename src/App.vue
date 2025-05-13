<template>
  <div class="min-h-screen bg-titanfall-primary text-white">
    <header class="bg-titanfall-secondary shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-titanfall-accent">
          {{ $t('serverList.title') }}
        </h1>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('serverList.search')"
              class="w-full px-4 py-2 rounded-lg bg-titanfall-secondary border border-gray-700 focus:border-titanfall-accent focus:outline-none"
            />
          </div>
          <div class="flex gap-2">
            <button
              v-for="mode in gameModes"
              :key="mode.value"
              @click="selectedMode = mode.value"
              :class="[
                'px-4 py-2 rounded-lg transition-colors',
                selectedMode === mode.value
                  ? 'bg-titanfall-accent text-white'
                  : 'bg-titanfall-secondary hover:bg-gray-700'
              ]"
            >
              {{ $t(`serverList.filter.${mode.value}`) }}
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="server in filteredServers"
          :key="`${server.ip}:${server.port}`"
          class="bg-titanfall-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col h-[500px]"
        >
          <div class="relative h-48 flex-shrink-0">
            <img
              :src="getMapImage(server.map_name)"
              :alt="server.map_name"
              class="w-full h-full object-cover"
            />
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <h2 class="text-xl font-bold">{{ server.host_name }}</h2>
            </div>
          </div>
          
          <div class="p-6 space-y-4 flex-grow flex flex-col">
            <div class="space-y-2">
              <p class="flex justify-between">
                <span class="text-gray-400">{{ $t('serverList.status.players') }}:</span>
                <span>{{ server.total_players }}/{{ server.max_players }}</span>
              </p>
              <p class="flex justify-between">
                <span class="text-gray-400">{{ $t('serverList.status.map') }}:</span>
                <span>{{ server.map_name }}</span>
              </p>
              <p class="flex justify-between">
                <span class="text-gray-400">{{ $t('serverList.status.mode') }}:</span>
                <span>{{ $t(`serverList.filter.${server.game_mode}`) }}</span>
              </p>
              <p class="flex justify-between">
                <span class="text-gray-400">{{ $t('serverList.status.version') }}:</span>
                <span>{{ server.version }}</span>
              </p>
              <div class="flex items-center justify-between mb-2">
                  <span class="text-gray-400">服务器地址</span>
                  <div class="flex items-center bg-gray-800 rounded-lg p-2 flex-shrink-0">
                    <span class="text-sm font-mono mr-2">{{ server.ip }}:{{ server.port }}</span>
                    <button
                      @click="copyConnectCommand(server)"
                      class="px-3 py-1 bg-titanfall-accent hover:bg-titanfall-accent/80 rounded transition-colors text-sm"
                    >
                      {{ copiedServer === `${server.ip}:${server.port}` ? '已复制' : '复制' }}
                    </button>
                  </div>
                </div>
            </div>
            


              <div class="overflow-y-auto flex-grow border-t border-gray-700 py-2">
                  <p class="text-sm text-gray-400">{{ server.description }}</p>
                </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const servers = ref([])
const searchQuery = ref('')
const selectedMode = ref('all')
const copiedServer = ref('')

const gameModes = [
  { value: 'all', label: 'All' },
  { value: 'attrition', label: 'Attrition' },
  { value: 'campaign', label: 'Campaign' },
  { value: 'coop', label: 'Co-op' },
  { value: 'ctf', label: 'Capture the Flag' },
  { value: 'lts', label: 'Last Titan Standing' },
  { value: 'mfdp', label: 'Marked for Death Pro' },
  { value: 'ps', label: 'Pilot Skirmish' },
  { value: 'tdm', label: 'Team Deathmatch' }
]

const filteredServers = computed(() => {
  return servers.value.filter(server => {
    const matchesSearch = server.host_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         server.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesMode = selectedMode.value === 'all' || server.game_mode === selectedMode.value
    return matchesSearch && matchesMode
  })
})

const fetchServers = async () => {
  try {
    const response = await axios.get('/r1d-api/servers')
    servers.value = response.data
  } catch (error) {
    console.error('Error fetching servers:', error)
  }
}

const mapImageMapping = {
  'mp_angel_city': '/image/maps/TF_AngelCity_Loadscreen.jpg',
  'mp_black_water_canal': '/image/maps/TF_BlackWaterCanal_Loadscreen.jpg',
  'mp_coliseum': '/image/maps/TF_Coliseum_Loadscreen.jpg',
  'mp_colony02': '/image/maps/TF_Colony_Loadscreen.jpg',
  'mp_complex3': '/image/maps/TF_Complex_Loadscreen.jpg',
  'mp_crashsite3': '/image/maps/TF_Crashsite_Loadscreen.jpg',
  'mp_drydock': '/image/maps/TF_Drydock_Loadscreen.jpg',
  'mp_eden': '/image/maps/TF_Eden_Loadscreen.jpg',
  'mp_forwardbase_kodai': '/image/maps/TF_ForwardBaseKodai_Loadscreen.jpg',
  'mp_glitch': '/image/maps/TF_Glitch_Loadscreen.jpg',
  'mp_grave': '/image/maps/TF_Grave_Loadscreen.jpg',
  'mp_homestead': '/image/maps/TF_Homestead_Loadscreen.jpg',
  'mp_lf_deck': '/image/maps/TF_LFDeck_Loadscreen.jpg',
  'mp_lf_meadow': '/image/maps/TF_LFMeadow_Loadscreen.jpg',
  'mp_lf_stacks': '/image/maps/TF_LFStacks_Loadscreen.jpg',
  'mp_lf_township': '/image/maps/TF_LFTownship_Loadscreen.jpg',
  'mp_lf_traffic': '/image/maps/TF_LFTraffic_Loadscreen.jpg',
  'mp_lf_uma': '/image/maps/TF_LFUMA_Loadscreen.jpg',
  'mp_relic02': '/image/maps/TF_Relic_Loadscreen.jpg',
  'mp_rise': '/image/maps/TF_Rise_Loadscreen.jpg',
  'mp_thaw': '/image/maps/TF_Thaw_Loadscreen.jpg',
  'mp_wargames': '/image/maps/TF_Wargames_Loadscreen.jpg'
}

const getMapImage = (mapName) => {
  return mapImageMapping[mapName.toLowerCase()] || '/image/maps/default_map.jpg'
}

const copyConnectCommand = async (server) => {
  const command = `${server.ip}:${server.port}`
  try {
    await navigator.clipboard.writeText(command)
    copiedServer.value = `${server.ip}:${server.port}`
    setTimeout(() => {
      copiedServer.value = ''
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

onMounted(() => {
  fetchServers()
  // 每30秒更新一次服务器列表
  setInterval(fetchServers, 30000)
})
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style> 