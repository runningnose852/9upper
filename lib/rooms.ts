import {
    doc,
    getDoc,
    onSnapshot,
    setDoc,
    updateDoc,
  } from "firebase/firestore";
  import { db } from "./firebase";
  
  export type Player = {
    id: string;
    name: string;
  };
  
  export type RoomData = {
    roomCode: string;
    hostName: string;
    hostPlayerId: string;
    phase: "lobby" | "privateCards" | "discussion" | "reveal";
    round: number;
    createdAt: number;
    players: Player[];
    currentPromptIndex?: number;
    truthPlayerId?: string;
    privateCards?: Record<string, string>;
  };
  
  export async function createRoom(roomCode: string, hostName: string) {
    const roomRef = doc(db, "rooms", roomCode);
    const hostPlayerId = crypto.randomUUID();
  
    const data: RoomData = {
      roomCode,
      hostName,
      hostPlayerId,
      phase: "lobby",
      round: 1,
      createdAt: Date.now(),
      players: [{ id: hostPlayerId, name: hostName }],
      privateCards: {},
    };
  
    await setDoc(roomRef, data);
    return { ...data, myPlayerId: hostPlayerId };
  }
  
  export async function joinRoom(roomCode: string, playerName: string) {
    const roomRef = doc(db, "rooms", roomCode);
    const snap = await getDoc(roomRef);
  
    if (!snap.exists()) {
      throw new Error("Room not found");
    }
  
    const data = snap.data() as RoomData;
    const existing = data.players.find((p) => p.name === playerName);
  
    if (existing) {
      return { room: data, myPlayerId: existing.id };
    }
  
    const newPlayerId = crypto.randomUUID();
    const updatedPlayers = [
      ...data.players,
      { id: newPlayerId, name: playerName },
    ];
  
    await updateDoc(roomRef, {
      players: updatedPlayers,
    });
  
    return {
      room: {
        ...data,
        players: updatedPlayers,
      } as RoomData,
      myPlayerId: newPlayerId,
    };
  }
  
  export function subscribeToRoom(
    roomCode: string,
    callback: (room: RoomData | null) => void
  ) {
    const roomRef = doc(db, "rooms", roomCode);
  
    return onSnapshot(roomRef, (snap) => {
      if (!snap.exists()) {
        callback(null);
        return;
      }
      callback(snap.data() as RoomData);
    });
  }
  
  export async function startRound(
    roomCode: string,
    題庫: { 真相: string }[]
  ) {
    const roomRef = doc(db, "rooms", roomCode);
    const snap = await getDoc(roomRef);
  
    if (!snap.exists()) {
      throw new Error("Room not found");
    }
  
    const data = snap.data() as RoomData;
    const promptIndex = Math.floor(Math.random() * 題庫.length);
    const truthPlayer =
      data.players[Math.floor(Math.random() * data.players.length)];
  
    const privateCards: Record<string, string> = {};
  
    for (const player of data.players) {
      privateCards[player.id] =
        player.id === truthPlayer.id
          ? `你知道真正答案：${題庫[promptIndex].真相}`
          : "你不知道真正答案。請作一個可信但假的解釋。";
    }
  
    await updateDoc(roomRef, {
      phase: "privateCards",
      currentPromptIndex: promptIndex,
      truthPlayerId: truthPlayer.id,
      privateCards,
    });
  }
  
  export async function setRoomPhase(
    roomCode: string,
    phase: RoomData["phase"]
  ) {
    const roomRef = doc(db, "rooms", roomCode);
    await updateDoc(roomRef, { phase });
  }