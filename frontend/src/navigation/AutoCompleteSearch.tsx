import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  createStyles,
  makeStyles,
  Theme,
  fade,
} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getTags } from '../utils/api';
import type { Tag } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchInput: {
      width: 300,
    },
  })
);

const AutoCompleteSearch = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState<boolean>(false);
  const [matchingTags, setMatchingTags] = React.useState<Tag[]>([]);
  const [search, setSearch] = React.useState<string>('');
  const [value, setValue] = React.useState<string | null>('');
  const [isPending, setPending] = React.useState<boolean>(false);
  const loading = open && isPending;

  React.useEffect(() => {
    if (search) {
      setPending(true);
      (async () => {
        const tags = await getTags(search);

        setMatchingTags(tags);
        setPending(false);
      })();
    }
  }, [search]);

  React.useEffect(() => {
    if (!open) {
      setMatchingTags([]);
    }
  }, [open]);

  return (
    <Autocomplete
      className={classes.searchInput}
      open={open}
      // value={value}
      // onChange={(_: any, newValue: string | null) => {
      //   return setValue(newValue);
      // }}
      inputValue={search}
      onInputChange={(event, newInputValue) => {
        setSearch(newInputValue.replace(/\s/g, ''));
      }}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      noOptionsText="No tags found."
      getOptionSelected={(option, value) => option.name === value.name}
      loading={loading}
      options={matchingTags}
      getOptionLabel={(option) => option.name}
      renderOption={(option, { selected }) => (
        <>
          <div>
            <span>{option.name}</span>
            <br />
            <span>{`${option.tag_count} rides`}</span>
          </div>
        </>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          // onChange={(e) => console.log(e)}
          label="Tag search"
          InputProps={{
            ...params.InputProps,
            startAdornment: <InputAdornment position="start">#</InputAdornment>,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default AutoCompleteSearch;
