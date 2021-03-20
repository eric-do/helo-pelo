import React, { useContext } from 'react';
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
import { RideOptionsContext } from '../providers/RidesProvider';

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
  const [value, setValue] = React.useState<Tag | null>(null);
  const [isPending, setPending] = React.useState<boolean>(false);
  const loading = open && isPending;
  const { setOptions } = useContext(RideOptionsContext);

  const updateSelectedOption = (
    _: React.ChangeEvent<{}>,
    newValue: Tag | null
  ) => {
    setValue(newValue);
    setOptions({ tag: newValue ? newValue.name : '' });
  };

  React.useEffect(() => {
    let mounted = true;

    setPending(true);
    (async () => {
      const tags = await getTags(search);
      if (mounted) {
        setMatchingTags(tags);
        setPending(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [search]);

  return (
    <Autocomplete
      className={classes.searchInput}
      open={open}
      value={value}
      onChange={updateSelectedOption}
      inputValue={search}
      onInputChange={(event, newInputValue) => {
        setSearch(newInputValue.replace(/[^a-z0-9]/gi, ''));
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
