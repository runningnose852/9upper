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
    phase: "lobby" | "privateCards" | "discussion" | "reveal";
    round: number;
    createdAt: number;
    players: Player[];
    currentPromptIndex?: number;
    truthPlayerId?: string;
  };
  
  export async function createRoom(roomCode: string, hostName: string) {
    const roomRef = doc(db, "rooms", roomCode);
  
    const data: RoomData = {
      roomCode,
      hostName,
      phase: "lobby",
      round: 1,
      createdAt: Date.now(),
      players: [{ id: crypto.randomUUID(), name: hostName }],
    };
  
    await setDoc(roomRef, data);
    return data;
  }
  
  export async function joinRoom(roomCode: string, playerName: string) {
    const roomRef = doc(db, "rooms", roomCode);
    const snap = await getDoc(roomRef);
  
    if (!snap.exists()) {
      throw new Error("Room not found");
    }
  
    const data = snap.data() as RoomData;
    const alreadyExists = data.players.some((p) => p.name === playerName);
  
    if (alreadyExists) return data;
  
    const updatedPlayers = [
      ...data.players,
      { id: crypto.randomUUID(), name: playerName },
    ];
  
    await updateDoc(roomRef, {
      players: updatedPlayers,
    });
  
    return {
      ...data,
      players: updatedPlayers,
    } as RoomData;
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
  
  export async function startRound(roomCode: string, 題目數量: number) {
    const roomRef = doc(db, "rooms", roomCode);
    const snap = await getDoc(roomRef);
  
    if (!snap.exists()) {
      throw new Error("Room not found");
    }
  
    const data = snap.data() as RoomData;
    const truthPlayer =
      data.players[Math.floor(Math.random() * data.players.length)];
  
    await updateDoc(roomRef, {
      phase: "privateCards",
      truthPlayerId: truthPlayer.id,
      currentPromptIndex: Math.floor(Math.random() * 題目數量),
    });
  }
  
  export async function setRoomPhase(
    roomCode: string,
    phase: RoomData["phase"]
  ) {
    const roomRef = doc(db, "rooms", roomCode);
    await updateDoc(roomRef, { phase });
  }