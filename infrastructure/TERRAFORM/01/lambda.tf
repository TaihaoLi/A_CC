resource "aws_lambda_function" "lambda" {
  filename      = "/Users/litaihao/Desktop/csye6225fork/serverless/handler.zip"
  function_name = "test_Service"
  role          = aws_iam_role.lambdaRole.arn
  handler       = "handler.SesSendEmail"

  runtime = "nodejs12.x"

  environment {
    variables = {
      Domain_Name = var.domain_name
    }
  }
}

resource "aws_sns_topic" "default" {
  name = "call-lambda-maybe"
}
resource "aws_lambda_permission" "with_sns" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.default.arn
}

resource "aws_sns_topic_subscription" "lambda" {
  topic_arn = aws_sns_topic.default.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.lambda.arn
} 