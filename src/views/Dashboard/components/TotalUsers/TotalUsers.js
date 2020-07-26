import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import { getCountUsers } from 'graphql/queries/count';
import { SemipolarLoading } from 'react-loadingg';
import { useQuery } from '@apollo/react-hooks';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    height: '90%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.warning.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  differenceIcon: {
    color: theme.palette.success.dark
  },
  differenceValue: {
    color: theme.palette.success.dark,
    marginRight: theme.spacing(1)
  }
}));

const TotalUsers = props => {
  const { className, history, ...rest } = props;

  const classes = useStyles();
  const { loading, error, data } = useQuery(getCountUsers);

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

    return <div>{error.message}</div>;
  }

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent>
        <Grid container justify="space-between">
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2">
              TOTAL USERS
            </Typography>
            <Typography variant="h3">
              {data['users_aggregate']['aggregate']['count']}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <PeopleIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TotalUsers.propTypes = {
  className: PropTypes.string
};

export default withRouter(TotalUsers);
