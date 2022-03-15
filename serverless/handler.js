var aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-east-1" });
const ddb = new aws.DynamoDB.DocumentClient({ region: "us-east-1" });
const crypto = require("crypto");
exports.SesSendEmail =  (event, context, callback) => {
    let message = event.Records[0].Sns.Message;
  let messageJson = JSON.parse(message);
    var eParams = {
        Key: {
            'id': messageJson.Email
        },
        TableName: 'csye6225-dynamoDb'
    };
    ddb.get(eParams, function (error, code) {
        var jsString = JSON.stringify(code);
        if (error) {
            console.log("Error",error);
        }
        else {
            if (Object.keys(code).length >= 0) {
                var flag = false;
                if(code.Item == undefined){flag = true;}else
                    if(code.Item.TimeToExist < (new Date).getTime()){flag = true;}
                if(flag){
                    var expirationTime = (new Date).getTime() + (60*1000*5);
                    var params = {
                        Item: {
                            'id': messageJson.Email,
                            'token': crypto.randomBytes(16).toString("hex"),
                            'TimeToExist': expirationTime
                        },
                        TableName: 'csye6225-dynamoDb'
                    };

                    ddb.put(params, function (err, data) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, data);
                            let token = params.Item.token;
                            let username = messageJson.Email;
                            console.log(username);
                            console.log(token);
                            var cParams = {
                                Destination: {
                                    ToAddresses: [username]
                                },
                                Message: {
                                    Body: {
                                        Text: {
                                            Data: "https://"+process.env.Domain_Name+"/v2/user/verify?email="+username+"&token="+token
                                        }
                                    },
                                    Subject: {
                                        Data: "Please click this link to verify your email address(It expires in 5 minutes)"
                                    }
                                },
                                Source: "csye6225@"+process.env.Domain_Name
                            };
                            ses.sendEmail(cParams, function (err, data) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    console.log("EMAIL SENT");
                                    
                                }
                            });
                        }
                    });
                }else
                console.log( code ,"User exists");
            }
        }
    });
};
