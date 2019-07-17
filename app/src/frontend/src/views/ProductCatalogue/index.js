import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

import ProductCard from '../../components/ProductCard';
import { ProductCatalogueWrapper } from './style';
import ProductClient from '../../lib/api/client';
import { productAPIConfig } from '../../config.js';

const styles = theme => ({
    progress: {
      margin: theme.spacing.unit * 2,
    },
    typography: {
        useNextVariants: true,
      },
  });
class ProductCatalogue extends React.Component {
    constructor(props) {
        super(props)
        this.client = new ProductClient(productAPIConfig(window))
        this.state = {
            products: [],
            version: 'v1'
        }
    }
    componentDidMount() {
        this.props.listProducts()
        .then(result => this.setState({products: result.data.products}));
    }
    componentDidUpdate(prevProps) {
        if (this.props.lastUpdated !== prevProps.lastUpdated && this.state.products.length === 0) {
            this.props.listProducts()
                .then(result => this.setState({products: result.data.products})); 
        }
    }
    render() {
        const { classes } = this.props;
        return (
        <ProductCatalogueWrapper>{this.state.products ?
        this.state.products.map(id => 
            <ProductCard
                lastUpdated={this.props.lastUpdated}
                informationUri={`${productAPIConfig(window).informationUri}/v1`}
                key={id}
                fetch={this.props.getProduct(id)}
        />) : <CircularProgress className={classes.progress} />}</ProductCatalogueWrapper>)
    }
}

export default withStyles(styles)(ProductCatalogue);