import {useState,React} from "react";
import { View ,Text,TextInput,Button,Image,Alert } from "react-native";
import { setCurrentUser,setUserContact } from "../UserData";
// login
const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
  //login method
    const handleLogin =async () => {
      try {
        const response = await fetch('https://complaints-dashboard-v2.onrender.com/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
  
        const data = await response.json();
        
  
        if (response.ok) {
          setCurrentUser(data.username); // Store the username
          setUserContact(data.contact)

          Alert.alert('Login Successful', `Welcome, ${data.username}`);
          navigation.replace('Main'); // Navigate to the main screen
        } else {
          Alert.alert('Login Failed', data.error || 'Invalid credentials');
        }
      } catch (error) {
        console.error('Error during login:', error);
        Alert.alert('Error', 'An error occurred while logging in.');
      }
    };
  //signup method
  const gotoSignup =  () => {
    navigation.replace('SignupScreen')
  };
  
  
  
    const main={
      businessLogo:require('../assets/vra_2.jpg'),
  
    };
  
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Image source={main.businessLogo} style={{width: 150,
      height: 150,
      borderRadius: 80,
      overflow: 'hidden',
      marginBottom: 16,}}/>
        <TextInput
          style={{
            width: "100%",
            padding: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            marginBottom: 10,
            borderRadius: 5,
          }}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={{
            width: "100%",
            padding: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            marginBottom: 20,
            borderRadius: 5,
          }}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Log In" onPress={handleLogin} />
        <Button title="Sign Up Here" onPress={gotoSignup} />
      </View>
    );
  };
  

  export default LoginScreen;
