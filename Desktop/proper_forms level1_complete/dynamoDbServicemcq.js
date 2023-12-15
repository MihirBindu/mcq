// dynamoDbServicemcq.js

import AWS from "aws-sdk";
import { awsConfig } from "./awsConfig"; // Update the path accordingly

AWS.config.update(awsConfig);

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = "dyn_data"; // Replace with your DynamoDB table name

export const getItemByPartitionKey = async (partitionKey) => {
  // Validate partitionKey before proceeding
  if (typeof partitionKey !== "number") {
    throw new Error("Partition key must be a number");
  }

  const params = {
    TableName: tableName,
    Key: {
      id: partitionKey,
    },
  };

  try {
    const result = await dynamoDB.get(params).promise();

    if (!result.Item) {
      throw new Error("Item not found for the provided partition key");
    }

    // Map DynamoDB attributes to your desired structure
    const {
      id,
      correctAnswer,
      option1,
      option2,
      option3,
      option4,
      question,
      objectURL,
    } = result.Item;

    // Filter out null or undefined options
    const options = [option1, option2, option3, option4].filter(
      (option) => option !== null && option !== undefined
    );

    return {
      id: id, // Assuming id is a number
      correctAnswer: correctAnswer,
      option1: options[0] || null,
      option2: options[1] || null,
      option3: options[2] || null,
      option4: options[3] || null,
      question: question,
      objectURL: objectURL ? objectURL : null,
    };
  } catch (error) {
    console.error("Error fetching item from DynamoDB:", error.message);
    throw error;
  }
};

export const getTotalQuestionsCount = async () => {
  const params = {
    TableName: tableName,
    Select: "COUNT",
  };

  try {
    const result = await dynamoDB.scan(params).promise();
    return result.Count || 0;
  } catch (error) {
    console.error(
      "Error fetching total questions count from DynamoDB:",
      error.message
    );
    throw error;
  }
};

// Functions for the 'level_2' table

export const getItemByPartitionKeyLevel2 = async (partitionKey) => {
  // Validate partitionKey before proceeding
  if (typeof partitionKey !== "number") {
    throw new Error("Partition key must be a number");
  }

  const params = {
    TableName: "level_2", // Use the new table name
    Key: {
      id_level_2: partitionKey,
    },
  };

  try {
    const result = await dynamoDB.get(params).promise();

    if (!result.Item) {
      throw new Error(
        "Item not found for the provided partition key in level_2"
      );
    }

    // Map DynamoDB attributes to your desired structure for level_2
    const {
      id_level_2,
      correctAnswer,
      option1,
      option2,
      option3,
      option4,
      question,
      objectURL,
    } = result.Item;

    // Filter out null or undefined options
    const options = [option1, option2, option3, option4].filter(
      (option) => option !== null && option !== undefined
    );

    return {
      id_level_2: id_level_2, // Assuming id_level_2 is a number
      correctAnswer: correctAnswer,
      option1: options[0] || null,
      option2: options[1] || null,
      option3: options[2] || null,
      option4: options[3] || null,
      question: question,
      objectURL: objectURL ? objectURL : null,
    };
  } catch (error) {
    console.error(
      "Error fetching item from level_2 DynamoDB table:",
      error.message
    );
    throw error;
  }
};

export const getTotalQuestionsCountLevel2 = async () => {
  const params = {
    TableName: "level_2", // Use the new table name
    Select: "COUNT",
  };

  try {
    const result = await dynamoDB.scan(params).promise();
    return result.Count || 0;
  } catch (error) {
    console.error(
      "Error fetching total questions count from level_2 DynamoDB table:",
      error.message
    );
    throw error;
  }
};
