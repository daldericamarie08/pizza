import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  
  const validCredentials = {
    username: 'Admin',
    password: '12345',
  };

  const handleLogin = () => {
    if (username === validCredentials.username && password === validCredentials.password) {
      Alert.alert('Login Successful');
      navigation.navigate('Home'); 
    } else {
      Alert.alert('Invalid Credentials', 'Please check your username and password.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Image
          source={require('../Screens/photos/PIZZA.png')} 
          style={styles.image}
        />
        <Text style={styles.title}>PIZZAlicious</Text>
      </View>

      {/* Login Section */}
      <View style={styles.loginContainer}>
        <Text style={styles.header}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupLink}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff4d4d', 
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FF204E', 
  },
  image: {
    width: 400,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#5D0E41',
    marginTop: 10,
    fontFamily: 'Arial',
  },
  loginContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#A0153E', 
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupLink: {
    marginTop: 15,
    color: '#ff4d4d',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
