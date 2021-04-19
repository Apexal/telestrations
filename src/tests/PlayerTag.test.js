import React from 'react';
import { render } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import PlayerTag from "../pages/game/components/PlayerTag";
/*
let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
*/
it("renders with a crown when host", async () => {
  const { container } = render(<PlayerTag sessionId="0" isPlayer={true} isHost={true} displayName={"Mr. Jest"} />);

  expect(container.querySelector("span").textContent).toEqual("👑 Mr. Jest");
});

it("renders without a crown when not host", async () => {
  const { container } = render(<PlayerTag sessionId="0" isPlayer={true} isHost={false} displayName={"Mr. Jest"} />);

  expect(container.querySelector("span").textContent).toEqual("Mr. Jest");
});