import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter, Route } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import { Ranking, Weapon } from '@cff/api-interfaces';
import '@testing-library/jest-dom';
import Rankings from './rankings';

const mock = new MockAdapter(require('axios'));

const ranking1: Ranking = {
  _id: "1",
  ageCategory: {name: "senior age category", code: "senior", yearOfBirth: 2020, minimumForce: 20},
  weapon: Weapon.Fleuret,
  ranks: []
}

describe('Rankings', () => {

  beforeEach(() => {
    mock.reset()
  });

  it('should show rankings', async() => {
    const rankingJobId = "rankingJobId"
    mock.onGet(`/api/rankings/jobs/${rankingJobId}`).replyOnce(200, [ranking1])
    await act(async () => {
      await render(<MemoryRouter initialEntries={[`/rankings/jobs/${rankingJobId}`]}><Route path="/rankings/jobs/:id"><Rankings /></Route></MemoryRouter>);
    });
    expect(screen.getByText(ranking1.ageCategory.name)).toBeInTheDocument();
    expect(screen.getByText(ranking1.weapon)).toBeInTheDocument();
  });
});
