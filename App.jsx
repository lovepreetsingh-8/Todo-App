/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import database, { getDatabase } from '@react-native-firebase/database';
import {Dimensions, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';



function App(){
  const [inputTextValue,setInputTextValue] = useState(null);
  const [list,setList] = useState(null);

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
    const response = await database().ref("todo/").push({
      value: inputTextValue
    })
    console.log(response);
    setInputTextValue('');
    
  } catch(err){
    console.log(err);
  }
  }
  return (
    <View style={styles.container}>
      <StatusBar hidden= {true}/>
      <View>

        <Text style={{textAlign:'center', fontSize: 20, fontWeight: 'bold',}}>
          TODO App</Text>

        <TextInput style={styles.inputBox} 
        placeholder='Enter any value'
        value={inputTextValue}
        onChangeText={value => setInputTextValue(value)} />

        <TouchableOpacity style={styles.button} onPress={handleAddData}>
          <Text style={{color: '#fff'}}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <Text style={{marginVertical:20, fontSize:20, fontWeight: 'bold'}}>
          Todo List
        </Text>
       

        <FlatList
          data={list}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return (
              <View style={styles.card}>
                <Text style={{color: '#f5ffff'}}>{item.value}</Text>
              </View>
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
  },
  inputBox:{
    width: width - 30,
    borderRadius: 15,
    borderWidth: 2,
    marginVertical: 10,
    padding: 10,
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
