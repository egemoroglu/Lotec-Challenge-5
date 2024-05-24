Lotec-Challenge-5

In this challenge, the aim it to implement the hexagonal architecture and domain driven design(DDD) along with the required Amazon Web Services. 

Functional Requirements
- User must be able to sign up with a username and password (User authentication and authorization required with cognito)
- User must be able to sign in with a username and password (User authentication and authorization required with cognito)
- User must be able to see all the tasks associated with them
- User must be able to add new tasks associated with them
- User must be able to delete, mark tasks completed/incompleted, update the task title and delete tasks
- User must be able to see the completed/incompleted tasks seperately

Technical Requirements
- Project must be implemented in hexagonal architecture and DDD
- Server side and client side must be seperated
- Server side must be seperated as user server and todo server
- Dependencies must not be installed under each server 
- There must be one package.json in the root, in Server side and Client side
- Workspaces must be configured in the root
- Servers must be built and zipped

AWS Requirements
- Frontend must be built and uploaded to S3
- CloudFront must be used to distribute the forntend
- Terraform tf-state must be stored in the S3
- Zipped server functions maybe stored in the S3 (optional and zipped servers can be directly uploaded to lambda)
- Lambda functions must be configured for both user server and todo server
- For both lambda functions api gateways must be configured to expose the lambda functions
- Cognito must be configured for authorization and authentication