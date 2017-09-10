import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { Container, DeckSwiper, Left, Header, Thumbnail, Body, Content, Card, CardItem, Text, Button, Input, Spinner, CheckBox } from 'native-base';
//import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { MonoText } from '../components/StyledText';

import Slider from 'react-native-slider';

import Stars from 'react-native-stars';

import { apiConnector } from "../navigation/Connectors";

import theme from '../constants/Theme';

import colors from '../constants/Colors'

class ExploraScreen extends React.Component {
  static navigationOptions = {
    title: "Explora",
  };

  constructor(props) {

    super(props);
    this.state = {
      error: false,
      loading: true,
      coffees: [],
    };
  };

  componentDidMount() {
    this.props.Api.getCoffees().then(response => {

      if (response.ok) {
        console.log(response.data);
        this.setState({
          coffees: response.data,
          loading: false,
        })
      } else {

        this.setState({
          error: true,
          coffees: [],
          loading: false,
        })
      }
    });
  };

  render() {
    return (

      <Container>
        {
          this.state.loading ?
            (
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Spinner color='#FFCD30' />
              </View>
            ) : null
        }
        {
          this.state.coffees.length > 0 ?
            (
              <View>
                <DeckSwiper
                  dataSource={this.state.coffees}
                  renderItem={item =>
                    <Card style={{ elevation: 3 }}>
                      <CardItem>
                        <Left>
                          <Thumbnail source={{ uri: 'http://cafe504.com/wp-content/uploads/2017/06/logo504cafe.png' }} />
                          <Body>
                            <Text style={theme.text}>{item.brand.name}</Text>
                            <Text style={theme.text} note>{item.variety.description}</Text>
                          </Body>
                        </Left>
                      </CardItem>
                      <CardItem cardBody>
                        <Image style={{ height: 300, flex: 1 }} source={{ uri: item.image.url }} />
                      </CardItem>
                      <CardItem style={theme.exploraSwipeCard}>
                        <View style={theme.swipeCardFooter}>
                        <Icon name="arrow-up" style={{ color: colors.coffii }} />
                          <Text style={theme.text}>{item.altitude} mts.</Text>
                        </View>
                        <View style={theme.swipeCardFooter}>
                          <Icon name="star" style={{ color: colors.coffii }} />
                          <Text style={theme.text}>{item.avg_rating}</Text>
                        </View>
                        <View style={theme.swipeCardFooter}>
                        <Icon name="controller-record" style={{ color: colors.coffii }} />
                          <Text style={theme.text}>{item.roast}</Text>
                        </View>
                      </CardItem>
                    </Card>
                  }
                />
              </View>
            ) : null
        }
      </Container>
    );
  }

  // _renderCard(data) {
  //   return (
  //     <Card>
  //       <CardItem>
  //         <Left>
  //           <Thumbnail source={{ uri: 'Image URL' }} />
  //           <Body>
  //             <Text>{data.name}</Text>
  //             <Text note></Text>
  //           </Body>
  //         </Left>
  //       </CardItem>
  //       <CardItem cardBody>
  //         <Image source={{ uri: 'Image URL' }} style={{ height: 200, width: null, flex: 1 }} />
  //       </CardItem>
  //       <CardItem>
  //         <Left>
  //           <Button transparent>
  //             <Icon active name="thumbs-up" />
  //             <Text>12 Likes</Text>
  //           </Button>
  //         </Left>
  //         <Body>
  //           <Button transparent>
  //             <Icon active name="chatbubbles" />
  //             <Text>4 Comments</Text>
  //           </Button>
  //         </Body>
  //         <Right>
  //           <Text>11h ago</Text>
  //         </Right>
  //       </CardItem>
  //     </Card>
  //   )
  // }

  // render() {
  //   return (
  //     <View style={styles.container}>
  //       <ScrollView
  //         style={styles.container}
  //         contentContainerStyle={styles.contentContainer}>
  //         <Container>

  //           <Content>
  //             <View style={theme.searchInputContainer}>
  //               <Icon name="search" style={{ color: 'gray' }} />
  //               <Input placeholder="Search by Coffee Brand" style={theme.customInput} />
  //             </View>
  //             <View style={styles.container}>
  //               <ScrollView
  //                 style={styles.container}
  //                 contentContainerStyle={styles.contentContainer}>
  //                 <Content>
  //                   {
  //                     this.state.coffees.map(x => {
  //                       return this._renderCard(x);
  //                     })
  //                   }
  //                 </Content>
  //               </ScrollView>
  //             </View>
  //           </Content>
  //         </Container>
  //       </ScrollView>
  //     </View>
  //   );
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 5,
    paddingVertical: 4,
    paddingHorizontal: 6
  },
  startsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});


export default apiConnector(ExploraScreen);