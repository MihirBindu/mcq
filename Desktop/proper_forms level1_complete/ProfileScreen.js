import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getItemByPartitionKey,
  getItemByPartitionKeyLevel2,
} from "./dynamoDbServicemcq";
import {
  getItemByUsername,
  saveLastAttemptedQuestion,
  getUserProgress,
  getUserProgressLevel2,
} from "./dynamoDbService";

const ProfileScreen = ({ route }) => {
  const { userData } = route.params;
  const [level1Data, setLevel1Data] = useState(null);
  const [level2Data, setLevel2Data] = useState(null);
  const [userPoints, setUserPoints] = useState(null);
  const navigation = useNavigation();

  const handleStatsButtonClick = () => {
    // Navigate to StatsScreen
    navigation.navigate("StatsScreen", {
      username: userData.username,
    });
  };
  const handleLevel1ButtonClick = async () => {
    try {
      // Fetch user progress from DynamoDB
      const lastAttemptedQuestion = await getUserProgress(userData.username);

      // Fetch the data for the next unanswered question
      const data = await getItemByPartitionKey(lastAttemptedQuestion);
      setLevel1Data(data);
      setUserPoints(userData.points);

      navigation.navigate("Level1Screen", {
        level1Data: data,
        username: userData.username,
        points: userData.points,
        questionId: lastAttemptedQuestion,
      });
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const handleLevel2ButtonClick = async () => {
    try {
      // Fetch user progress from DynamoDB for level_2
      const lastAttemptedQuestion = await getUserProgressLevel2(
        userData.username
      );

      // Fetch the data for the next unanswered question from level_2 table
      const data = await getItemByPartitionKeyLevel2(lastAttemptedQuestion);
      setLevel2Data(data);
      setUserPoints(userData.points);

      navigation.navigate("Level2Screen", {
        level2Data: data,
        username: userData.username,
        points: userData.points,
        questionId: lastAttemptedQuestion,
      });
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  return (
    <ImageBackground
      source={require("./assets/image3.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.level1Button}
          onPress={handleLevel1ButtonClick}
        >
          <Text style={styles.buttonText}>Level 1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.level2Button} // Add or modify styles as needed
          onPress={handleLevel2ButtonClick}
        >
          <Text style={styles.buttonText}>Level 2</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.level3Button}
          onPress={handleLevel1ButtonClick}
        >
          <Text style={styles.buttonText}>Level 3</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.level4Button}
          onPress={handleLevel1ButtonClick}
        >
          <Text style={styles.buttonText}>Level 4</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.Practice}
          onPress={handleLevel1ButtonClick}
        >
          <Text style={styles.buttonText}>PRACTICE QUESTION</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Stats} onPress={handleStatsButtonClick}>
          <Text style={styles.buttonText}>YOUR STATS</Text>
        </TouchableOpacity>

        {level1Data && (
          <View style={styles.level1DataContainer}>
            {/* Add other data fields as needed */}
            <Text>Points: {userPoints}</Text>
            {/* Add other user-related data */}
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or "stretch"
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 200,
  },
  level1Button: {
    marginTop: 20,
    backgroundColor: "#40E0D0",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    right: 80,
    top: -87,
    height: 80,
    width: 110,
  },
  level2Button: {
    marginTop: 20,
    backgroundColor: "#40E0D0",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    left: 80,
    top: -187,
    height: 80,
    width: 110,
  },
  level3Button: {
    marginTop: 20,
    backgroundColor: "#40E0D0",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    right: 80,
    top: -157,
    height: 80,
    width: 110,
  },
  level4Button: {
    marginTop: 20,
    backgroundColor: "#40E0D0",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    left: 80,
    top: -257,
    height: 80,
    width: 110,
  },
  Practice: {
    marginTop: 20,
    backgroundColor: "#40E0D0",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    top: -207,
    height: 80,
    width: 310,
  },
  Stats: {
    marginTop: 20,
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    top: -187,
    height: 80,
    width: 310,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    alignSelf: "center",
    top: 10,
  },
  level1DataContainer: {
    marginTop: 20,
  },
});

export default ProfileScreen;
