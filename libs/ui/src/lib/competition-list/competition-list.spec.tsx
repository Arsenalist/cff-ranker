import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter, BrowserRouter, Router } from "react-router-dom";
import { CompetitionList } from './competition-list';
import '@testing-library/jest-dom'
const mock = new MockAdapter(require('axios'));
describe('<CompetitionList/>', () => {
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

  it('list is shown', async () => {
    mock.onGet("/api/competition").reply(200, [
      {
        tournamentName: 'tourney name',
      competitionDate: '12/12/2030',
      weapon: 'sword'}
    ]);
    await act(async () => {
      render(<MemoryRouter><CompetitionList /></MemoryRouter>, container);
    });
    expect(container.textContent).toContain("tourney name")
    expect(container.textContent).toContain("12/12/2030")
    expect(container.textContent).toContain("sword")
  });
});
