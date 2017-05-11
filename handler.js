'use strict';

var AWS = require('aws-sdk');
var uuid = require('uuid');

module.exports.createBounty = (event, context, callback) => {
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = JSON.parse(event.body);
  var bounty = {
    id: uuid.v4(),
    title: params.title,
    description: params.description,
    price: Number(params.price),
    tools: params.tools
  };

  docClient.put({TableName: 'bounties-table', Item: bounty}, (error) => {
    if (error) {
      const response = {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: 'Something went wrong!',
          input: error,
        })
      };
      callback(null, response);
    }

    const response = {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: "Bounty has been just added"
    };

    callback(null,response);
  });
};

module.exports.getBounties = (event, context, callback) => {
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: 'bounties-table',
  }

  docClient.scan(params, (error, data) => {
    if (error) {
      callback(null, { statusCode: 400, body: JSON.stringify(error) });
    }

    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data.Items)
    })
  });
}
