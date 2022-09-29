import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width: SCREEN_WIDTH} = Dimensions.get("window");
const API_KEY = "5546a94d29382d7b3b64cd5e68226d3e";

const icons = {
  Clouds: "cloudy",
  Clear: "sunny",
  Snow: "snow",
  Rain: "rainy",
  Thunderstorm: "thunderstorm",
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [condition, setCondition] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords:{ latitude, longitude },} = await Location.getCurrentPositionAsync({ accuracy:5 });
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    console.log(json.weather[0].main, json.main);
    setDays(json.main);
    setCondition(json.weather[0].main);
    console.log(condition);
    // const icons = wouldDisplay.map((display) => <Text key={display.id}></Text>)
    
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView pagingEnabled horizontal contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
        <View style={styles.day}>
          <ActivityIndicator />
        </View>
        ):(
          <View style={styles.day}>
            <Text style={styles.temp}>{parseFloat(days.temp).toFixed(1)}</Text>
            <Text style={styles.description}>Feels Like: {parseFloat(days.feels_like).toFixed(1)}</Text>
            <View style={styles.day}>
              <Ionicons style={styles.conditions} name={icons[condition]} size={100} color="black" />
              <Text style={styles.conditions_name}>{condition}</Text>
            </View>
            <View style={styles.temp_container}>
              <Text style={styles.max_temp}>Max: {parseFloat(days.temp_max).toFixed(1)}</Text>
              <Text style={styles.min_temp}>Min: {parseFloat(days.temp_min).toFixed(1)}</Text>
            </View>
          </View>
        )
        //   days.map((day, index) => (<View key={index} style={styles.day}>
        //     <Text style={styles.temp}>{parseFloat(days.temp).toFixed(1)}</Text>
        //     <Text style={styles.description}>Feels Like: {parseFloat(days.feels_like).toFixed(1)}</Text>
        //     <Text style={styles.description}>{day.weather[0].main}</Text>
        //   </View>
        // )))
        }
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C0b6ed',
  },
  city: {
    flex: 1.2,
    justifyContent:'center',
    alignItems: 'center',
  },
  cityName:{
    fontSize: 45,
    fontWeight: "500",
  },
  weather:{

  },
  day:{
    width: SCREEN_WIDTH,
    alignItems:"center",
  },
  temp:{
    marginTop: 20,
    fontSize: "140",
  },
  description:{
    marginTop:-10,
    fontSize: 30,
  },
  conditions:{
    marginTop: 50,
  },
  conditions_name:{
    marginTop:-5,
    fontSize:20,
  },
  temp_container:{
    marginTop:20,
  },
  max_temp:{
    marginTop:30,
    fontSize:25,
  },
  min_temp:{
    marginTop:10,
    fontSize:25,
  }
});
