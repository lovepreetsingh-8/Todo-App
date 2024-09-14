/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import database, { getDatabase } from '@react-native-firebase/database';
import {Alert, Dimensions, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';



function App(){
  const [inputTextValue,setInputTextValue] = useState(null);
  const [list,setList] = useState(null);
  const [isUpdateData,setIsUpdateData] = useState(false);
  const [selectedCardIndex,setSelectedCardIndex] = useState(null);

  
  useEffect(()=> {
    getDatabase();
  }, []);

  const getDatabase = async() => {
    try {
      const data = await database().ref('todo').on('value',(tempData) => {
        console.log(data);
      if (tempData.val()){
        const firebaseData = tempData.val();
        const listArray = Object.keys(firebaseData).map((key) => ({
          id: key,
          ...firebaseData[key],
          }));
          setList(listArray);
        }
      });
      

    } catch (err) {
      console.log(err)
    }
  }
  const handleAddData = async() =>{
    try{
      if(inputTextValue.length > 0){
        const response = await database().ref("todo/").push({
          value: inputTextValue
        })
        console.log(response);
        setInputTextValue('')
      }else {
        alert('Please enter some value')
      }
    
  } catch(err){
    console.log(err);
  }
  }

  const handleUpdateData = async() => {
    try {
      if(inputTextValue.length > 0){
        const response = await database().ref(`todo/${selectedCardIndex}`).update({
          value: inputTextValue
        })
        console.log(response);
        setInputTextValue('');
        setIsUpdateData(false);
      }else {
        alert('Please enter some value')
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handelCardPress = (cardIndex, cardValue) => {
    try {
      setIsUpdateData(true);
      setSelectedCardIndex(cardIndex);
      setInputTextValue(cardValue);
    } catch (err) {
      console.log(err);
    }
  }
  
  const handelCardLongPress = (cardIndex, cardValue) => {
    try {
      Alert.alert("Alert",`You want to delete ${cardValue}?`,[
        {
          text: 'Yeah',
          onPress: async () => {
            try {
              const response = await database().ref(`todo/${cardIndex}`).remove();
              console.log(response);
              
              setInputTextValue('');
              setIsUpdateData(false);
            } catch (err) {
              console.log(err)
            }
            
          }},
          {
            text: 'Cancel',
          }
      ]);
      
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden= {true}/>
      <View>

        <Text style={{textAlign:'center', fontSize: 20, fontWeight: 'bold', color:'#fff'}}>
          TODO App</Text>

        <TextInput style={styles.inputBox} 
        placeholder='Enter any value'
        value={inputTextValue}
        onChangeText={value => setInputTextValue(value)} />

        {
          !isUpdateData ? (
            <TouchableOpacity style={styles.button} onPress={() => handleAddData()}>
          <Text style={{color: '#fff'}}>Add</Text>
        </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => handleUpdateData()}>
          <Text style={{color: '#fff'}}>Update</Text>
        </TouchableOpacity>
          )
        }
      </View>

      <View style={styles.cardContainer}>
        <Text style={{marginVertical:20, fontSize:20, fontWeight: 'bold', color: '#fff'}}>
          Todo List
        </Text>
       

        <FlatList
          data={list}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            const cardIndex = item.id;
            return (
              <TouchableOpacity 
              style={styles.card} 
              onPress={()=> handelCardPress(cardIndex,item.value)}
              onLongPress={() => handelCardLongPress(cardIndex,item.value)}>
                <Text style={{color: '#f5ffff'}}>{item.value}</Text>
              </TouchableOpacity>
            )
          }}
            
            />
      </View>
    </View>
  );
}

const {height,width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems:'center',
    backgroundColor: "black",
  },
  inputBox:{
    width: width - 30,
    borderRadius: 15,
    borderWidth: 2,
    marginVertical: 10,
    padding: 10,
    borderColor: '#fff',
    backgroundColor: '#fff',
    color: '#000'
    
  },
  button:{
  backgroundColor: 'blue',
  alignItems: 'center',
  padding: 10,
  borderRadius: 50,
  },
  cardContainer:{
    marginVertical: 20,
  },
  card:{
    backgroundColor: '#6dd7fd',
    width: width - 40,
    padding: 20,
    borderRadius:30,
    marginVertical: 10,
  }
});

export default App;
