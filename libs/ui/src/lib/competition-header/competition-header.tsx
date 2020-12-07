import React from 'react';

import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

/* eslint-disable-next-line */
interface CompetitionHeaderProps {
  competition: any
}

const StyledCompetitionHeader = styled.div`
  color: pink;
`;

export function CompetitionHeader(props: CompetitionHeaderProps) {
  const competition = props.competition
  return (
    <StyledCompetitionHeader>
      <Card>
        <CardContent>
          <Typography gutterBottom>
            {competition.competitionDate}
          </Typography>
          <Typography variant="h5" component="h2">
            {competition.tournamentName} ({competition.competitionShortName})
          </Typography>
          <Typography variant="body2" component="p">
            Age Category {competition.ageCategory}
          </Typography>
          <Typography variant="body2" component="p">
            Competition Type {competition.competitionType}
          </Typography>
          <Typography variant="body2" component="p">
            Gender {competition.gender}
          </Typography>
          <Typography variant="body2" component="p">
            Weapon {competition.weapon}
          </Typography>
          <Typography variant="body2" component="p">
            Creator: {competition.creator}
          </Typography>
        </CardContent>
      </Card>
    </StyledCompetitionHeader>
  );
}

export default CompetitionHeader;
