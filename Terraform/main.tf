terraform {
    required_providers {
        aws = {
        source  = "hashicorp/aws"
        version = ">= 3.76.1"
        }
    }
}

resource "aws_dynamodb_table" "ege_todo" {
    name           = "ege_todo"
    billing_mode   = "PAY_PER_REQUEST"
    hash_key       = "id"
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
        name = "username-index"
        hash_key = "username"
        projection_type = "ALL" 
    }
    global_secondary_index {
        name = "status-index"
        hash_key = "status"
        projection_type = "ALL" 
    }
    global_secondary_index {
        name = "title-index"
        hash_key = "title"
        projection_type = "ALL" 
    }
}

resource "aws_dynamodb_table" "ege_user" {
    name = "ege_user"
    billing_mode = "PAY_PER_REQUEST"
    hash_key = "userId"
    attribute {
        name = "userId"
        type = "S"
    }

    attribute {
        name = "password"
        type = "S"
    }
    global_secondary_index {
        name = "password-index"
        hash_key = "password"
        projection_type = "ALL" 
    }
  
}