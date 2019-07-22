import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ReactStars from 'react-stars'
import { 
    ProductHeader,
    ProductCardWrapper, 
    ProductImageWrapper, 
    ProductLoadingWrapper, 
    ProductPriceWrapper,
    ProductRatingCount,
    ProductRatingWrapper,
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
const ProductLoading = (props) => (
    <Card className={props.classes.card}>
<ProductLoadingWrapper>
    <div className="image-placeholder">
    </div>
    <div className="product-title"></div>
    <div className="product-description"></div>
</ProductLoadingWrapper>
</Card>)
const ProductRating = (props) => {
    const { rating, updateRating } = props
    const stars = (
        <ReactStars
            count={5}
            onChange={(value) => updateRating(value)}
            size={24}
            value={rating.average_rating}
            color2={'#ffd700'} />
    ) 
    return (props.rating ? <ProductRatingWrapper><MuiThemeProvider theme={theme}>{stars}</MuiThemeProvider><ProductRatingCount>({rating.total_ratings})</ProductRatingCount></ProductRatingWrapper> : null)
    }
const ProductImage = (props) => (<ProductImageWrapper onLoad={() => props.onLoad()} src={props.url} />)
class ProductCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            date: null,
            imageUri: '',

        }
    }
    componentDidMount() {
        this.props.fetch(this.props.id)
            .then(result => {
                // console.log(result.data)
                this.setState({ data: result.data,
                imageUri: `${this.props.imagesBaseURL}/${result.data.image_url}?${new Date()}` })
            })
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.version !== nextProps.version) {
            nextProps.fetch(this.props.id)
            .then(result => this.setState({
                loading: true,
                data: result.data,
                imageUri: `${this.props.imagesBaseURL}/${result.data.image_url}?${new Date()}` }))
        } else if (this.props.lastUpdated !== nextProps.lastUpdated ) {
            nextProps.fetch(this.props.id)
            .then(result => this.setState({
                loading: true,
                data: result.data,
                imageUri: `${this.props.imagesBaseURL}/${result.data.image_url}?${new Date()}` }))
        }
    }
    handleImageLoaded() {
        this.setState({ loading: false})
    }
    handleRatingUpdated(value) {
        this.props.updateRating(this.props.id, value)
        this.props.fetch(this.props.id).then(result => {
            console.log(result)
            this.setState({
            data: result.data
            })
        })
    }

    render() {
        const { classes, id } = this.props;
        const productImage = this.state.data ? <ProductImage onLoad={() => this.handleImageLoaded()} url={this.state.imageUri} /> : null
        const productRating = this.state.data ? (this.state.data.ratings ? <ProductRating updateRating={(value) => this.handleRatingUpdated(value)} id={id} rating={this.state.data.ratings} /> : null) : null;
        const productLoading = (<div><ProductLoading classes={classes}/><div style={{ display: 'none'}}>{productImage}</div></div>)
        const productCard = (this.state.data ?
        <Card className={classes.card}>
            <CardContent>
            <ProductHeader>
                {productImage}
            </ProductHeader>
            <Typography gutterBottom variant="headline" component="h2">
                {this.state.data.title}
            </Typography>
            <Typography component="p">
                {this.state.data.description}
            </Typography>
                {productRating}
            </CardContent>
        </Card> : null)
        return (
            <ProductCardWrapper key="front">{this.state.loading ? productLoading : productCard}</ProductCardWrapper>
        )
    }
}

export default withStyles(styles)(ProductCard);