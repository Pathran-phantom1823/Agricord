import React,  {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle, faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import { Color, BasicStyles } from 'common';
import Style from './Style.js';
import Message from 'modules/modal/MessageModal.js';
import Draggable from 'react-native-draggable';
import { remove } from 'lodash';
const COLORS = ['#FFC700', '#5A84EE', '#9AD267'];

class MixCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      message : false,
      text: ''
    }
  }

  removePad = () => {
    this.props.removePaddock(this.props.from, this.props.data.item)
  }

  messageModal = () => {
    this.state.message = true
  }

  closeModal = () => {
    this.setState({message: false})
    this.props.data.item.partial = false
  }

  fun = (data) => {
    this.setState({ text: data})
    console.log('asdfasdfasdfasdf', this.state.text)
  }

  componentDidMount(){

  }

  render = () => {
    const { data, hasCheck, totalRate, maxRate } = this.props;
    const partials = parseFloat(data.item.remaining_area - (totalRate - maxRate)).toFixed(2)
    let borderColor = ''
    if (data != null) {
      const color_idx = (+data.index % COLORS.length)
      borderColor = COLORS[color_idx]
    }

    return (
          <TouchableOpacity
            style={[Style.mixCardContainer, {
              zIndex: 999
            }]}
            onLongPress={() => {
              this.props.addToSelected(data.item)
            }} 
          >
              <View style={
                [ Style.mixTitle, 
                { borderBottomWidth: 3, borderBottomColor: borderColor }]
              }>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[Style.textBold, {
                    marginRight: 5,
                    fontSize: BasicStyles.standardTitleFontSize
                   }]}>
                    {data?.item?.name}
                  </Text>
                  {
                    hasCheck && (
                      <FontAwesomeIcon
                        size={16}
                        icon={faCheckCircle}
                        color={'#BBF486'}
                      />
                    )
                  }
                </View>
                <View style={{
                  flexDirection: 'row'
                }}>
                  {
                    (data && data.item.partial_flag && this.props.from == 'selected') && (
                      <TouchableOpacity
                        onPress={() => this.props.onPartialChange(data.item)}>
                        <View style={{
                          flexDirection: 'row',
                          marginLeft: 10,
                          marginRight: 10
                        }}>
                          <FontAwesomeIcon
                            size={16}
                            icon={data.item.partial ? faCheckSquare : faSquare}
                            color={data.item.partial ? Color.blue : Color.white}
                            style={{
                              borderWidth: data.item.partial ? 0 : 1,
                              borderColor: data.item.partial ? Color.blue : Color.gray
                            }}
                          />
                          <Text style={{
                            fontSize: BasicStyles.standardFontSize,
                            marginLeft: 5
                          }}>Partial</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  }

                  {
                    this.props.from == 'selected' && (
                      <TouchableOpacity
                        onPress={() => this.removePad() }>
                        <FontAwesomeIcon
                          size={16}
                          icon={faTimesCircle}
                          color={'#C4C4C4'}
                        />
                      </TouchableOpacity>
                    )
                  }
                </View>
                
              </View>
              <View style={Style.mixDetails}>
                <View style={Style.mixLeftDetail}>
                  <View style={Style.detailRow}>
                    <Text style={[Style.textBold, { color: '#969696', fontSize: BasicStyles.standardFontSize }]}>
                      Crop
                    </Text>
                    <Text style={{ fontSize: BasicStyles.standardFontSize }}>
                      {data?.item?.crop_name}
                    </Text>
                  </View>
                  <View style={Style.detailRow}>
                    <Text style={[Style.textBold, { color: '#969696', fontSize: BasicStyles.standardFontSize }]}>
                      Area
                    </Text>
                    <Text style={{ fontSize: BasicStyles.standardFontSize }}>
                    {data?.item?.area + ' ' + data?.item?.units} 
                    </Text>
                  </View>
                </View>
                {
                  data.item.partial == true && (
                      <View style={Style.mixRightDetail}>
                        <View style={[Style.remainingBox, {
                          borderColor: Color.primary
                        }]}>
                          <Text style={{ color: '#5A84EE', fontSize: BasicStyles.standardFontSize, fontWeight: 'bold', marginBottom: 5 }}>
                            PARTIAL
                          </Text>
                          {/* <Text style={{ fontWeight: 'bold', fontSize: BasicStyles.standardTitleFontSize}}>
                            { partials >= 0 ? partials : this.messageModal() }
                          </Text> */}
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <TextInput
                              value={data.item.remaining_area}
                              placeholder={'00000'}
                              keyboardType={'numeric'}
                              maxLength={5}
                              style={{
                                fontWeight: 'bold',
                                width: 50,
                                fontSize: BasicStyles.standardTitleFontSize
                              }}
                              onChangeText={(input) => {
                                this.fun(input)
                              }}
                            />
                            <Text style={{ fontWeight: 'bold', fontSize: BasicStyles.standardTitleFontSize}}>
                              {data?.item?.units}
                            </Text>
                            {/* <TouchableOpacity
                              underlayColor={Color.gray} 
                              style={[{backgroundColor: Color.primary, width: '30%', marginRight: 5, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: 30, borderRadius: 5}]}
                              onPress={() => this.props.onClose()}
                              >
                              <Text style={{ color: Color.white}}>OK</Text>
                            </TouchableOpacity> */}
                          </View>
                          <View 
                            style={{
                              paddingLeft: 100
                            }}
                          >
                            { 
                              this.state.message === true ?
                                <Message
                                  visible={true}
                                  title={'Area too large'}
                                  message={`You've still selected too many hectares. \n\n\t Remove a whole paddock or complete a partial application on another paddock to continue.`}
                                  onClose={() => this.closeModal()}
                                /> : null 
                            }
                          </View>
                        </View>
                      </View>
                    )
                }
                {
                  data.item.partial == false && (
                    <View style={Style.mixRightDetail}>
                      <View style={Style.remainingBox}>
                        <Text style={{ color: '#5A84EE', fontSize: BasicStyles.standardFontSize, fontWeight: 'bold', marginBottom: 5 }}>
                          REMAINING AREA
                        </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: BasicStyles.standardTitleFontSize}}>
                          {data?.item?.remaining_area + ' ' + data?.item?.spray_mix_units}
                        </Text>
                      </View>
                    </View>
                  )
                }

              </View>
          </TouchableOpacity>
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
)(MixCard);
