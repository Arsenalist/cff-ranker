import React from 'react';
import { render, screen } from '@testing-library/react';
import RankingJobs from './ranking-jobs';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import { RankingJob } from '@cff/api-interfaces';
import '@testing-library/jest-dom';

const mock = new MockAdapter(require('axios'));

const rankingJob1: RankingJob = { _id: '1', user: 'someUser1', dateGenerated: new Date()};
const rankingJob2: RankingJob = { _id: '2', user: 'someUser2', dateGenerated: new Date(), startDate: new Date(1980, 6, 5), endDate: new Date(1981, 3, 10) };

describe('RankingJobs', () => {
  beforeEach(() => {
    mock.reset()
  });
  it('shows ranking jobs', async () => {
    mock.onGet('/api/rankings/jobs').replyOnce(200, [rankingJob1])
    await act(async () => {
      await render(<RankingJobs/>);
    });
    expect(screen.getByText(rankingJob1.user)).toBeInTheDocument();
  });

  it('ranking job is added afer calling rank', async () => {
    mock.onGet('/api/rankings/jobs').replyOnce(200, [rankingJob1]).
         onGet('/api/rankings/jobs').replyOnce(200, [rankingJob1, rankingJob2])
    mock.onPost('/api/rank').reply(200)
    await act(async () => {
      await render(<RankingJobs/>);
      await userEvent.click(screen.getByTestId("rank-button"));
    });
    expect(screen.getByText(rankingJob1.user)).toBeInTheDocument();
    expect(screen.getByText(rankingJob2.user)).toBeInTheDocument();
    expect(screen.getByText("1980-07-05 - 1981-04-10")).toBeInTheDocument();
  });
});
