import { Client } from 'colyseus.js'

const client = new Client('ws://localhost:2567')

let lobby = null

export async function joinLobby () {
  if (lobby !== null) return lobby

  lobby = await client.joinOrCreate('lobby')

  return lobby
}

let room = null
export async function hostGame () {
  if (room !== null) return

  room = await client.create('game_room')
  console.log('successfully created and joined', room)
}
