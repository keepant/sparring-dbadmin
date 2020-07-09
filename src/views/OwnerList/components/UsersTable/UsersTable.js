import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Button from '@material-ui/core/Button';
import { makeStyles, withStyles } from '@material-ui/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import IconButton from '@material-ui/core/IconButton';
import { colors } from '@material-ui/core';
import FsLightbox from 'fslightbox-react';

import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  iconBtn: {
    colorPrimary: colors.green[600],
    colorSecondary: colors.red[500]
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const UsersTable = props => {
  const { className, users, ...rest } = props;

  const classes = useStyles();

  const [selectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const BtnInfo = withStyles(theme => ({
    root: {
      color: theme.palette.getContrastText(colors.blue[600]),
      backgroundColor: colors.blue[600],
      '&:hover': {
        backgroundColor: colors.blue[900]
      }
    }
  }))(Button);

  const [toggler, setToggler] = useState(false);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Registration date</TableCell>
                  <TableCell>ID Card</TableCell>
                  <TableCell>Selfie</TableCell>
                  <TableCell>Selfie With ID</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(0, rowsPerPage).map(user => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={user.id}
                    selected={selectedUsers.indexOf(user.id) !== -1}>
                    <TableCell>
                      <div className={classes.nameContainer}>
                        <Typography variant="body1">{user.name}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {moment(user.created_at).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell>
                      <BtnInfo
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => setToggler(!toggler)}
                        startIcon={<VisibilityIcon />}>
                        Show
                      </BtnInfo>
                      <FsLightbox
                        toggler={toggler}
                        sources={[user.owner_doc.id_card]}
                      />
                    </TableCell>
                    <TableCell>                      
                      <BtnInfo
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => setToggler(!toggler)}
                        startIcon={<VisibilityIcon />}>
                        Show
                      </BtnInfo>
                      <FsLightbox
                        toggler={toggler}
                        sources={[user.owner_doc.photo]}
                      />
                    </TableCell>
                    <TableCell>
                      {' '}
                      <BtnInfo
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => setToggler(!toggler)}
                        startIcon={<VisibilityIcon />}>
                        Show
                      </BtnInfo>
                      <FsLightbox
                        toggler={toggler}
                        sources={[user.owner_doc.selfie_with_id]}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="verify"
                        className={classes.iconBtn}>
                        <CheckCircleIcon style={{ color: colors.green[600] }} />
                      </IconButton>
                      <IconButton aria-label="not" className={classes.iconBtn}>
                        <CancelRoundedIcon style={{ color: colors.red[600] }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={users.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
  );
};

UsersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default UsersTable;
