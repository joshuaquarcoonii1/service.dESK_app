import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {useState,React} from "react";
import { View ,Text,TextInput,Button,Image,Alert } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import ComplaintSubmissionScreen from './screens/Main';
import HistoryScreen   from './screens/Complaints'
import ProfileScreen from './screens/Profile'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from './screens/Login';
import ServiceDeskDashboard from './screens/Admin'

const Tab = createBottomTabNavigator();

//bottom tabs
function Navigationer() {
    return (  

      
        <Tab.Navigator
          screenOptions={{
            headerShown: false,  // Hide header if showing
            tabBarPosition: "bottom", // Ensures bottom placement
          }}
        >
          <Tab.Screen name="Home" component={ComplaintSubmissionScreen}
          options={{
            tabBarIcon:()=><Entypo name="home" size={24} color="black" />
          }}
           />
          <Tab.Screen name="Complaints" component={HistoryScreen}
          options={{
            tabBarIcon:()=><AntDesign name="profile" size={24} color="black" />
          }}
           />
          <Tab.Screen name="Profile" component={ProfileScreen}
          options={{
            tabBarIcon:()=><AntDesign name="user" size={24} color="black" />
          }}
           />
        </Tab.Navigator>
    );
  }
 

  const Stack = createNativeStackNavigator();

  function Navigation() {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
         {/* Login Screen */}
         <Stack.Screen name="Login" component={LoginScreen} />
          {/* SignUp Screen */}
          {/* <Stack.Screen name="SignupScreen" component={SignupScreen} /> */}
         
  
          {/* Main Tabs */}
          <Stack.Screen name="Main" component={Navigationer} />

          {/* Admin Tabs */}
          {/* <Stack.Screen name="Admin" component={ServiceDeskDashboard} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  export default Navigation;