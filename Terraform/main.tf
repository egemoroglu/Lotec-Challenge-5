terraform {
  backend "s3" {
    bucket = "lotec-challenge-5-egemoroglu-tfstate"
    key    = "terraform.tfstate"
    region = "us-east-1"

  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 3.76.1"
    }
  }
}

provider "archive" {}

module "tf-state" {
  source      = "./modules/tf-state"
  bucket_name = local.bucket_name

}

resource "aws_s3_bucket" "egemoroglu-lotec-challenge-5-frontend" {
  bucket = "egemoroglu-lotec-challenge-5-frontend"
}

resource "aws_s3_bucket_cors_configuration" "egemoroglu-lotec-challenge-5-cors-rules" {
  bucket = aws_s3_bucket.egemoroglu-lotec-challenge-5-frontend.bucket
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

}

resource "aws_s3_bucket_versioning" "egemoroglu-lotec-challenge-5-frontend-versioning" {
  bucket = aws_s3_bucket.egemoroglu-lotec-challenge-5-frontend.bucket
  versioning_configuration {
    status = "Disabled"
  }

}

resource "aws_s3_bucket_public_access_block" "egemoroglu-lotec-challenge-5-frontend-access-block" {
  bucket = aws_s3_bucket.egemoroglu-lotec-challenge-5-frontend.bucket

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false

}

resource "aws_s3_bucket_website_configuration" "egemoroglu-challenge-5-frontend" {
  bucket = aws_s3_bucket.egemoroglu-lotec-challenge-5-frontend.bucket

  index_document {
    suffix = "index.html"

  }
  error_document {
    key = "index.html"
  }

}

resource "aws_s3_bucket_server_side_encryption_configuration" "egemoroglu-lotec-challenge-5-frontend" {
  bucket = aws_s3_bucket.egemoroglu-lotec-challenge-5-frontend.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }

  }

}

resource "null_resource" "sync_files_to_s3" {
  triggers = {
    always_run = "${timestamp()}"
  }

  provisioner "local-exec" {
    command = "cd ../ClientSide && npm run build && aws s3 sync ../ClientSide/dist s3://${aws_s3_bucket.egemoroglu-lotec-challenge-5-frontend.bucket}"

  }

}
resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.egemoroglu-lotec-challenge-5-frontend.bucket
  policy = data.aws_iam_policy_document.egemoroglu-challenge-5-bucket-policy.json

}

data "aws_iam_policy_document" "egemoroglu-challenge-5-bucket-policy" {
  depends_on = [
    aws_s3_bucket.egemoroglu-lotec-challenge-5-frontend
  ]

  statement {
    sid    = "PublicGetObject"
    effect = "Allow"
    actions = [
      "s3:GetObject"
    ]

    principals {
      identifiers = ["*"]
      type        = "*"
    }

    resources = [
      "arn:aws:s3:::${aws_s3_bucket.egemoroglu-lotec-challenge-5-frontend.bucket}/*"

    ]
  }

}

resource "aws_cloudfront_distribution" "egemoroglu-lotec-challenge-5-front" {
  depends_on = [
    aws_s3_bucket.egemoroglu-lotec-challenge-5-frontend
  ]

  origin {
    domain_name = aws_s3_bucket.egemoroglu-lotec-challenge-5-frontend.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.egemoroglu-lotec-challenge-5-frontend.id
  }

  enabled             = true
  default_root_object = "index.html"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    target_origin_id       = aws_s3_bucket.egemoroglu-lotec-challenge-5-frontend.id
    viewer_protocol_policy = "allow-all"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }


}


resource "aws_s3_bucket" "egemoroglu-lambda-bucket" {
  bucket = "egemoroglu-lambda-bucket"

}

resource "null_resource" "build-todo" {
  triggers = {
    always_run = "${timestamp()}"

  }

  provisioner "local-exec" {
    command = "cd ../ServerSide/TodoServer && npm install && npm run build"

  }

}
resource "null_resource" "build-user" {
  triggers = {
    always_run = "${timestamp()}"

  }
  provisioner "local-exec" {
    command = "cd ../ServerSide/UserServer && npm install && npm run build"

  }
}

resource "archive_file" "todo-server-zip" {
  type        = "zip"
  source_dir  = "../ServerSide/TodoServer/build"
  output_path = "../ServerSide/todo-server.zip"
  depends_on = [
    null_resource.build-todo
  ]
}



resource "archive_file" "user-server-zip" {
  type        = "zip"
  source_dir  = "../ServerSide/UserServer/build"
  output_path = "../ServerSide/user-server.zip"
  depends_on = [
    null_resource.build-user
  ]

}

resource "null_resource" "sync-servers" {
  triggers = {
    always_run = "${timestamp()}"
  }

  provisioner "local-exec" {
    command = "aws s3 cp ../ServerSide/todo-server.zip s3://${aws_s3_bucket.egemoroglu-lambda-bucket.bucket}"
  }

  provisioner "local-exec" {
    command = "aws s3 cp ../ServerSide/user-server.zip s3://${aws_s3_bucket.egemoroglu-lambda-bucket.bucket}"
  }
  depends_on = [
    archive_file.todo-server-zip,
    archive_file.user-server-zip

  ]

}

data "external" "todo_server_zip_hash" {
  program    = ["bash", "-c", "shasum -a 256 ../ServerSide/todo-server.zip | awk '{print \"{\\\"hash\\\": \\\"\" $1 \"\\\"}\"}'"]
  depends_on = [archive_file.todo-server-zip]
}

data "external" "user_server_zip_hash" {
  program    = ["bash", "-c", "shasum -a 256 ../ServerSide/user-server.zip | awk '{print \"{\\\"hash\\\": \\\"\" $1 \"\\\"}\"}'"]
  depends_on = [archive_file.user-server-zip]
}

resource "aws_iam_role" "egemoroglu-lambda-role" {
  name = "egemoroglu-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"

        }
      }
    ]
  })

}
resource "aws_iam_role_policy" "lambda-policy" {
  name = "lambda-policy"
  role = aws_iam_role.egemoroglu-lambda-role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Effect   = "Allow",
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Action = [
          "s3:GetObject",
        ],
        Effect   = "Allow",
        Resource = "${aws_s3_bucket.egemoroglu-lambda-bucket.arn}/*"
      }
    ]

  })

}


resource "aws_lambda_function" "egemoroglu-todo-server" {
  function_name    = "egemoroglu-todo-server"
  s3_bucket        = aws_s3_bucket.egemoroglu-lambda-bucket.id
  s3_key           = "todo-server.zip"
  role             = aws_iam_role.egemoroglu-lambda-role.arn
  handler          = "server.handler"
  runtime          = "nodejs18.x"
  source_code_hash = data.external.todo_server_zip_hash.result.hash

  depends_on = [
    null_resource.sync-servers
  ]

}

resource "aws_lambda_function" "egemoroglu-user-server" {
  function_name    = "egemoroglu-user-server"
  s3_bucket        = aws_s3_bucket.egemoroglu-lambda-bucket.id
  s3_key           = "user-server.zip"
  role             = aws_iam_role.egemoroglu-lambda-role.arn
  handler          = "server.handler"
  runtime          = "nodejs18.x"
  source_code_hash = data.external.user_server_zip_hash.result.hash


  depends_on = [
    null_resource.sync-servers
  ]

}

resource "aws_apigatewayv2_api" "egemoroglu-user-api" {
  name          = "egemoroglu-user-api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["Authorization", "Content-Type", "X-Amz-Date", "X-Amz-Security-Token", "X-Api-Key"]

  }

}


resource "aws_cognito_user_pool" "egemoroglu-user-pool" {
  name = "egemoroglu-user-pool"
  schema {
    attribute_data_type = "String"
    name                = "nickname"
    required            = true
  }
  auto_verified_attributes = ["email"]

}

resource "aws_cognito_user_pool_client" "egemoroglu-user-pool-client" {
  name         = "egemoroglu-user-pool-client"
  user_pool_id = aws_cognito_user_pool.egemoroglu-user-pool.id

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_ADMIN_USER_PASSWORD_AUTH"
  ]

  prevent_user_existence_errors = "ENABLED"

}

resource "aws_apigatewayv2_authorizer" "cognito-authorizer" {
  api_id           = aws_apigatewayv2_api.egemoroglu-user-api.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "cognito-authorizer"
  jwt_configuration {
    audience = [aws_cognito_user_pool_client.egemoroglu-user-pool-client.id]
    issuer   = "https://cognito-idp.us-east-1.amazonaws.com/${aws_cognito_user_pool.egemoroglu-user-pool.id}"
  }

  authorizer_uri = "arn:aws:apigateway:us-east-1:cognito-idp:path/userpools/${aws_cognito_user_pool.egemoroglu-user-pool.id}/authorize"

}

resource "aws_apigatewayv2_route" "egemoroglu-user-signup-route" {
  api_id    = aws_apigatewayv2_api.egemoroglu-user-api.id
  route_key = "POST /signup"
  target    = "integrations/${aws_apigatewayv2_integration.egemoroglu-user-integration.id}"

  authorizer_id = aws_apigatewayv2_authorizer.cognito-authorizer.id

}

resource "aws_apigatewayv2_route" "egemoroglu-user-signin-route" {
  api_id    = aws_apigatewayv2_api.egemoroglu-user-api.id
  route_key = "POST /signin"
  target    = "integrations/${aws_apigatewayv2_integration.egemoroglu-user-integration.id}"

  authorizer_id = aws_apigatewayv2_authorizer.cognito-authorizer.id

}

output "user-client-id" {
  value = aws_cognito_user_pool_client.egemoroglu-user-pool-client.id

}

output "user-pool-id" {
  value = aws_cognito_user_pool.egemoroglu-user-pool.id

}




resource "aws_apigatewayv2_integration" "egemoroglu-user-integration" {
  api_id                 = aws_apigatewayv2_api.egemoroglu-user-api.id
  integration_type       = "AWS_PROXY"
  integration_method     = "ANY"
  integration_uri        = aws_lambda_function.egemoroglu-user-server.arn
  payload_format_version = "2.0"

}

resource "aws_apigatewayv2_route" "user-route" {
  api_id    = aws_apigatewayv2_api.egemoroglu-user-api.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.egemoroglu-user-integration.id}"

}

resource "aws_apigatewayv2_stage" "egemoroglu-user-stage" {
  api_id      = aws_apigatewayv2_api.egemoroglu-user-api.id
  name        = "$default"
  auto_deploy = true

}

resource "aws_lambda_permission" "egemoroglu-user-permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.egemoroglu-user-server.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.egemoroglu-user-api.execution_arn}/*/*/*"

}

resource "aws_apigatewayv2_api" "egemoroglu-todo-api" {
  name          = "egemoroglu-todo-api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["Authorization", "Content-Type", "X-Amz-Date", "X-Amz-Security-Token", "X-Api-Key"]

  }

}

resource "aws_apigatewayv2_integration" "egemoroglu-todo-integration" {
  api_id                 = aws_apigatewayv2_api.egemoroglu-todo-api.id
  integration_type       = "AWS_PROXY"
  integration_method     = "ANY"
  integration_uri        = aws_lambda_function.egemoroglu-todo-server.arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "todo-route" {
  api_id    = aws_apigatewayv2_api.egemoroglu-todo-api.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.egemoroglu-todo-integration.id}"
}

resource "aws_apigatewayv2_stage" "egemoroglu-todo-stage" {
  api_id      = aws_apigatewayv2_api.egemoroglu-todo-api.id
  name        = "$default"
  auto_deploy = true

}

resource "aws_lambda_permission" "egemoroglu-todo-permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.egemoroglu-todo-server.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.egemoroglu-todo-api.execution_arn}/*/*/*"

}

output "user_api_url" {
  value = aws_apigatewayv2_api.egemoroglu-user-api.api_endpoint

}

output "todo_api_url" {
  value = aws_apigatewayv2_api.egemoroglu-todo-api.api_endpoint

}

resource "aws_dynamodb_table" "ege_todo" {
  name         = "ege_todo"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "todoId"
  attribute {
    name = "todoId"
    type = "S"
  }
  attribute {
    name = "title"
    type = "S"
  }
  attribute {
    name = "username"
    type = "S"
  }
  attribute {
    name = "status"
    type = "S"
  }
  global_secondary_index {
    name            = "username-index"
    hash_key        = "username"
    projection_type = "ALL"
  }
  global_secondary_index {
    name            = "status-index"
    hash_key        = "status"
    projection_type = "ALL"
  }
  global_secondary_index {
    name            = "title-index"
    hash_key        = "title"
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "ege_user" {
  name         = "ege_user"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "password"
    type = "S"
  }
  global_secondary_index {
    name            = "password-index"
    hash_key        = "password"
    projection_type = "ALL"
  }

}