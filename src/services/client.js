import * as colyseus from 'colyseus.js'
import config from '../config'

const client = new colyseus.Client('ws://' + config.serverURL)

let lobby = null

/**
 * Connects to the Lobby room and creates it if it doesn't exist.
 *
 * @returns {Promise<Room>} Connected lobby room
 * @throws Error if failed to create lobby room for any reason
 */
export async function joinLobby () {
  if (lobby !== null) return lobby

  lobby = await client.joinOrCreate('lobby')

  return lobby
}

/**
 * Disconnect from the lobby.
 */
export function leaveLobby () {
  if (lobby === null) return

  lobby.removeAllListeners()
  lobby.leave()
  lobby = null
}

let gameRoom = null

/**
 * Creates a new game room and connects to it.
 *
 * @returns {Promise<Room>} Newly created and connected game room
 * @throws Error if failed to create room for any reason
 */
export async function hostGame () {
  if (gameRoom !== null) throw Error('Game room is not null!')

  leaveLobby()

  gameRoom = await client.create('game_room')

  return gameRoom
}

/**
 * Attempts to connect to game room identified by a room id.
 *
 * @param {string} roomId Unique identifier of game room, e.g. "OEGHW"
 * @returns {Promise<colyseus.Room>} Newly connected game room
 * @throws Error if game room doesn't exist or failed to connect
 */
export async function joinGameRoom (roomId) {
  leaveLobby()

  gameRoom = await client.joinById(roomId)

  // Save room id for reconnects
  window.localStorage.setItem('lastRoomId', roomId)
  window.localStorage.setItem('lastSessionId', gameRoom.sessionId)

  return gameRoom
}

/**
 * Attempt to reconnect to the last game room.
 */
export async function reconnectToGameRoom () {
  const lastRoomId = window.localStorage.getItem('lastRoomId')
  const lastSessionId = window.localStorage.getItem('lastSessionId')

  gameRoom = await client.reconnect(lastRoomId, lastSessionId)

  return gameRoom
}

/**
 * Return the currently connected game room or null if not connected.
 *
 * @returns {colyseus.Room} Currently connected game room
 */
export function getGameRoom () {
  return gameRoom
}

export function leaveGameRoom () {
  if (gameRoom === null) return

  window.localStorage.removeItem('lastRoomId')
  window.localStorage.removeItem('lastSessionId')

  gameRoom.removeAllListeners()
  gameRoom.leave()
  gameRoom = null
}
