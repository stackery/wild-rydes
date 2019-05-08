const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  // Log the event argument for debugging and for use in local development.
  console.log(JSON.stringify(event, undefined, 2));
  await Promise.all(
    event.Records
      .map(record => JSON.parse(record['Sns']['Message']))
      .map(countRide)
  );
};

async function countRide(message) {
  let params = {
    TableName: process.env.TABLE_NAME,
    Key: { Name: message.UnicornName },
    UpdateExpression: "ADD #counter :increment",
    ExpressionAttributeNames: { '#counter': 'RideCount' },
    ExpressionAttributeValues: { ':increment': 1 }
  }

  await ddb.update(params).promise();
}
