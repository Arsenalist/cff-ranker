import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import MockAdapter from 'axios-mock-adapter';
import { ViewCompetition } from './competition';
import { MemoryRouter, Route } from "react-router-dom";
import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event';

const mock = new MockAdapter(require('axios'));

describe('<ViewCompetition/>', () => {
  let container
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it('no warnings to be shown', async () => {
    mock.onGet("/api/competition/cid").reply(200, {
      results:[{
            name: "Alice",
            surname: "Angel",
            warnings: []}]
      }
    );
    await act(async () => {
      render(<MemoryRouter initialEntries={["/cid"]}><Route path="/:id"><ViewCompetition /></Route></MemoryRouter>, container);
    });
    expect(screen.getByTestId("approve-button")).toBeEnabled()
    expect(screen.getByTestId("reject-button")).toBeEnabled()
    expect(container.textContent).toContain("This competition has no warnings and can be approved.")
    expect(container.textContent).toContain("Alice Angel")
  });

  it('no warnings to be shown', async () => {
    mock.onGet("/api/competition/cid").reply(200, {
        results:[{
          name: "Alice",
          surname: "Angel",
          warnings: [{type: 'warning message'}]}]
      }
    );
    await act(async () => {
      render(<MemoryRouter initialEntries={["/cid"]}><Route path="/:id"><ViewCompetition /></Route></MemoryRouter>, container);

    });
    expect(screen.getByTestId("approve-button")).toBeDisabled()
    expect(screen.getByTestId("reject-button")).toBeEnabled()
    expect(container.textContent).toContain("Fix the warnings to approve competition.")
    expect(container.textContent).toContain("Alice Angel")
    expect(container.textContent).toContain("warning message")
  });

  it('edit button shows popup', async () => {
    mock.onGet("/api/competition/cid").reply(200, {
        results:[{
          name: "Alice",
          surname: "Angel",
          warnings: [{type: 'warning message'}]}]
      }
    );
    await act(async () => {
      render(<MemoryRouter initialEntries={["/cid"]}><Route path="/:id"><ViewCompetition /></Route></MemoryRouter>, container);
    });
    await act(async () => {
      await userEvent.click(container.querySelector('[data-testid="edit-button"]'))
    });
    // assert something here some time
  });
});
