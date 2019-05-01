import React from 'react';
import { StyleSheet, Text, View, FlatList, Platform, Image, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-gesture-handler'; 

import _ from 'lodash';

import axios from 'axios';
axios.defaults.baseURL = 'https://newsapi.org/v2';
axios.defaults.headers.common['Authorization'] = 'Bearer ebb279c9a1524095af6f6a1f514b5f0b';



export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '', refresh: true, news: [], isVisible: false, isEmpty: true };
    this.setVisible = (isVisible) => { this.setState({isVisible: isVisible}) }
    this.setEmpty = (isEmpty) => { this.setState({isEmpty: isEmpty}) }
    this.getNews = async news => {
      try {
        this.setVisible(true)
        this.setEmpty(false)
        const response = await axios.get('/everything', { params: { q: news, language: 'en' } })
        if(response && response.status === 200) {
          const data = response.data
          this.setNews(data.articles)
          if (data.articles.length === 0) this.setEmpty(true)
          this.setVisible(false)
        }
      } catch (error) {
        this.setVisible(false)
      }
    }
    this.newsForm = news => {
      this.debouncer(news)
      this.setState({text: news})
    }
    this.setNews = news => {
      this.setState({news: news})
    }
    this.getNewsAPI = (news) => {
      this.getNews(news)
      this.setState({refresh: !this.state.refresh})
    }
    this.debouncer = _.debounce(this.getNewsAPI, 500)
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{padding: 5, backgroundColor: '#34495E'}}>
          <TextInput value={this.state.text} style={{height: 40, borderColor: '#eee', backgroundColor: '#fff', borderWidth: 1, paddingLeft: 5, paddingTop: 4, paddingRight: 5, paddingBottom: 4}} onChangeText={this.newsForm} placeholder="search a news here" />
        </View>
        { !this.state.isVisible && !this.state.isEmpty &&
        (<View style={{ padding: 5, margin: 4 }} isVisible={!this.state.isVisible}>
          <FlatList data={this.state.news} keyExtractor={(item, index) => index.toString()} extraData={this.state.refresh} renderItem={({item})=> <View style={{flex: 1, borderColor: '#eee', borderWidth: 1, margin: 5, padding: 5}}>
            <Text> {item.title} </Text>
            <Image style={{ width: null, height: 100 }} source={{ uri: item.urlToImage }}/>
          </View> }  />
        </View>)
        }
        { this.state.isVisible &&
          (<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>)
        }
        { this.state.isEmpty &&
          (<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{textAlign: 'center', color: '#eee', fontSize: 20, fontWeight: 'bold'}}>--- empty ---</Text>
          </View>)

        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    flexDirection: "column",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  }
});
