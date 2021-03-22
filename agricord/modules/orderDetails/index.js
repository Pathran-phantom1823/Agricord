import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ColorPropType,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import OrderContainer from 'modules/orderDetails/OrderContainer';
import {BasicStyles, Routes} from 'common';
import {color} from 'react-native-reanimated';
import Api from 'services/api';
import {connect} from 'react-redux';
import {Spinner} from 'components';
import styles from 'modules/orderDetails/Styles.js';
import TaskIcon from 'components/Products/TaskIcon.js';
import TaskButton from 'modules/generic/TaskButton.js';
import ProductCard from 'components/Products/thumbnail/ProductCard.js';
import _ from "lodash"

class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      isLoading: false,
      scannedProducts: 0
    };
  }

  componentDidMount() {
    this.getOrderDetails();
  }

  getOrderDetails = () => {
    const {selectedOrder} = this.props.state;
    let parameters = {
      condition: [{
        value: selectedOrder.id,
        column: 'order_request_id',
        clause: '='
      }]
    };
    this.setState({isLoading: true});
    Api.request(Routes.orderRequest, parameters, response => {
      this.setState({products: response.data, isLoading: false});
      this.sumProducts();
    }, error => {
      this.setState({
        products: [],
        isLoading: false
      })
    });
  };

  async sumProducts(){
    let qty = _.sumBy(this.state.products, function(el){
      return parseInt(el.qty)
    })
    await this.setState({scannedProducts: qty})
  }

  _renderProducts = () => {
    return this.state.products.map((product, index) => {
      return (
        <OrderContainer height={73} key={index}>
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}
          <View style={styles.ProductContainer}>
            <View style={styles.ProductDetailsContainer}>
              <Text style={styles.ProductNameTextStyle}>{product.title}</Text>
              <View style={styles.ProductDataContainer}>
                <Text
                  style={[
                    styles.ProductManufacturerTextStyle,
                    {color: '#B0B0B0'},
                  ]}>
                  {product.merchant}
                </Text>
              </View>
            </View>
            <View style={styles.ProductNumberOfItemsContainer}>
              <View
                style={{
                  height: 30,
                  width: 30,
                  backgroundColor: '#5A84EE',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 6,
                  borderColor: '#4570DD',
                }}>
                <Text style={styles.ProductNumberOfItemsTextStyle}>
                  {this.state.qty}
                </Text>
              </View>
            </View>
          </View>
        </OrderContainer>
      );
    });
  };


  renderProducts = () => {
    return this.state.products.map((item, index) => {
      return (
        <ProductCard
          item={{
            ...item,
            from: 'order'
          }}
          key={item.id}
          navigation={this.props.navigation}
          theme={'v3'}
        />
      );
    });
  };

  render() {
    const {selectedOrder} = this.props.state;
    console.log(selectedOrder, "===========iiii");
    const {parentNav} = this.props.navigation.state.params;
    return (
      <ImageBackground
        source={require('assets/backgroundlvl1.png')}
        style={styles.BackgroundContainer}>
        <View style={styles.OrderDetailsContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{
              height: '100%',
              width: '90%',
              alignItems: 'center',
              marginBottom: 100,
              marginLeft: '5%',
              marignRight: '5%',
              marginTop: 15
          }}>
              <OrderContainer
                title={selectedOrder.merchant_from.name}
                height={selectedOrder.status === 'pending' ? 140 : 180}>
                <View style={styles.Details}>
                  <View style={styles.DetailsTitleContainer}>
                    <Text style={styles.DetailsTextStyle}>
                      {selectedOrder.status === 'pending'
                        ? 'Delivery Due'
                        : 'Delivered By'}
                    </Text>
                  </View>
                  <View style={styles.DetailsTextContainer}>
                    <Text style={[styles.DetailsTextStyle, {color: '#000000'}]} numberOfLines={1}>
                      {selectedOrder.status === 'pending'
                        ? selectedOrder.date_of_delivery
                        : selectedOrder.delivered_by}
                    </Text>
                  </View>
                </View>
                <View style={styles.Details}>
                  <View style={styles.DetailsTitleContainer}>
                    <Text style={styles.DetailsTextStyle}>
                      {selectedOrder.status === 'pending'
                        ? 'Order'
                        : 'Delivery Date'}
                    </Text>
                  </View>
                  <View style={styles.DetailsTextContainer}>
                    <Text style={[styles.DetailsTextStyle, {color: '#000000'}]} numberOfLines={1}>
                      {selectedOrder.status === 'pending'
                        ? selectedOrder.order_number
                        : selectedOrder.date_of_delivery}
                    </Text>
                  </View>
                </View>
                {selectedOrder.status === 'pending' ? null : (
                  <View style={styles.Details}>
                    <View style={styles.DetailsTitleContainer}>
                      <Text style={styles.DetailsTextStyle}>
                        Product Scanned
                      </Text>
                    </View>
                    <View style={styles.DetailsTextContainer}>
                      <Text
                        style={[styles.DetailsTextStyle, {color: '#000000'}]} numberOfLines={1}>
                        {this.state.scannedProducts}
                      </Text>
                    </View>
                  </View>
                )}
              </OrderContainer>
              {this.renderProducts()}
            </View>
          </ScrollView>
        </View>

        <TaskButton navigation={this.props.navigation}/>

        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {};
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderDetails);
