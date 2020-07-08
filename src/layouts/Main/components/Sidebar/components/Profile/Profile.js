import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';
import { getAdmin } from 'graphql/queries/admin';
import { SemipolarLoading } from 'react-loadingg';
import { useQuery } from '@apollo/react-hooks';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  }
}));

const Profile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  var store = require('store');
  const userId = store.get('userId');
  const { loading, error, data } = useQuery(getAdmin, {
    variables: {
      'id': userId  
    }
  });

  if (loading) {
    return <SemipolarLoading />;
  }

  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }

  const user = {
    name: 'sparring </dev>',
    avatar: '/images/avatars/pp.png',
    bio: 'Admin'
  };

  var admin = data['admin'][0];
  

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Avatar
        alt="Person"
        className={classes.avatar}
        component={RouterLink}
        src={user.avatar}
        to="/dashboard"
      />
      <Typography className={classes.name} variant="h4">
        {admin.name}
      </Typography>
      <Typography variant="body2">{admin.role.toUpperCase()}</Typography>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
