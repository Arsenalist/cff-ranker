import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router-dom';
import { CompetitionResultsList } from '@cff/ui';
import '@testing-library/jest-dom';

const mock = new MockAdapter(require('axios'));
describe('<CompetitionList/>', () => {
  it('list is shown', async () => {
    mock.onGet('/api/competition').reply(200, [
      {
        tournamentName: 'tourney name',
        competitionDate: '12/12/2030',
        weapon: 'sword'
      }
    ]);
    await act(async () => {
      render(<MemoryRouter><CompetitionResultsList/></MemoryRouter>);
    });
    expect(screen.getByText(/tourney name/i)).toBeInTheDocument();
    expect(screen.getByText(/12\/12\/2030/i)).toBeInTheDocument();
    expect(screen.getByText(/sword/i)).toBeInTheDocument();
  });
});
