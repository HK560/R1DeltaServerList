<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
    :class="isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    @click.self="handleClose"
  >
    <div
      class="bg-titanfall-secondary rounded-lg shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col transform transition-all duration-300 ease-in-out"
      :class="isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
    >
      <header class="px-6 py-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
        <h3 class="text-xl font-semibold text-titanfall-highlight truncate pr-4" :title="server.host_name">
          <ColoredText :text="server.host_name" /> - {{ t('playerList.title') }}
        </h3>
        <button @click="handleClose" class="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </header>

      <div class="p-6 overflow-y-auto flex-grow space-y-3">
        <div v-if="!server.players || server.players.length === 0" class="text-center text-gray-400 py-10">
          <UserGroupIcon class="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p>{{ t('playerList.noPlayers') }}</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
          <div
            v-for="player in sortedPlayers"
            :key="player.name"
            class="bg-gray-800 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out border border-transparent hover:border-titanfall-accent"
          >
            <div class="flex justify-between items-center mb-1">
              <span class="font-medium text-md text-white truncate" :title="player.name">{{ player.name }}</span>
              <span
                :class="[
                  'px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide',
                  getTeamClass(player.team)
                ]"
              >
                {{ getTeamDisplayName(player.team) }}
              </span>
            </div>
            <div class="text-sm text-gray-400 ">
              {{ t('playerList.gen') }}{{ player.gen + 1 }}.{{ player.lvl }}
            </div>
          </div>
        </div>
      </div>

      <footer class="px-6 py-3 bg-gray-850 border-t border-gray-700 text-right rounded-b-lg flex-shrink-0">
        <button
          @click="handleClose"
          class="px-5 py-2 bg-titanfall-accent hover:bg-titanfall-accent/80 text-white rounded-md transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-titanfall-accent focus:ring-opacity-50"
        >
          {{ t('playerList.close') }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onUnmounted, ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Server, Player } from '../types'; // 确保路径正确
import { UserGroupIcon } from '@heroicons/vue/24/solid'; // 用于无玩家时的图标
import ColoredText from './ColoredText.vue'

const props = defineProps<{
  server: Server;
  visible: boolean;
}>();

const emit = defineEmits(['close']);
const { t } = useI18n();

const isOpen = ref(false);

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose();
  }
};

watch(() => props.visible, (newValue) => {
  if (newValue) {
    // Delay to allow CSS to catch up for transition
    requestAnimationFrame(() => {
      isOpen.value = true;
    });
    document.addEventListener('keydown', onKeydown);
  } else {
    // Ensure the isOpen state is updated before emitting close,
    // so transition out can complete if parent immediately re-renders.
    isOpen.value = false; 
    document.removeEventListener('keydown', onKeydown);
  }
}, { immediate: true });


const handleClose = () => {
  isOpen.value = false;
  // Wait for transition to complete before emitting close
  setTimeout(() => {
    emit('close');
  }, 300); // Match transition duration
};

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
});

const sortedPlayers = computed(() => {
  if (!props.server || !props.server.players) {
    return [];
  }
  return [...props.server.players].sort((a, b) => {
    // Prioritize known teams: Team 2 (IMC), then Team 3 (Militia)
    const teamOrder = (teamId: number) => {
      if (teamId === 2) return 1; // IMC first
      if (teamId === 3) return 2; // Militia second
      return 3; // Other teams last
    };

    const orderA = teamOrder(a.team);
    const orderB = teamOrder(b.team);

    if (orderA !== orderB) {
      return orderA - orderB;
    }
    // Optional: secondary sort by name if teams are the same
    return a.name.localeCompare(b.name);
  });
});

const getTeamDisplayName = (teamId: number): string => {
  if (teamId === 2) return t('playerList.teamA'); // IMC
  if (teamId === 3) return t('playerList.teamB'); // Militia
  return `${t('playerList.team')} ${teamId}`;
};

const getTeamClass = (teamId: number): string => {
  if (teamId === 2) return 'bg-blue-600 text-blue-100 border border-blue-500'; // IMC - Blueish
  if (teamId === 3) return 'bg-orange-600 text-orange-100 border border-orange-500'; // Militia - Orangeish
  return 'bg-gray-600 text-gray-100 border border-gray-500';
};

</script>

<style scoped>
/* Custom scrollbar for player list if needed */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 4px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.35);
}

.bg-gray-850 { /* Slightly different background for footer for depth */
  background-color: #212833; /* Adjust as per your titanfall-secondary darker shade */
}
</style>
