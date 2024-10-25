## Getting Started

This repository contains a detailed guide for installing, running, and using the application. Follow the steps below to set up the project in your local environment.

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:ElenaCherpakova/node-crud_api.git
   ```
2. Navigate to the project directory:

   ```bash
   cd node-crud_api
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy .env.example and rename to .env
   and set `PORT=<port number>`

```bash
    cp .env.example .env
```

### Running the Application

- Development mode
  ```bash
  npm run start:dev
  ```
- Production mode
  ```bash
  npm run start:prod
  ```

### Run test

```bash
  npm run jest
```

### Run cluster

```bash
 npm run start:multi
```

## API Endpoints

- **GET /api/users** - Retrieve all user records.  
  - **Response**: Status 200 with the list of users.

- **GET /api/users/{userId}** - Retrieve a user by ID.  
  - **Response**: Status 200 and user data if found, 400 for invalid `userId` (not UUID), or 404 if the user doesn’t exist.

- **POST /api/users** - Create a new user.  
  - **Response**: Status 201 with the new user record, or 400 if required fields are missing.

- **PUT /api/users/{userId}** - Update an existing user by ID.  
  - **Response**: Status 200 with updated data if successful, 400 for invalid `userId`, or 404 if the user doesn’t exist.

- **DELETE /api/users/{userId}** - Delete a user by ID.  
  - **Response**: Status 204 if deletion is successful, 400 for invalid `userId`, or 404 if the user doesn’t exist.

### User Object Structure
- **id** (string, UUID): Unique identifier generated on the server.
- **username** (string): Required name of the user.
- **age** (number): Required age of the user.
- **hobbies** (array of strings): Required list of hobbies.

```bash
{
  "username": "JohnDoe",
  "age": 30,
  "hobbies": ["reading", "coding"]
}
```

### Error Handling
- **Non-existing endpoints**: Return a 404 with a human-readable message.
- **Server-side errors**: Return a 500 with an appropriate message.
