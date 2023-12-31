// cognitoService.js

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import { saveUsernameToDynamoDB } from "./dynamoDbService";
import { saveUsernameToDynamoDB2 } from "./dynamoDbService"; // New import for the second table
import { awsConfig } from "./awsConfig";
import AWS from "aws-sdk";

AWS.config.update(awsConfig);

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = "proper_forms";
const tableName2 = "proper_forms2"; // New DynamoDB table name

const poolData = {
  UserPoolId: "ap-south-1_Fc4Pis601",
  ClientId: "41rc2rlggta8m5gsj2if48u247",
};

const userPool = new CognitoUserPool(poolData);

export const signUp = async (username, password, email) => {
  const attributeList = [
    new CognitoUserAttribute({ Name: "email", Value: email }),
    new CognitoUserAttribute({ Name: "name", Value: username }),
  ];

  return new Promise((resolve, reject) => {
    userPool.signUp(
      username,
      password,
      attributeList,
      null,
      async (err, result) => {
        if (err) {
          reject(err);
        } else {
          // Sign-up successful, save the username to DynamoDB
          try {
            await saveUsernameToDynamoDB(username);
            console.log(`Username ${username} saved to DynamoDB successfully`);
            // Also save to the second DynamoDB table
            await saveUsernameToDynamoDB2(username);
            console.log(`Username ${username} saved to DynamoDB2 successfully`);
            resolve(result);
          } catch (dynamoError) {
            console.error(
              "Error saving username to DynamoDB:",
              dynamoError.message
            );
            reject(dynamoError);
          }
        }
      }
    );
  });
};

export const confirmSignUp = async (username, verificationCode) => {
  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(
      verificationCode,
      true,
      async (err, result) => {
        if (err) {
          reject(err);
        } else {
          // Registration confirmed successfully
          resolve(result);
        }
      }
    );
  });
};

export const signIn = async (username, password) => {
  const authenticationData = {
    Username: username,
    Password: password,
  };

  const authenticationDetails = new AuthenticationDetails(authenticationData);

  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  return new Promise(async (resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: async (session) => {
        // Extract and handle the user information
        try {
          const userData = await getItemByUsername(username);
          console.log("User data:", userData);
          resolve(session);
        } catch (dbError) {
          console.error("Error fetching user data:", dbError.message);
          reject(dbError);
        }
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

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

// New function for the second table
export const getItemByUsername2 = async (username) => {
  if (typeof username !== "string") {
    throw new Error("Username must be a string");
  }

  const params = {
    TableName: tableName2,
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
export const savePointsToDynamoDB2 = async (username, points) => {
  if (typeof username !== "string" || typeof points !== "number") {
    throw new Error("Invalid input for savePointsToDynamoDB2");
  }

  const params = {
    TableName: tableName2,
    Key: {
      username: username,
    },
    UpdateExpression: "SET points = :points",
    ExpressionAttributeValues: {
      ":points": points,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamoDB.update(params).promise();

    if (!result.Attributes) {
      throw new Error("Error updating points in DynamoDB2");
    }

    return result.Attributes;
  } catch (error) {
    console.error("Error updating points in DynamoDB2:", error.message);
    throw error;
  }
};
