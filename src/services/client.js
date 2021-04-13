import { Client } from 'colyseus.js'

const client = new Client('ws://localhost:2567')

let lobby = null

export async function joinLobby () {
  if (lobby !== null) return lobby

  lobby = await client.joinOrCreate('lobby')

  return lobby
}

let gameRoom = null

export async function hostGame () {
  if (gameRoom !== null) return

  gameRoom = await client.create('game_room')

  return gameRoom
}

export async function joinGameRoom (roomId) {
  gameRoom = await client.joinById(roomId)

  // Save room id for reconnects
  window.localStorage.setItem('lastRoomId', roomId)

  return gameRoom
}

export function getGameRoom () {
  if (gameRoom == null) throw Error('Game room is null!')
  return gameRoom
}
