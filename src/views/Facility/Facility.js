import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { getCourtFacilities } from 'graphql/queries/court';
import { SemipolarLoading } from 'react-loadingg';
import { useQuery } from '@apollo/react-hooks';
import { InputFacility, TableFacility } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },

  content: {
    marginTop: theme.spacing(2)
  }
}));

const Facility = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(getCourtFacilities);

  if (loading) {
    return <SemipolarLoading />;
  }

  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }

  const facility = data.court_facilities;

  return (
    <div className={classes.root}>
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

export default Facility;
