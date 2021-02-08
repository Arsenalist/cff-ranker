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
    mock.onGet('/api/competition-results').reply(200, [
      {
        _id: "id",
        tournamentName: 'tourney name',
        competitionDate: '2020-12-10T05:00:00.000+00:00',
        ageCategory: {name: 'Senior'},
        weapon: 'sword',
        status: 'approved'
      }
    ]);
    await act(async () => {
      render(<MemoryRouter><CompetitionResultsList/></MemoryRouter>);
    });
    expect(screen.getByText(/tourney name/i)).toBeInTheDocument();
    expect(screen.getByText(/2020-12-10/i)).toBeInTheDocument();
    expect(screen.getByText(/sword/i)).toBeInTheDocument();
    expect(screen.getByText(/Approved/)).toBeInTheDocument();
  });
});
