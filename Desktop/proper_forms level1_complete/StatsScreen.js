// StatsScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getItemByUsername } from "./dynamoDbService";
import { getTotalQuestionsCount } from "./dynamoDbServicemcq";
import ProgressBar from "react-native-progress/Bar";
import { Bar } from "react-native-progress";
const StatsScreen = ({ route }) => {
  const { username } = route.params;
  const [successRate, setSuccessRate] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(1); // Default to 1

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const userData = await getItemByUsername(username);
        const points = userData.points || 0;
        const fetchedTotalQuestions = await getTotalQuestionsCount();
        setTotalQuestions(fetchedTotalQuestions);

        const successRate = (points / totalQuestions) * 100;
        setSuccessRate(successRate);
      } catch (dbError) {
        console.error("Error fetching user data:", dbError.message);
      }
    };

    fetchUserPoints();
  }, [username, totalQuestions]); // Include totalQuestions in the dependency array

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Stats</Text>
      {/* Move the title to the top of the screen */}
      <Text style={styles.successRate}>Success Rate</Text>
      <Text style={styles.successPercentage}>{successRate.toFixed(2)}%</Text>
      <Text style={styles.Level1}>Level 1</Text>
      <ProgressBar
        progress={successRate / 100} // Convert successRate to a value between 0 and 1
        width={150} // Adjust the width as needed
        height={10} // Adjust the height as needed
        borderRadius={5} // Adjust the border radius as needed
        color={"green"} // Adjust the color as needed
        style={{ marginTop: 10, top: -322, right: 80 }} // Add margin to separate it from the text
      />
      {/* <Text style={styles.totalQuestions}>
        Total Questions: {totalQuestions}
      </Text> */}
      {/* Add more stats or UI components as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    top: -280,
    marginTop: 40,
  },
  successRate: {
    fontSize: 18,
    marginBottom: 10,
    left: 100,
    top: -250,
  },
  successPercentage: {
    fontSize: 18,
    marginBottom: 10,
    left: 100,
    top: -250,
    // Adjust styles as needed
  },
  Level1: {
    fontSize: 18,
    marginBottom: 10,
    left: -80,
    top: -322,
  },
});

export default StatsScreen;
