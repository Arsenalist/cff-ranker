import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter, Route } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import { Ranking, Weapon } from '@cff/api-interfaces';
import '@testing-library/jest-dom';
import { Ranking as RankingComponent } from '@cff/ui';

const mock = new MockAdapter(require('axios'));

const ranking: Ranking = {
  _id: "id",
  weapon: Weapon.Fleuret,
  ageCategory: {name: "senioragecategory", code: "senior", yearOfBirth: 2020, minimumForce: 20},
  ranks: [
    {
      points: 100,
      player: {firstName: 'Jim', lastName: 'Jimborie', cffNumber: 'CF01-1234'}
    }
  ]
}
describe('Ranking', () => {

  beforeEach(() => {
    mock.reset()
  });

  it('should show a ranking', async() => {
    const rankingId = "rankingId"
    mock.onGet(`/api/rankings/ranking/${rankingId}`).replyOnce(200, ranking)
    await act(async () => {
      await render(<MemoryRouter initialEntries={[`/rankings/ranking/${rankingId}`]}><Route path="/rankings/ranking/:id"><RankingComponent /></Route></MemoryRouter>);
    });
    expect(screen.getByText(ranking.ageCategory.name)).toBeInTheDocument();
    expect(screen.getByText(ranking.weapon)).toBeInTheDocument();
    expect(screen.getByText(`${ranking.ranks[0].player.firstName} ${ranking.ranks[0].player.lastName}`)).toBeInTheDocument();
    expect(screen.getByText(ranking.ranks[0].player.cffNumber)).toBeInTheDocument();
  });
});
