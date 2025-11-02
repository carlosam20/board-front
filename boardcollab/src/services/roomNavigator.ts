// src/router/roomNavigator.ts
import { useRouter } from 'vue-router';

export function useRoomNavigator() {
  const router = useRouter();
  

  function createAndNavigateToRoom() {
    const newRoomId = crypto.randomUUID();
    router.push(`/room/${newRoomId}`);
  }

  function navigateToRoom(roomId: string) {
    router.push(`/room/${roomId}`);
  }

  return {
    createAndNavigateToRoom,
    navigateToRoom
  };
}
