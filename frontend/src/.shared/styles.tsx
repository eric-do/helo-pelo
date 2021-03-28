import {
  makeStyles,
  Theme,
  createStyles,
  styled,
  withTheme
} from '@material-ui/core/styles';
import { red, purple, blue } from '@material-ui/core/colors';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Chip,
  Badge,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@material-ui/core';
const primaryFontColor = 'white';
const primaryBrandColor = blue[200];
const secondaryBrandColor = red[200];

export const ListContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('sm')]: {
    width: '94%',
  },
  [theme.breakpoints.up('md')]: {
    width: '60%',
  },
}));

export const SiteCardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));


export const SiteCard = styled(Card)(({ theme }) => ({
  width: '100%',
  marginTop: 20,
  backgroundColor: 'rgba(255,255,255,0.05)',
}));

export const SiteCardHeader = styled(CardHeader)(({ theme }) => ({
  textAlign: 'center',
  fontWeight: 600,
  fontSize: 15,
  color: primaryFontColor,
}));

export const CardTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontWeight: 600,
  fontSize: 15,
  color: primaryFontColor,
}));

export const CardContentPrimary = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontWeight: 400,
  fontSize: 15,
  color: primaryFontColor,
}));

export const makeCardListStyles = makeStyles((theme: Theme) =>
  createStyles({
    listContainer: {
      display: 'flex',
      flexDirection: 'column',
      [theme.breakpoints.down('sm')]: {
        width: '94%',
      },
      [theme.breakpoints.up('md')]: {
        width: '60%',
      },
    },
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    rideCard: {
      width: '100%',
      marginTop: 20,
      backgroundColor: 'rgba(255,255,255,0.05)',
    },
    avatar: {
      backgroundColor: red[500],
    },
    media: {
      height: 0,
      paddingTop: '56.25%',
    },
    cardHeader: {
      textAlign: 'center',
      fontWeight: 600,
      fontSize: 15,
      color: primaryFontColor,
    },
    cardSubheader: {
      textAlign: 'center',
      color: primaryFontColor,
      fontSize: 12,
    },
    cardContent: {
      textAlign: 'left',
      color: primaryFontColor,
      marginBottom: 10,
    },
    iconButton: {
      color: primaryBrandColor,
      '&:hover, &.Mui-focusVisible': {
        backgroundColor: 'rgba(255,255,255,0.12)',
      },
    },
    icon: {
      color: primaryFontColor,
    },
  })
);

