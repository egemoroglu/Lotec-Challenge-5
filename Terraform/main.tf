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
    bucket_id = aws_s3_bucket.egemoroglu-lotec-challenge-5-frontend.bucket
  }

  provisioner "local-exec" {
    command = "aws s3 sync ../ClientSide/dist s3://${aws_s3_bucket.egemoroglu-lotec-challenge-5-frontend.bucket}"

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

resource "null_resource" "zip_and_sync_todo" {
  triggers = {
    bucket_id = aws_s3_bucket.egemoroglu-lambda-bucket.bucket
  }

  provisioner "local-exec" {
    command = "bash -c ./../ServerSide/zip_servers.sh"
  }

  provisioner "local-exec" {
    command = "aws s3 cp ../ServerSide/todo-server.zip s3://${aws_s3_bucket.egemoroglu-lambda-bucket.bucket}"

  }

}

resource "null_resource" "zip_and_sync_user" {
  triggers = {
    bucket_id = aws_s3_bucket.egemoroglu-lambda-bucket.bucket

  }

  provisioner "local-exec" {
    command = "bash -c ./../ServerSide/zip_servers.sh"
  }

  provisioner "local-exec" {
    command = "aws s3 cp ../ServerSide/user-server.zip s3://${aws_s3_bucket.egemoroglu-lambda-bucket.bucket}"

  }

}

resource "aws_iam_role" "lambda-role" {
  name = "lambda-role"

  assume_role_policy = jsondecode({
    version = "2012-10-17"
    statement = [
      {
        action = "sts:AssumeRole",
        effect = "Allow",
        sid = "aws-iam-role",
        principals = {
          service = "lambda.amazonaws.com"
        
        }
      }
    ]
  })
  
}
resource "aws_iam_role_policy" "lambda-policy" {
  name = "lambda-policy"
  role = aws_iam_role.lambda-role.id

  policy = jsondecode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Effect   = "Allow",
        Resource = "arn:aws:logs:*:*"
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
  filename= "s3://${aws_s3_bucket.egemoroglu-lambda-bucket.bucket}/todo-server.zip"
  function_name = "egemoroglu-todo-server"
  role = aws_iam_role.lambda-role.arn
  handler = "handler.handler"
  runtime = "nodejs18.x"
  source_code_hash = filebase64sha256("../ServerSide/todo-server.zip")

  depends_on = [ 
    null_resource.zip_and_sync_todo
   ]
  
}

resource "aws_lambda_function" "egemoroglu-user-server" {
  filename= "s3://${aws_s3_bucket.egemoroglu-lambda-bucket.bucket}/user-server.zip"
  function_name = "egemoroglu-user-server"
  role = aws_iam_role.lambda-role.arn
  handler = "handler.handler"
  runtime = "nodejs18.x"
  source_code_hash = filebase64sha256("../ServerSide/user-server.zip")

  depends_on = [ 
    null_resource.zip_and_sync_user
   ]
  
}

resource "aws_api_gateway_rest_api" "egemoroglu-todo-api" {
  name = "egemoroglu-todo-api"
  description = "This is the API for the todo application"
  
}

resource "aws_api_gateway_resource" "egemoroglu-todo-api-resource" {
  rest_api_id = aws_api_gateway_rest_api.egemoroglu-todo-api.id
  parent_id = aws_api_gateway_rest_api.egemoroglu-todo-api.root_resource_id
  path_part = "todo"
  
}

resource "aws_api_gateway_method" "egemoroglu-todo-method" {
  rest_api_id = aws_api_gateway_rest_api.egemoroglu-todo-api.id
  resource_id = aws_api_gateway_resource.egemoroglu-todo-api-resource.id
  http_method = "GET"
  authorization = "NONE"
  
}

resource "aws_api_gateway_integration" "egemoroglu-todo-integration" {
  rest_api_id = aws_api_gateway_rest_api.egemoroglu-todo-api.id
  resource_id = aws_api_gateway_resource.egemoroglu-todo-api-resource.id
  http_method = aws_api_gateway_method.egemoroglu-todo-method.http_method
  integration_http_method = "GET"
  type = "AWS_PROXY"
  uri = aws_lambda_function.egemoroglu-todo-server.invoke_arn
}

resource "aws_lambda_permission" "todogw-lambda" {
  statement_id = "AllowAPIGatewayInvoke"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.egemoroglu-todo-server.function_name
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.egemoroglu-todo-api.execution_arn}/*/*"
  
}

output "todo-api-url" {
  value = "${aws_api_gateway_rest_api.egemoroglu-todo-api.execution_arn}/todos"
  
}

resource "aws_api_gateway_rest_api" "egemoroglu-user-api" {
  name = "egemoroglu-user-api"
  description = "This is the API for the user application"
  
}

resource "aws_api_gateway_resource" "egemoroglu-user-api-resource" {
  rest_api_id = aws_api_gateway_rest_api.egemoroglu-user-api.id
  parent_id = aws_api_gateway_rest_api.egemoroglu-user-api.root_resource_id
  path_part = "user"
  
}

resource "aws_api_gateway_method" "egemoroglu-user-method" {
  rest_api_id = aws_api_gateway_rest_api.egemoroglu-user-api.id
  resource_id = aws_api_gateway_resource.egemoroglu-user-api-resource.id
  http_method = "GET"
  authorization = "NONE"
  
}

resource "aws_api_gateway_integration" "egemoroglu-user-integration" {
  rest_api_id = aws_api_gateway_rest_api.egemoroglu-user-api.id
  resource_id = aws_api_gateway_resource.egemoroglu-user-api-resource.id
  http_method = aws_api_gateway_method.egemoroglu-user-method.http_method
  integration_http_method = "GET"
  type = "AWS_PROXY"
  uri = aws_lambda_function.egemoroglu-user-server.invoke_arn
}

resource "aws_lambda_permission" "usergw-lambda" {
  statement_id = "AllowAPIGatewayInvoke"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.egemoroglu-user-server.function_name
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.egemoroglu-user-api.execution_arn}/*/*"
  
}

output "user-api-url" {
  value = "${aws_api_gateway_rest_api.egemoroglu-user-api.execution_arn}/users"
  
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