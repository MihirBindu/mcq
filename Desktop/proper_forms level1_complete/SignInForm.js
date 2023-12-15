// SignInForm.js
import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  signIn,
  getItemByUsername,
  getItemByUsername2,
} from "./cognitoService"; // Update this import
import {
  savePointsToDynamoDB,
  saveUsernameToDynamoDB2,
} from "./dynamoDbService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignInForm = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState(null);

  const handleSignIn = async () => {
    try {
      const session = await signIn(username, password);
      setErrorMessage("");

      try {
        // Use getItemByUsername2 for the new table
        const user = await getItemByUsername2(username);
        setUserData(user);

        // Save user points to DynamoDB2
        const userPoints = user.points || 0;
        await savePointsToDynamoDB(username, userPoints); // Update the function call

        // Save username to DynamoDB2
        await saveUsernameToDynamoDB2(username);

        // Retrieve the last attempted question ID from AsyncStorage
        const lastAttemptedQuestionId = await AsyncStorage.getItem(
          `${username}_lastAttemptedQuestionId`
        );

        // Navigate to the ProfileScreen with username and last attempted question ID as parameters
        navigation.navigate("Profile", {
          userData: user,
          lastAttemptedQuestionId: lastAttemptedQuestionId || null,
        });
      } catch (dbError) {
        console.error("Error fetching user data:", dbError.message);
        setErrorMessage("Error fetching user data");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <ImageBackground
      source={require("./assets/image2.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={{ color: "white" }}>Sign In</Text>
          </TouchableOpacity>
          {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        </View>
        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  formContainer: {
    width: "80%",
    alignSelf: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  signInButton: {
    backgroundColor: "blue",
    borderRadius: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    width: 280,
    alignSelf: "center",
    marginVertical: 10,
  },
  linkContainer: {
    alignItems: "center",
    marginTop: 5,
    top: -5,
  },
  linkText: {
    color: "blue",
    marginTop: 10,
  },
});

export default SignInForm;
