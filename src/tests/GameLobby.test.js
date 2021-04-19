import React from 'react';
import { render } from "@testing-library/react";
import GameLobby from "../pages/game/components/GameLobby";

it("does not have enough players", async() => {
  const { container } = render(<GameLobby roomId={"asdfg"}
    sessionId={0}
    hostPlayerClientId={0}
    players={[]}
    maxPlayers={10}
    onChangeName={() => {}}
    onStartGame={() => {}} />);

  expect(container.querySelector("button").textContent).toEqual("Need More Players");
});

it("has enough players", async () => {
  const { container } = render(<GameLobby roomId={"asdfg"}
    sessionId={0}
    hostPlayerClientId={0}
    players={[{}, {}, {}]}
    maxPlayers={10}
    onChangeName={() => {}}
    onStartGame={() => {}} />);

    expect(container.querySelector("button").textContent).toEqual("Start Game");
});

it("shows the correct number of players", async () => {
  const { container } = render(<GameLobby roomId={"asdfg"}
    sessionId={0}
    hostPlayerClientId={0}
    players={[{}, {}, {}]}
    maxPlayers={10}
    onChangeName={() => {}}
    onStartGame={() => {}} />);

    expect(container.querySelector("h5").textContent).toEqual("3 / 10 players");
});

it("shows a host button when host", async () => {
  const { container } = render(<GameLobby roomId={"asdfg"}
    sessionId={0}
    hostPlayerClientId={0}
    players={[{}, {}, {}]}
    maxPlayers={10}
    onChangeName={() => {}}
    onStartGame={() => {}} />);

    expect(container.querySelector("button")).not.toBeNull();
});

it("shows a host button when host", async () => {
  const { container } = render(<GameLobby roomId={"asdfg"}
    sessionId={999999}
    hostPlayerClientId={0}
    players={[{}, {}, {}]}
    maxPlayers={10}
    onChangeName={() => {}}
    onStartGame={() => {}} />);

    expect(container.querySelector("button")).toBeNull();
});