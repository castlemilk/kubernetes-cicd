import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Star from '@material-ui/icons/Star';
import StarHalf from '@material-ui/icons/StarHalf';
import ReactCardFlip from 'react-card-flip';
import { 
    ProductHeader,
    ProductCardWrapper, 
    ProductCardStockWrapper, 
    ProductImageWrapper, 
    ProductLoadingWrapper, 
    ProductPriceWrapper, 
    ProductRatingWrapper,
    ProductStockHeader,
    ProductStockTitle,
    ProductStockValue,
    ProductStockRestockTitle,
    ProductStockRestockValue,
    } from './style';
const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
      primary: {
        light: '#757ce8',
        main: '#000000',
        dark: '#002884',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#e91e63',
        dark: '#ba000d',
        contrastText: '#000',
      },
    },
  });
const styles = {
    card: {
      maxWidth: 200,
      margin: 20,
      height: 280,
    },
    media: {
      height: 140,
    },
    typography: {
        useNextVariants: true,
      },
  };
const stockAvailable = (information) => {
    if (information.stock) {
        if (information.stock.id) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}
const getColor = (color) => {
    switch(color) {
        case 'red':
            return 'secondary'
        case 'black':
            return 'primary'
        default:
            return 'primary'
    }
}
const ProductLoading = (props) => (
    <Card className={props.classes.card}>
<ProductLoadingWrapper>
    <div className="image-placeholder">
    </div>
    <div className="product-title"></div>
    <div className="product-description"></div>
</ProductLoadingWrapper>
</Card>)
const ProductPrice = (props) => {
    if (props.price >= 1.00) {
        return (<ProductPriceWrapper>{`${props.price}﹩`}</ProductPriceWrapper>)
    } else {
        return (<ProductPriceWrapper>{`${props.price * 100}¢`}</ProductPriceWrapper>)
    }
    

}
const ProductRating = (props) => {
    const color = getColor(props.color)
    const { rating, id } = props;
    var stars = []
    for ( var i = 0; i < (rating - (rating % 1)); i++ ) {
        stars.push(<Star color={color} key={`full-star-${id}-${i}`}/>)
    }
    if (rating % 1 !== 0) {
        stars.push(<StarHalf color={color} key={`half-star-${id}-${i}`} />)
    }
    return (props.rating ? <ProductRatingWrapper><MuiThemeProvider theme={theme}>{stars}</MuiThemeProvider></ProductRatingWrapper> : null)
    }
const ProductImage = (props) => (<ProductImageWrapper onLoad={() => props.onLoad()} src={props.url} />)
class ProductCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            imageUri: '',
        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
        e.preventDefault();
        this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }
    componentDidMount() {
        this.props.fetch
            .then(result => this.setState({ data: result.data,
                imageUri: `${this.props.informationUri}/image/${result.data.information.image}${new Date()}` }))
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.version !== nextProps.version) {
            nextProps.fetch
            .then(result => this.setState({
                loading: true,
                data: result.data,
                imageUri: `${this.props.informationUri}/image/${result.data.information.image}${new Date()}` }))
        } else if (this.props.lastUpdated !== nextProps.lastUpdated ) {
            nextProps.fetch
            .then(result => this.setState({
                loading: true,
                data: result.data,
                imageUri: `${this.props.informationUri}/image/${result.data.information.image}${new Date()}` }))
        }
    }
    handleImageLoaded() {
        this.setState({ loading: false})
    }

    render() {
        const { classes, id } = this.props;
        const productImage = this.state.data ? <ProductImage onLoad={() => this.handleImageLoaded()} url={this.state.imageUri} /> : null
        const productPrice = this.state.data ? (this.state.data.price ? <ProductPrice price={this.state.data.price.amount} /> : null) : null;
        const productRating = this.state.data ? (this.state.data.rating ? <ProductRating color={this.state.data.rating.color} id={id} rating={this.state.data.rating.average} /> : null) : null;
        const productLoading = (<div><ProductLoading classes={classes}/><div style={{ display: 'none'}}>{productImage}</div></div>)
        const productCard = (this.state.data ?
        <Card className={classes.card}>
            <CardContent>
            <ProductHeader>
                {productImage}
                {productPrice}
            </ProductHeader>
            <Typography gutterBottom variant="headline" component="h2">
                {this.state.data.information.name}
            </Typography>
            <Typography component="p">
                {this.state.data.information.description}
            </Typography>
                {productRating}
            </CardContent>
        </Card> : null)
        const productStockCard = this.state.data ? (this.state.data.information.stock ? 
        <Card className={classes.card}>
            <CardContent>
            <ProductStockHeader>
            Admin Information 
            </ProductStockHeader>
            <ProductStockTitle>
                Stock
            </ProductStockTitle>
            <ProductStockValue>
                {this.state.data.information.stock.stock}
            </ProductStockValue>
            <ProductStockRestockTitle>
                Restock Estimate
            </ProductStockRestockTitle>
            <ProductStockRestockValue>
            {`${this.state.data.information.stock.restockEstimate} days`}
            </ProductStockRestockValue>
            </CardContent>
        </Card> : null) : null
        return (
            <ReactCardFlip isFlipped={this.state.isFlipped}>
                <ProductCardWrapper key="front" onClick={this.state.data ? stockAvailable(this.state.data.information) ? this.handleClick : null : null}>{this.state.loading ? productLoading : productCard}</ProductCardWrapper>
                <ProductCardStockWrapper key="back" onClick={this.handleClick}>{this.state.loading ? productLoading : productStockCard}</ProductCardStockWrapper>
            </ReactCardFlip>
        )
    }
}

export default withStyles(styles)(ProductCard);