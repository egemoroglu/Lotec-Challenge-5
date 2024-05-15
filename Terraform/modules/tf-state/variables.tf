variable "bucket_name" {
    description = "Remote S3 Bucket Name"
    type = string
    validation {
      condition = can(regex("^[a-z0-9-]*$", var.bucket_name))
      error_message = "value must be lowercase letters, numbers, and hyphens only"
    }
  
}