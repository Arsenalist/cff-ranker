import React from 'react';
import { act } from 'react-dom/test-utils';
import MockAdapter from 'axios-mock-adapter';
import { ViewCompetition } from '@cff/ui';
import { MemoryRouter, Route } from "react-router-dom";
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event';
import { CompetitionStatus } from '@cff/api-interfaces';

const mock = new MockAdapter(require('axios'));

describe('<ViewCompetition/>', () => {
  beforeEach(()=> {
    mock.reset()
  })
  it('no warnings to be shown', async () => {
    mock.onGet("/api/competition/cid").reply(200, {
      results:[{
            name: "Alice",
            surname: "Angel",
            warnings: []}]
      }
    );
    await act(async () => {
      render(<MemoryRouter initialEntries={["/cid"]}><Route path="/:id"><ViewCompetition /></Route></MemoryRouter>);
    });
    expect(screen.getByTestId("approve-button")).toBeEnabled()
    expect(screen.getByTestId("reject-button")).toBeEnabled()
    expect(screen.getByText(/This competition has no warnings and can be approved/i)).toBeInTheDocument();
    expect(screen.getByText(/Alice Angel/i)).toBeInTheDocument();
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
      render(<MemoryRouter initialEntries={["/cid"]}><Route path="/:id"><ViewCompetition /></Route></MemoryRouter>);
    });
    expect(screen.getByTestId("approve-button")).toBeDisabled()
    expect(screen.getByTestId("reject-button")).toBeEnabled()
    expect(screen.getByText(/Fix the warnings to approve competition/i)).toBeInTheDocument();
    expect(screen.getByText(/Alice Angel/i)).toBeInTheDocument();
    expect(screen.getByText(/warning message/i)).toBeInTheDocument();
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
      render(<MemoryRouter initialEntries={["/cid"]}><Route path="/:id"><ViewCompetition /></Route></MemoryRouter>);
    });
    expect(screen.getByTestId("edit-button")).toBeInTheDocument();
  });
  it('approve competition', async () => {
    mock.onGet("/api/competition/cid").replyOnce(200, {
        status: CompetitionStatus.pending,
        results:[{
          name: "Bob",
          surname: "Angel",
          warnings: []}]
      }
    ).onGet("/api/competition/cid").replyOnce(200, {
        status: CompetitionStatus.approved,
        results:[{
          name: "Blue",
          surname: "Angel",
          warnings: []}]
      }
    );
    mock.onPost("/api/competition/status").reply(200);
    await act(async () => {
      render(<MemoryRouter initialEntries={["/cid"]}><Route path="/:id"><ViewCompetition /></Route></MemoryRouter>);
    });
    await act(async () => {
      await userEvent.click(screen.getByTestId("approve-button"));
    });
    expect(screen.getByTestId("approved-chip")).toBeInTheDocument()
    expect(screen.getByText(/Approved Competition/i)).toBeInTheDocument();
  });
});
