import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import {
  Button,
  Card,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  makeStyles,
} from '@mui/material';

// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';

// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import { roles } from '../_mock/user';

// ----------------------------------------------------------------------

const permissionOptions = [
  {
    id: 1,
    name: 'Permission 1',
  },
  {
    id: 2,
    name: 'Permission 2',
  },
  {
    id: 3,
    name: 'Permission 3',
  },
  {
    id: 4,
    name: 'Permission 4',
  },
  {
    id: 5,
    name: 'Permission 5',
  },
  {
    id: 6,
    name: 'Permission 6',
  }
];


const TABLE_HEAD = [
  { id: 'name', label: 'Role', alignRight: false },
  { id: 'remark', label: 'Remark', alignRight: false },
  { id: 'Actions', alignRight: true },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function RolePage() {
  const [data, setData] = useState(roles);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [visible, setVisible] = useState(false);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [mode, setMode] = useState();

  const handleOpenMenu = (event, record) => {
    setOpen(event.currentTarget);
    setSelectedEntry(record);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedEntry((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleCheckboxChange = (id, status) => {
    setSelectedEntry((prevFormData) => {
      if (status) {
        return {
          ...prevFormData,
          permission: [
            ...prevFormData.permission,
            id
          ]
        }
      }
      return {
        ...prevFormData,
        permission: prevFormData.permission.filter((item) => item !== id)
      }
    })
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setData((prev) => {
      return prev?.map((item) => {
        if (item?.id === selectedEntry?.id) {
          return selectedEntry;
        }
        return item;
      });
    })
    setMode(); setSelectedEntry(null)
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - roles.length) : 0;

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleDeleteUser = (id) => {
    setData((prev) => {
      return prev?.filter((item) => item?.id !== id)
    })
  }

  const handleDialogClose = (showToast = false) => {
    setOpenDialog(false);
    if (showToast === true) {
      handleDeleteUser(selectedEntry?.id)
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (mode) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [mode])

  return (
    <>
      <Helmet>
        <title> Roles | Minimal UI </title>
      </Helmet>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackbar}
        onClose={handleSnackbarClose}
        message="Role deleted"
      />

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm role deletion?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the role "{selectedEntry?.name}"? The role will be deleted and removed from existing users.
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)}>Do not delete</Button>
          <Button onClick={() => handleDialogClose(true)} autoFocus>
            Confirm Deletion
          </Button>
        </DialogActions>
      </Dialog>


      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Role
          </Typography>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={data.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, remark, permission } = row;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox">
                        <TableCell component="th" scope="row" >
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </TableCell>

                        <TableCell align="left">{remark}</TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, {
                            id,
                            name,
                            remark,
                            permission
                          })}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => { setMode('View'); handleCloseMenu() }} >
          <Iconify icon={'ic:outline-remove-red-eye'} sx={{ mr: 2 }} />
          View
        </MenuItem>

        <MenuItem onClick={() => { setMode('Edit'); handleCloseMenu() }} >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={() => { setOpenDialog(true); handleCloseMenu() }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      {visible && <Drawer
        open
        anchor="right"
        onClose={() => { setMode(); setSelectedEntry(null) }}
        title='Role Details'
      >
        <form onSubmit={handleSubmit} style={{padding: "16px"}}>
          <div style={{fontSize: "24px", fontWeight: "500", marginBottom: "24px", paddingBottom: "8px", borderBottom: "1px solid #ccc"}}>{mode} Role</div>
          <div
          style={{padding: "16px 0"}}
          >
            <TextField
              label="Role Name"
              name="name"
              disabled={mode === 'View'}
              value={selectedEntry?.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <TextField
              label="Description"
              name="remark"
              multiline
              rows={4}
              disabled={mode === 'View'}
              value={selectedEntry?.remark}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <FormGroup>
              <FormLabel
                sx={{
                  mb: 1,
                  mt: 3,
                }}
              >
                Permissions
              </FormLabel>
              {permissionOptions.map((permission) => (
                <FormControlLabel
                  key={permission?.id}
                  control={
                    <Checkbox
                      name={permission?.name}
                      disabled={mode === 'View'}
                      checked={selectedEntry?.permission?.includes(permission?.id)}
                      onChange={(e)=> handleCheckboxChange(permission?.id, e.target.checked)}
                      value={permission?.id}
                    />
                  }
                  label={permission?.name}
                />
              ))}
            </FormGroup>
          </div>
          {mode === 'Edit' && <Button type="submit" color="primary" variant="contained" sx={{
            mt: 3,
          }}>
            Save
          </Button>}
        </form>
      </Drawer>}
    </>
  );
}
