// DynamoDBService.js

import AWS from "aws-sdk";
import { awsConfig } from "./awsConfig";

AWS.config.update(awsConfig);

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = "proper_forms";
const tableName2 = "proper_forms2"; // New DynamoDB table name

export const getItemByUsername = async (username) => {
  if (typeof username !== "string") {
    throw new Error("Username must be a string");
  }

  const params = {
    TableName: tableName,
    Key: {
      username: username,
    },
  };

  try {
    const result = await dynamoDB.get(params).promise();

    if (!result.Item) {
      throw new Error("Item not found for the provided username");
    }

    return result.Item;
  } catch (error) {
    console.error("Error fetching item from DynamoDB:", error.message);
    throw error;
  }
};

export const getItemByUsername2 = async (username) => {
  if (typeof username !== "string") {
    throw new Error("Username must be a string");
  }

  const params = {
    TableName: tableName2, // Use the new table name
    Key: {
      username: username,
    },
  };

  try {
    const result = await dynamoDB.get(params).promise();

    if (!result.Item) {
      throw new Error("Item not found for the provided username in DynamoDB2");
    }

    return result.Item;
  } catch (error) {
    console.error("Error fetching item from DynamoDB2:", error.message);
    throw error;
  }
};

export const saveUsernameToDynamoDB = async (username) => {
  if (typeof username !== "string") {
    throw new Error("Username must be a string");
  }

  const params = {
    TableName: tableName,
    Key: {
      username: username,
    },
    UpdateExpression: "SET #dummyAttr = :dummyValue",
    ExpressionAttributeValues: {
      ":dummyValue": "dummyUsername",
    },
    ExpressionAttributeNames: {
      "#dummyAttr": "dummyAttribute",
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    await dynamoDB.update(params).promise();
    console.log("Username updated successfully.");
  } catch (error) {
    console.error("Error updating username in DynamoDB:", error.message);
    throw error;
  }
};

export const saveUsernameToDynamoDB2 = async (username) => {
  if (typeof username !== "string") {
    throw new Error("Username must be a string");
  }

  const params = {
    TableName: tableName2, // Use the new table name
    Key: {
      username: username,
    },
    UpdateExpression: "SET #dummyAttr = :dummyValue",
    ExpressionAttributeValues: {
      ":dummyValue": "dummyUsername",
    },
    ExpressionAttributeNames: {
      "#dummyAttr": "dummyAttribute",
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    await dynamoDB.update(params).promise();
    console.log("Username updated successfully in DynamoDB2.");
  } catch (error) {
    console.error("Error updating username in DynamoDB2:", error.message);
    throw error;
  }
};

export const savePointsToDynamoDB = async (username, points) => {
  if (typeof username !== "string") {
    throw new Error("Username must be a string");
  }

  const updateExpression = "SET #pointsAttr = :points";
  const expressionAttributeValues = {
    ":points": points,
  };
  const expressionAttributeNames = {
    "#pointsAttr": "points",
  };

  const params = {
    TableName: tableName,
    Key: {
      username: username,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
    ReturnValues: "UPDATED_NEW",
  };

  try {
    await dynamoDB.update(params).promise();
    console.log("Points updated successfully.");
  } catch (error) {
    console.error("Error updating points in DynamoDB:", error.message);
    throw error;
  }
};

export const saveAnswerStatusToDynamoDB = async (
  username,
  questionId,
  isCorrect
) => {
  if (typeof username !== "string" || typeof questionId !== "string") {
    throw new Error("Username and questionId must be strings");
  }

  const params = {
    TableName: tableName,
    Key: {
      username: username,
    },
    UpdateExpression: `SET #qid = :isCorrect`,
    ExpressionAttributeNames: {
      "#qid": `question${questionId}`,
    },
    ExpressionAttributeValues: {
      ":isCorrect": isCorrect,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    await dynamoDB.update(params).promise();
    console.log("Answer status updated successfully.");
  } catch (error) {
    console.error("Error updating answer status in DynamoDB:", error.message);
    throw error;
  }
};

// Add a new function to get the user's progress
export const getUserProgress = async (username) => {
  try {
    const userData = await getItemByUsername(username);
    return userData.lastAttemptedQuestion || 1; // Default to the first question if no progress is found
  } catch (error) {
    console.error("Error fetching user progress from DynamoDB:", error.message);
    throw error;
  }
};
export const getUserProgressLevel2 = async (username) => {
  try {
    const userData = await getItemByUsername2(username);
    return userData.lastAttemptedQuestion || 1; // Default to the first question if no progress is found
  } catch (error) {
    console.error(
      "Error fetching user progress from DynamoDB2:",
      error.message
    );
    throw error;
  }
};

// Add a new function to save user progress
export const saveLastAttemptedQuestion = async (username, questionId) => {
  if (typeof username !== "string" || typeof questionId !== "number") {
    throw new Error(
      "Username must be a string and questionId must be a number"
    );
  }

  const params = {
    TableName: tableName,
    Key: {
      username: username,
    },
    UpdateExpression: "SET #lastAttemptedQuestionAttr = :questionId",
    ExpressionAttributeValues: {
      ":questionId": questionId,
    },
    ExpressionAttributeNames: {
      "#lastAttemptedQuestionAttr": "lastAttemptedQuestion",
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    await dynamoDB.update(params).promise();
    console.log("Last attempted question updated successfully.");
  } catch (error) {
    console.error(
      "Error updating last attempted question in DynamoDB:",
      error.message
    );
    throw error;
  }
};
