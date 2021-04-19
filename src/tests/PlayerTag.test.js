import React from 'react';
import { render } from "@testing-library/react";
import PlayerTag from "../pages/game/components/PlayerTag";

it("renders with (You)", async() => {
  const { container } = render(<PlayerTag sessionId="0" isPlayer={true} isHost={true} displayName={"Mr. Jest"} />);

  expect(container.querySelector("div").textContent).toEqual("👑 Mr. Jest(You)");
});

it("renders with a crown when host", async () => {
  const { container } = render(<PlayerTag sessionId="0" isPlayer={true} isHost={true} displayName={"Mr. Jest"} />);

  expect(container.querySelector("span").textContent).toEqual("👑 Mr. Jest");
});

it("renders without a crown when not host", async () => {
  const { container } = render(<PlayerTag sessionId="0" isPlayer={true} isHost={false} displayName={"Mr. Jest"} />);

  expect(container.querySelector("span").textContent).toEqual("Mr. Jest");
});