import * as colyseus from 'colyseus.js'
import config from '../config'

/**
 * Colyseus client that exposes limited functionality
 * to external users. Allows connecting to the lobby
 * and game rooms.
 */
class Client {
  constructor () {
    this.client = new colyseus.Client('wss://' + config.serverURL)
    this.lobby = null
    this.gameRoom = null
  }

  /**
   * Connects to the Lobby room and creates it if it doesn't exist.
   *
   * @returns {Promise<Room>} Connected lobby room
   * @throws Error if failed to create lobby room for any reason
   */
  async joinLobby () {
    if (this.lobby !== null) return this.lobby

    this.lobby = await this.client.joinOrCreate('lobby')

    return this.lobby
  }

  /**
   * Disconnect from the lobby.
   */
  leaveLobby () {
    if (this.lobby === null) return

    this.lobby.removeAllListeners()
    this.lobby.leave()
    this.lobby = null
  }

  /**
   * Creates a new game room and connects to it.
   *
   * @returns {Promise<Room>} Newly created and connected game room
   * @throws Error if failed to create room for any reason
   */
  async hostGame () {
    if (this.gameRoom !== null) throw Error('Game room is not null!')

    this.leaveLobby()

    this.gameRoom = await this.client.create('game_room')

    return this.gameRoom
  }

  /**
   * Attempts to connect to game room identified by a room id.
   *
   * @param {string} roomId Unique identifier of game room, e.g. "OEGHW"
   * @returns {Promise<colyseus.Room>} Newly connected game room
   * @throws Error if game room doesn't exist or failed to connect
   */
  async joinGameRoom (roomId) {
    this.leaveLobby()

    this.gameRoom = await this.client.joinById(roomId)

    // Save room id for reconnects
    window.localStorage.setItem('lastRoomId', roomId)
    window.localStorage.setItem('lastSessionId', this.gameRoom.sessionId)

    return this.gameRoom
  }

  /**
   * Attempt to reconnect to the last game room.
   */
  async reconnectToGameRoom () {
    const lastRoomId = window.localStorage.getItem('lastRoomId')
    const lastSessionId = window.localStorage.getItem('lastSessionId')

    this.gameRoom = await this.client.reconnect(lastRoomId, lastSessionId)

    return this.gameRoom
  }

  /**
   * Return the currently connected game room or null if not connected.
   *
   * @returns {colyseus.Room} Currently connected game room
   */
  getGameRoom () {
    return this.gameRoom
  }

  /**
   * Leave the currently connected game room or do nothing if not connected.
   */
  leaveGameRoom () {
    if (this.gameRoom === null) return

    window.localStorage.removeItem('lastRoomId')
    window.localStorage.removeItem('lastSessionId')

    this.gameRoom.removeAllListeners()
    this.gameRoom.leave()
    this.gameRoom = null
  }
}

export default new Client()
