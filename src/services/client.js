import { Client, Room } from 'colyseus.js'

const client = new Client('ws://localhost:2567')

let lobby = null

/**
 * Connects to the Lobby room and creates it if it doesn't exist.
 *
 * @returns {Room} Connected lobby room
 * @throws Error if failed to create lobby room for any reason
 */
export async function joinLobby () {
  if (lobby !== null) return lobby

  lobby = await client.joinOrCreate('lobby')

  return lobby
}

let gameRoom = null

/**
 * Creates a new game room and connects to it.
 *
 * @returns {Room} Newly created and connected game room
 * @throws Error if failed to create room for any reason
 */
export async function hostGame () {
  if (gameRoom !== null) throw Error('Game room is not null!')

  gameRoom = await client.create('game_room')

  return gameRoom
}

/**
 * Attempts to connect to game room identified by a room id.
 *
 * @param {string} roomId Unique identifier of game room, e.g. "OEGHW"
 * @returns {Room} Newly connected game room
 * @throws Error if game room doesn't exist or failed to connect
 */
export async function joinGameRoom (roomId) {
  gameRoom = await client.joinById(roomId)

  // TODO: Save room id for reconnects
  window.localStorage.setItem('lastRoomId', roomId)

  return gameRoom
}

/**
 * Return the currently connected game room or throw an error if null.
 *
 * @returns {Room} Currently connected game room
 * @throws Error if game room is null
 */
export function getGameRoom () {
  if (gameRoom == null) throw Error('Game room is null!')
  return gameRoom
}
