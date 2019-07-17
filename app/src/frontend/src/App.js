import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import { createMuiTheme } from '@material-ui/core/styles';
import { RequestConsumer } from './request-context';
import ProductCatalogue from './views/ProductCatalogue';
import { AppView } from './style';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  menuStyle: {
    border: '1px solid white'
  },
  notchedOutline: {
    borderColor: 'white !important',
  },
  overrides: {
    MuiFormLabel: {
      root: {
        color: 'white',
        borderColor: 'white',
      }
    },
    MuiFormControl: {
      root: {
        color: 'white',
        borderColor: 'white',
      }
    },
    MuiPrivateNotchedOutline: {
      root: {
        borderColor: 'white !important',
        borderRadius: 2
      }
    },
    MuiOutlinedInput: {
      input: {
        color: 'white',
        borderColor: 'white'
      }
    },
    MuiSelect: {
      filled: {
        color: 'white'
      },
      icon: {
        fill: 'white'
      },
    }
  },
  palette: {
    type: 'light',
    primary: {
      light: '#ffffff',
      main: '#ffffff',
      dark: '#ffffff',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffffff',
      main: '#ffffff',
      dark: '#ffffff',
      contrastText: '#000',
    },
  },
});

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  refreshButton: {
    marginRight: 20,
    marginLeft: 10,
    height: 48,
  },
  menuLogo: {
    fontSize: '32px'
  },
  formControl: {
    margin: 10,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: 10 * 2,
  },
  typography: {
    useNextVariants: true,
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
});
function getModalStyle() {
  const top = 15;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${left}%, -${top}%)`,
  };
}
function getJWTModalStyle() {
  const top = 15;
  const left = 50;

  return {
    top: `${top}%`,
    width: '50%',
    height: '40%',
    wordBreak: 'break-all',
    left: `${left}%`,
    overflowX: 'scroll',

    transform: `translate(-${left}%, -${top}%)`,
  };
}
class App extends React.Component {
  state = {
    left: false,
    selectedApp: 'Products',
    anchorEl: null,
    labelWidth: 0,
    userAgentLabelWidth: 0,
    versionLabelWidth: 0,
    appLastUpdate: new Date(),
  }

  handleRefresh = () => {
    console.log('refreshing')
    this.setState({appLastUpdate: new Date()})
  }
  componentDidMount() {
      this.setState({
      })
  }
  render() {
    const { classes } = this.props;
    const productMenu = (<div style={{ display: 'flex', justifyItems: 'center', alignItems: 'center'}}>
      <IconButton onClick={this.handleRefresh} className={classes.refreshButton} color="inherit" aria-label="Menu">
      <RefreshIcon />
    </IconButton>
    </div>
    )
    return (<RequestConsumer>{({ getProduct, listProducts }) => (
      <div className={classes.root}>
        <AppBar position="static">
            {productMenu}
        </AppBar>
        <AppView>
          <ProductCatalogue
            getProduct={(id) => getProduct(id)}
            listProducts={() => listProducts()}
            lastUpdated={this.state.appLastUpdate}
            />
        </AppView>
      </div>)}
     </RequestConsumer>);
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);