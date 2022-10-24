const AWS = require('aws-sdk');
AWS.config.update( {
  region: 'us-east-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();

const dynamodbTableName = 'coin-market';
const healthPath = '/health';
const coinPath = '/coin';
const coinsPath = '/coins';

exports.handler = async function(event) {
  console.log('Request event: ', event);
  let response;
  switch(true) {
    case event.httpMethod === 'GET' && event.path === healthPath:
      response = buildResponse(200);
      break;
    case event.httpMethod === 'GET' && event.path === coinPath:
      if (dynamodb === null)  {
        let r  = any;
          r = await HttpClientService.request({
            path: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
            method: 'GET',
          });
         r.response = await getCoin(event.pathParameters.coinsId);
      } else {
        response = await getCoin(event.queryStringParameters.coinsId);
      }
      break;
    case event.httpMethod === 'GET' && event.path === coinsPath:
      response = await getCoins();
      break;
    default:
      response = buildResponse(404, '404 Not Found');
  }
  return response;
}

async function getCoin(coinsId) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'coinsId': coinsId
    }
  }

  return await dynamodb.get(params).promise().then((response) => {
    return buildResponse(200, response.Item);
  }, (error) => {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
  });
}

async function getCoins() {
  const params = {
    TableName: dynamodbTableName
  }
  const allCoins = await scanDynamoRecords(params, []);
  const body = {
    coins: allCoins
  }
  return buildResponse(200, body);
}

async function scanDynamoRecords(scanParams, itemArray) {
  try {
    const dynamoData = await dynamodb.scan(scanParams).promise();
    itemArray = itemArray.concat(dynamoData.Items);
    if (dynamoData.LastEvaluatedKey) {
      scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
      return await scanDynamoRecords(scanParams, itemArray);
    }
    return itemArray;
  } catch(error) {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
  }
}


function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}