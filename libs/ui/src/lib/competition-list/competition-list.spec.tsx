import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CompetitionList from './competition-list';
import { act } from 'react-dom/test-utils';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
const mock = new MockAdapter(require('axios'));

describe('CompetitionList', () => {
  beforeEach(() => {
    mock.onGet('/api/competition').reply(200, [
      {
        name: 'big fencing tournament',
        weapon: 'code'
      }
    ]);
  })
  it('should render successfully', async() => {
    mock.onGet('/api/competition').reply(200, [
      {
        name: 'big fencing tournament',
        weapon: 'code'
      }
    ]);
    await act(async () => {
      render(<MemoryRouter><CompetitionList/></MemoryRouter>);
    });
    expect(screen.getByText(/big fencing tournament/i)).toBeInTheDocument();
  });
  it('opens up add dialog', async() => {
    await act(async () => {
      await render(<MemoryRouter><CompetitionList/></MemoryRouter>, { container: document.body } );
      await userEvent.click(screen.getByTestId("add-button"));
    });
    expect(screen.getByText(/Add a Competition/i)).toBeInTheDocument();
  });
});
