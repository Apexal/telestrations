import React from 'react';
import { Client } from 'colyseus.js'
import { render } from "@testing-library/react";
import { getGameRoom, hostGame, joinLobby, leaveGameRoom } from '../services/client';

let client = null
let lobby = null
let gameRoom = null

beforeAll(async () => {
  client = new Client('ws://localhost:2567')
});

afterAll(() => {
  client = null
  lobby = null
  gameRoom = null
});

it("can connect to lobby", async () => {
  lobby = await joinLobby();

  expect(lobby).not.toBeNull();
});
