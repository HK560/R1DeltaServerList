<template>
  <div class="min-h-screen bg-titanfall-primary text-white flex flex-col bg-cover bg-center bg-no-repeat bg-fixed" >
    <header class="bg-titanfall-secondary shadow-lg">
      <div class="container mx-auto px-6 py-6">
        <div class="flex justify-between items-center">
          <h1 class="text-xl md:text-3xl font-bold text-titanfall-highlight flex items-center gap-3 ">
            <img src="/image/icon.png" alt="Site Icon" class="w-12 h-12 shadow-2xl" />
            {{ t('serverList.title') }}

          </h1>

          <div class="flex flex-col md:flex-row gap-1">
            <button
            @click="locale = 'en'"
            :class="[
              'px-2 py-2 rounded-lg transition-colors text-sm md:text-base',
              locale === 'en'
                ? 'bg-titanfall-accent text-white'
                : 'bg-titanfall-secondary hover:bg-gray-700'
              ]"
            >
            ENG
            </button>
            <button
              @click="locale = 'zh'"
              :class="[
                'px-2 py-2 rounded-lg transition-colors text-sm md:text-base',
                locale === 'zh'
                  ? 'bg-titanfall-accent text-white'
                  : 'bg-titanfall-secondary hover:bg-gray-700'
              ]"
            >
              中文
            </button>

          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8 flex-grow">
      <div class="mb-8">
        <div class="flex flex-col md:flex-row gap-4">

          <div class="flex flex-1 flex-row gap-2" >
            <div class=" text-white min-w-[3rem]">
              <div class="flex items-center gap-2">
                <ServerStackIcon class="w-5 h-5" />
                <span class="text-sm text-gray-300">{{ serverCount }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UserGroupIcon class="w-5 h-5" />
                <span class="text-sm text-gray-300">{{ playerCount }}</span>
              </div>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('serverList.search')"
              class="w-full px-4 py-2 rounded-lg bg-titanfall-secondary border border-gray-700 focus:border-titanfall-accent focus:outline-none"
            />
          </div>
          <div class="flex gap-4 items-center">
            <label class="flex items-center group cursor-pointer">
              <div class="relative">
                <input
                  type="checkbox"
                  v-model="showOnlyWithPlayers"
                  class="peer sr-only"
                />
                <div class="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-titanfall-accent transition-colors duration-200 ease-in-out"></div>
                <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition-transform duration-200 ease-in-out"></div>
              </div>
              <span class="ml-3 text-sm text-gray-300 group-hover:text-white transition-colors duration-200 select-none">
                {{ t('serverList.filter.onlyWithPlayers') }}
              </span>
            </label>
            <select
              v-model="selectedMode"
              class="px-4 py-2 rounded-lg bg-titanfall-secondary border border-gray-700 text-white focus:border-titanfall-accent focus:outline-none transition-colors duration-200"
            >
              <option
                v-for="mode in gameModes"
                :key="mode.value"
                :value="mode.value"
                class="bg-gray-800 text-white"
              >
                {{ t(`serverList.filter.${mode.value}`) }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <Transition name="fade" mode="out-in">
        <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
          <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-titanfall-accent"></div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TransitionGroup name="fade-list">
            <div
              v-for="server in filteredServers"
              :key="`${server.ip}:${server.port}`"
              class="bg-titanfall-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col h-[450px]"
            >
              <div class="relative h-48 flex-shrink-0">
                <img
                  :src="getMapImage(server.map_name)"
                  :alt="server.map_name"
                  class="w-full h-full object-cover"
                />
                <div class="absolute top-2 right-2 flex items-center px-3 py-1 rounded-full shadow-2xl shadow-black"
                     :class="{
                       'bg-gray-600': server.total_players === 0,
                       'bg-green-600': server.total_players > 0 && server.total_players < server.max_players,
                       'bg-red-600': server.total_players === server.max_players
                     }">
                  <UserGroupIcon class="w-5 h-5 mr-1" />
                  <span class="font-bold">{{ server.total_players }}/{{ server.max_players }}</span>
                </div>
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h2 class="text-xl font-bold">{{ server.host_name }}</h2>
                </div>
              </div>
              
              <div class="p-6 space-y-4 flex-grow flex flex-col">
                <div class="space-y-2">
                  <!-- <p class="flex justify-between">
                    <span class="text-gray-400">{{ t('serverList.status.players') }}:</span>
                    <span>{{ server.total_players }}/{{ server.max_players }}</span>
                  </p> -->
                  <p class="flex justify-between">
                    <span class="text-gray-400">{{ t('serverList.status.map') }}:</span>
                    <span>{{ t(`serverList.map.${server.map_name}`) }}</span>
                  </p>
                  <p class="flex justify-between">
                    <span class="text-gray-400">{{ t('serverList.status.mode') }}:</span>
                    <span>{{ t(`serverList.filter.${server.game_mode}`) }}</span>
                  </p>
                  <p class="flex justify-between">
                    <span class="text-gray-400">{{ t('serverList.status.version') }}:</span>
                    <span>{{ server.version }}</span>
                  </p>
                  <div class="flex items-center justify-between mb-2">
                      <span class="text-gray-400">{{ t('serverList.status.address') }}</span>
                      <div class="flex items-center bg-gray-800 rounded-lg p-2 flex-shrink-0">
                        <span class="text-sm font-mono mr-2">{{ server.ip }}:{{ server.port }}</span>
                        <button
                          @click="copyConnectCommand(server)"
                          class="px-3 py-1 bg-titanfall-accent hover:bg-titanfall-accent/80 rounded transition-colors text-sm"
                        >
                          {{ copiedServer === `${server.ip}:${server.port}` ? t('serverList.button.copied') : t('serverList.button.copy') }}
                        </button>
                      </div>
                    </div>
                </div>
                
                <div class="overflow-y-auto max-h-[80px] flex-grow border-t border-gray-700 py-2">
                  <p class="text-sm text-gray-400">{{ server.description === "" ? t('serverList.message.nodescription') : server.description }}</p>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </Transition>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import type { Server, GameMode, GameModeOption } from './types'
import { mapImageMapping } from './data/data'
import Footer from './components/Footer.vue'
import { UserGroupIcon, ServerStackIcon } from '@heroicons/vue/24/solid'

const { t, locale } = useI18n()

const servers = ref<Server[]>([])
const searchQuery = ref('')
const selectedMode = ref<GameMode>('all')
const copiedServer = ref('')
const isLoading = ref(true)
const showOnlyWithPlayers = ref(false)

const gameModes: GameModeOption[] = [
  { value: 'all', label: 'All' },
  { value: 'at', label: 'Attrition' },
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
    const matchesPlayers = !showOnlyWithPlayers.value || server.total_players > 0
    return matchesSearch && matchesMode && matchesPlayers
  })
})

const fetchServers = async (): Promise<void> => {
  try {
    isLoading.value = true
    const response = await axios.get<Server[]>('/r1d-api/servers')
    servers.value = response.data
  } catch (error) {
    console.error('Error fetching servers:', error)
  } finally {
    isLoading.value = false
  }
}

const getMapImage = (mapName: string): string => {
  return mapImageMapping[mapName.toLowerCase()] || '/image/maps/Menu_Background.jpg'
}

const copyConnectCommand = async (server: Server): Promise<void> => {
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

const serverCount = computed(() => {
  return filteredServers.value.length
})

const playerCount = computed(() => {
  return filteredServers.value.reduce((sum, server) => sum + server.total_players, 0)
})

onMounted(() => {
  fetchServers()
  setInterval(fetchServers, 60000)
})
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  transition: background 0.2s ease;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-list-enter-active,
.fade-list-leave-active {
  transition: all 0.3s ease;
}

.fade-list-enter-from,
.fade-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-list-move {
  transition: transform 0.3s ease;
}
</style> 