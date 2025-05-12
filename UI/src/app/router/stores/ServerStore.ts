import { defineStore } from "pinia";
import apiClient from "@/api";

export const useServerStore = defineStore("server", {
  state: () => ({
    voiceMembers: {} as Record<string, Array<{ user_id: string; username: string; avatar_url: string }>>,
  }),

  actions: {
    async fetchVoiceMembers(serverId: string, channelId: string) {
      try {
        const res = await apiClient.get(`/servers/${serverId}/voicechannels/${channelId}/members`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.voiceMembers[channelId] = res.data;
      } catch (e) {
        console.error(`Ошибка загрузки участников канала ${channelId}`, e);
      }
    },
    async preloadAllVoiceMembers(serverId: string, channels: VoiceChannel[]) {
      for (const channel of channels) {
        await this.fetchVoiceMembers(serverId, channel.id);
      }
    },        
    // Сброс состояния
    clearServerStore() {  
    },
    async heartbeat(serverId: string, channelId: string) {
      await apiClient.patch(`/servers/${serverId}/voicechannels/${channelId}/heartbeat`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    },
  },
});
