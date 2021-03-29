import { Client } from "colyseus.js";

const client = new Client('ws://localhost:2567');

let lobby = null
let allRooms = []

export async function joinLobby () {
  if (lobby !== null) return

  lobby = await client.joinOrCreate("lobby")

  lobby.onMessage("rooms", rooms => {
    allRooms = rooms

    console.log("Received lobby rooms: ", rooms);
  })

  lobby.onMessage("+", ([roomId, room]) => {
    const roomIndex = allRooms.findIndex((room) => room.roomId === roomId);
    if (roomIndex !== -1) {
      allRooms[roomIndex] = room;
    } else {
      allRooms.push(room);
    }
  });
  
  lobby.onMessage("-", (roomId) => {
    allRooms = allRooms.filter((room) => room.roomId !== roomId);
  });

  return lobby
}