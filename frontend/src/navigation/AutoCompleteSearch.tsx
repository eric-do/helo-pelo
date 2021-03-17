import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  createStyles,
  makeStyles,
  Theme,
  fade
} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getTags } from '../utils/api';
import type { Tag } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchInput: {
      width: 300
    },
  })
);

const AutoCompleteSearch = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState<boolean>(false);
  const [options, setOptions] = React.useState<Tag[]>([]);
  const [search, setSearch] = React.useState<string>('');
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      if (search) {
        const tags = await getTags(search)
        setOptions(tags);
      }
    })();

    return () => {
      active = false;
    }
  }, [search])

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      className={classes.searchInput}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      // getOptionSelected={(option, value) => option.name === value.name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Asynchronous"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
          />
      )}
      />
  )
}

export default AutoCompleteSearch;