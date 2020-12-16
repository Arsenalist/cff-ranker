import React from 'react';

import styled from 'styled-components';

/* eslint-disable-next-line */
export interface CompetitionListProps {}

const StyledCompetitionList = styled.div`
  color: pink;
`;

export function CompetitionList(props: CompetitionListProps) {
  return (
    <StyledCompetitionList>
      <h1>Welcome to competition-list!</h1>
    </StyledCompetitionList>
  );
}

export default CompetitionList;
