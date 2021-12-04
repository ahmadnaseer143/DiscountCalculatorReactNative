import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button, Touchable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ShowModal from "./ShowModal";

const HistoryScreen = ({navigation, route})=>{
  const {history, handleDelete} = route.params;
  const [showModal, setShowModal] = React.useState(false);

  // delete entire history
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
        onPress={()=>{setShowModal(true)}}
        title="Clear History"
        color="black"
      />
      ),
    });
  }, [navigation, setShowModal]);

  const hideModal = (msg) => {
    setShowModal(!showModal);
    if (msg === "ok") {
      navigation.setParams({
        history: [],
      });
    }
  };

  // handle delete button
  React.useEffect(() => handleDelete(history));
  const deleteItem = (id) => {
    navigation.setParams({
      history: history.filter((element) => element.index !== id),
    });
  };
  return(
    <View>
      <View style={{flexDirection:"row", borderBottomColor: 'black',borderBottomWidth: 1,marginBottom:20}}>
        <Text style={{ fontSize: 17}}>OriginalPrice - </Text>
        <Text style={{ fontSize: 17}}>DiscountPercentage = </Text>
        <Text style={{ fontSize: 17}}>FinalPrice</Text>
      </View>
      {
        history.map((element)=>{
          return(
            <View style={{marginBottom:20}}>
              <View style={{flexDirection:"row"}}>
                <Text style={{ fontSize: 15, paddingEnd:130}}>{element.originalPrice} -</Text>
                <Text style={{ fontSize: 15, paddingEnd:100}}>{element.discountPercentage} =</Text>
                <Text style={{ fontSize: 15}}>{element.finalPrice} </Text>
                <TouchableOpacity onPress={()=>{deleteItem(element.index)}} style={{backgroundColor:"black", borderRadius:25, marginLeft:2}}>
                  <Text style={{color:"white", fontSize:16}}>Delete</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: 1,
                  marginTop:5
                }}
              />
            </View>
          )
        })
      }
      {showModal ? <ShowModal show={true} hideModal={hideModal} /> : null}
    </View>
  )
}
const StartScreen = ({navigation})=>{
  navigation.setOptions ({
    headerRight: () => (
      <Button
        onPress={() =>{
          navigation.navigate("History", {
            history:history,
            handleDelete:handleDelete,
          })
        }}
        title="Show History"
        color="black"
      />
    ),
  })
  const [price, setPrice] = useState();
  const [discountPercentage, setDiscountPercentage] = useState();
  const [save, setSave] = useState();
  const [finalPrice, setFinalPrice] = useState();
  const [history, setHistory] = useState([]);

  // save an item
  const handleSave = ()=>{
    if (price > 0 && discountPercentage > 0) {
      let myObj = {
        originalPrice: price,
        discountPercentage: discountPercentage,
        finalPrice: finalPrice,
        index: Math.random(),
      };
      setHistory([...history, myObj]);
    }
    setPrice(0);
    setDiscountPercentage(0);
  }
  // delete an item
  const handleDelete = (newArr) => {
    setHistory(newArr);
  };

  React.useEffect(() => {
    var disc = discountPercentage / 100;
    var final_price = price - price * disc;
    setFinalPrice(final_price.toFixed());
    setSave(((price * discountPercentage) / 100).toFixed());
  });
  return(
    <View>
      <View>
        {/* Orignal Price, Discount Percentage */}
        {/* You save, final price */}
        <Text style={{ fontSize: 30, textAlign:"center" }}>Naseer</Text>
        <Text style={{ fontSize: 30, textAlign:"center" }}>Discount Calculator</Text>
        <TextInput
          style={styles.input}
          placeholder="ORIGINAL PRICE"
          value={price}
          keyboardType='number-pad'
          onChangeText={(price) => {
            if(price<0){
              console.log("Enter Valid Price");
            }
            else{
              setPrice(price);
            }
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="ENTER DISCOUNT %"
          value={discountPercentage}
          keyboardType='number-pad'
          onChangeText={(discount) => {
            if(discount<=100){
              setDiscountPercentage(discount);
            }
            else{
              alert("Enter Valid discount");
            }
          }}
        />
        <Text style={{ fontSize: 30, textAlign:"center" }}>{isNaN(save)? "": "You Saved "+ save}</Text>
        <Text style={{ fontSize: 30, textAlign:"center" }}>{isNaN(save)?"":"Final Price "+ finalPrice}</Text>
      </View>
      <TouchableOpacity onPress={handleSave} disabled={price && discountPercentage?false:true} >
          <Text style={{ fontSize: 30, backgroundColor:"black", color:"white", textAlign:"center" }}>Save</Text>
      </TouchableOpacity>
      
      <StatusBar style="auto" />
    </View>
  )
}

const Stack = createNativeStackNavigator();

const MyStack = ()=>{
  return(
    <Stack.Navigator>
      <Stack.Screen name="Home" component={StartScreen} 
      options={({ navigation, route }) => ({})}
      />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  )
}
export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
