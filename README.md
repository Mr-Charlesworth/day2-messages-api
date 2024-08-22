# Basic Messages API

## Authentication

### Register
- Method: POST
- Path: '/api/register'
- Request Body (JSON only):
```json
{
  "username": "string",
  "password": "string"
}
```
- Response Body (JSON):
```json
{
  "token": "string"
}
```

### Login
- Method: POST
- Path: '/api/login'
- Request Body (JSON only):
```json
{
  "username": "string",
  "password": "string"
}
```
- Response Body (JSON):
```json
{
  "token": "string"
}
```

## Authorised Endpoints

>All require the received token to be in the "authorization" header

### Get all messages:
- Method: GET
- Path: '/api/messages'
- Response Body (JSON):
```json
[
  {
    "username": "string",
    "id": "string",
    "message": "string"
  }
]
```
### Get single message:
- Method: GET
- Path: '/api/messages/:id'
- Response Body (JSON):
```json
{
  "username": "string",
  "id": "string",
  "message": "string"
}
```
### Create message:
- Method: POST
- Path: '/api/messages'
- Request Body (JSON):
```json
[
  {
    "message": "string"
  }
]
```
### Edit message:
- Method: PUT
- Path: '/api/messages/:id'
- Request Body (JSON):
```json
[
  {
    "message": "string"
  }
]
```
### Delete message:
- Method: DELETE
- Path: '/api/messages/:id'
