import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CompetitionList from './competition-list';
import { act } from 'react-dom/test-utils';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
const mock = new MockAdapter(require('axios'));

describe('CompetitionList', () => {
  beforeEach(() => {
    mock.onGet('/api/competition').replyOnce(200, [
      {
        name: 'big fencing tournament',
        weapon: 'code'
      }
    ]).onGet('/api/competition').replyOnce(200, [
      {
        name: 'big fencing tournament',
        weapon: 'code'
      },
      {
        name: 'my new competition',
        weapon: 'COMPCODE'
      }
    ]);
  })
  it('should render successfully', async() => {
    await act(async () => {
      render(<MemoryRouter><CompetitionList/></MemoryRouter>);
    });
    expect(screen.getByText(/big fencing tournament/i)).toBeInTheDocument();
  });
  it('opens up add dialog', async() => {
    mock.onPut('/api/competition').reply(200)
    await act(async () => {
      await render(<MemoryRouter><CompetitionList/></MemoryRouter>, { container: document.body } );
      await userEvent.click(screen.getByTestId("add-button"));
    });
    expect(screen.getByText(/Add a Competition/i)).toBeInTheDocument();
    await act(async () => {
      await fireEvent.change(screen.getByTestId("name"), {target: {value: "my new competition"}});
      await fireEvent.change(screen.getByTestId("code"), {target: {value: "COMPCODE"}});
      await userEvent.click(screen.getByTestId("add-button-confirm"));
    });
    expect(screen.getByText(/my new competition/i)).toBeInTheDocument();
  });
});
