import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { getCourtFacilities } from 'graphql/queries/court';
import { SemipolarLoading } from 'react-loadingg';
import { useQuery } from '@apollo/react-hooks';
import { InputFacility, TableFacility } from './components';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },

  content: {
    marginTop: theme.spacing(2)
  }
}));

const Facility = props => {
  const history = props;
  const classes = useStyles();
  const [network, setNetwork] = useState(false);
  const { loading, error, data } = useQuery(getCourtFacilities);

  if (loading) {
    return <SemipolarLoading />;
  }

  if (error) {
    console.error(error);
    if (
      error.message.includes('GraphQL error: Could not verify JWT: JWSError')
    ) {
      history.replace('/');
    }

    if (error.message.includes('Network error: Failed to fetch')) {
      setNetwork(true);
    }

    return <div>Error!</div>;
  }

  const facility = data.court_facilities;

  return (
    <div className={classes.root}>
      {network && <img alt="Logo" src="/images/logos/no-internet.png" />}
      <Grid container spacing={4}>
        <Grid item lg={6} md={6} xl={4} xs={12}>
          <InputFacility />
        </Grid>
        <Grid item lg={6} md={6} xl={8} xs={12}>
          <TableFacility facilities={facility} />
        </Grid>
      </Grid>
    </div>
  );
};

export default withRouter(Facility);
