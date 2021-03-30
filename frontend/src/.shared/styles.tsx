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
  color: theme.palette.text.primary,
}));

export const CardTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontWeight: 600,
  fontSize: 15,
  color: theme.palette.text.primary,
}));

export const CardContentPrimary = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontWeight: 400,
  fontSize: 15,
  color: theme.palette.text.primary,
}));
