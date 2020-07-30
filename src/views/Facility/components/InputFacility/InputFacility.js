import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import { useMutation } from '@apollo/react-hooks';
import { addCourtFacility } from 'graphql/mutations/court';
import { getCourtFacilities } from 'graphql/queries/court';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

const schema = {
  name: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 50
    }
  }
};

const InputFacility = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const updateCache = (cache, { data }) => {
    const existingFacility = cache.readQuery({
      query: getCourtFacilities
    });
    const newFacility = data.insert_court_facilities.returning[0];
    cache.writeQuery({
      query: getCourtFacilities,
      data: {
        court_facilities: [newFacility, ...existingFacility.court_facilities]
      }
    });
  };

  const resetInput = () => {
    formState.values.name = '';
  };

  const [addFacility] = useMutation(addCourtFacility, {
    update: updateCache,
    onCompleted: resetInput
  });

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <Collapse in={open}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }>
          Facility added!
        </Alert>
      </Collapse>
      <form
        autoComplete="off"
        onSubmit={e => {
          e.preventDefault();
          addFacility({
            variables: {
              name: formState.values.name
            }
          });

          setOpen(true);
          formState.values.name = '';
        }}>
        <CardHeader subheader="Add court facility to app" title="Facility" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <TextField
                className={classes.textField}
                error={hasError('name')}
                fullWidth
                helperText={hasError('name') ? formState.errors.name[0] : null}
                label="Facility name"
                name="name"
                onChange={handleChange}
                type="name"
                value={formState.values.name || ''}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={!formState.isValid}>
            Add facility
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

InputFacility.propTypes = {
  className: PropTypes.string
};

export default InputFacility;
