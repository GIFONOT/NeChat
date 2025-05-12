import { defineStore } from "pinia";
import { useUserStore } from "@stores/UserStore";
import apiClient from "@/api";

export const useServerStore = defineStore("server", {
  state: () => ({
    voiceMembers: {} as Record<string, Array<{ user_id: string; username: string; avatar_url: string; mic: boolean; sound: boolean; }>>,
  }),

  actions: {
    async fetchVoiceMembers(serverId: string, channelId: string) {
      try {
        const res = await apiClient.get(`/servers/${serverId}/voicechannels/${channelId}/members`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const userStore = useUserStore();
        const currentUserId = userStore.user.id;

        this.voiceMembers[channelId] = res.data.map((member: any) => ({
          ...member,
          mic: member.user_id === currentUserId ? userStore.mic : false, // Пока не актуально, но через Websocket будут актуальные данные
          sound: member.user_id === currentUserId ? userStore.sound : false,
        }));
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
