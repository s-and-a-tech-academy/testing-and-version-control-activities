# Day 2 Practical: API Testing with Postman Exercise
This exercise will guide you through making various API requests using Postman, inspecting responses, and writing basic tests (assertions) to verify API behavior.

Materials Required:
- Postman Desktop Application: Ensure you have Postman installed on your computer. If not, download it from postman.com/downloads.

- Internet Connection: To access the public API.

## Part 1: Guided Practice with a Public API (JSONPlaceholder)
We will be using JSONPlaceholder, a free fake API for testing and prototyping.

Base URL: https://jsonplaceholder.typicode.com

## Exercise Steps:
### Setting Up Postman & Your First GET Request

Open Postman and create a new HTTP Request.

GET Request (Fetch all posts): In the URL input field, enter https://jsonplaceholder.typicode.com/posts. Ensure the HTTP method is set to GET. Click the "Send" button.

**Observe:** Look at the "Response" section. You should see a list of JSON objects (posts), a Status: 200 OK, and response headers.

### Fetch a single post:

Change the URL to: https://jsonplaceholder.typicode.com/posts/1 (to get the post with ID 1).

Ensure the method is GET.

Click "Send".

**Observe:** You should now see a single JSON object representing post ID 1.

### Adding Assertions (Tests) to Your GET Request

Click on the Tests tab above the response body.

Enter the following JavaScript code to create a simple test:

        // Check if the status code is 200
        pm.test("Status code is 200", function () {
            pm.response.to.have.status(200);
        });

        // Parse the JSON response
        const responseData = pm.response.json();

        // Check if the response contains the expected ID
        pm.test("Response body has the correct ID", () => {
            pm.expect(responseData.id).to.eql(1);
        });

        // Check the data type of a property
        pm.test("Response body title is a string", () => {
            pm.expect(responseData.title).to.be.a("string");
        });

Click "Send" again.

**Observe:** Look at the "Test Results" tab. You should see all three tests passing.

## Part 2: Independent API Testing of a Local Banking Application
Now, you will work in pairs to create a complete test suite for our local banking application.

Local API Base URL: http://localhost:3000

### Setup:
- Ensure you have `Node.js` installed.

- In your terminal, navigate to the directory containing server.js.

- Run the server with the command: `node server.js`

You should see a message in the console that the server is running on http://localhost:3000.

## The Challenge:
Work with a partner to create a new Postman collection and write API tests for all the key endpoints of the banking application.

### Tasks:

#### Endpoint: POST /register

**Task:** Create a request to register a new user.

**Assertions:**
Verify the status code is 201 Created.

Ensure the response body contains a message property with a success message.

**Bonus:** Create a second request that attempts to register the same user. Assert that the status code is 409 Conflict and that an appropriate error message is returned.

#### Endpoint: POST /login

**Task:** Create a request to log in with the user you just registered.

**Assertions:**

Verify the status code is 200 OK.

Check for a success message in the response.

**Bonus:** Create a test for a failed login attempt (wrong password) and assert a 401 Unauthorized status code.

#### Endpoint: GET /balance

**Task:** Create a request to check the balance of the logged-in user.

**Assertions:**

Verify the status code is 200 OK.

Ensure the response body contains a balance property.

Check that the balance is a number.

#### Endpoint: POST /transfer

**Task:** Create a request to transfer funds from one user to another. You will need to register two users and log in as the sender first.

**Assertions:**

Verify the status code is 200 OK.

Check for a success message in the response.

**Bonus:** Create a test to verify that the transfer fails if the sender has insufficient funds. Assert that the status code is 400 Bad Request and the correct error message is returned.

#### Challenge: 
Can you use Postman to check the balances of both the sender and receiver after the transfer to confirm the amounts were updated correctly?