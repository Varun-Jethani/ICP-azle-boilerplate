# Buy Me A Coffee DApp

This TypeScript project implements a Buy Me A Coffee DApp using Express.js, providing users with the ability to make donations, view donation records, and access details of specific donations. Leveraging a persistent storage solution, donations are stored securely, ensuring data integrity across system upgrades. The application offers a set of RESTful API endpoints for handling donation creation, retrieval, and optional update and deletion functionalities. Each donation is represented by a unique ID and includes essential details such as the donation amount, donor name, message, and creation timestamp. With error handling mechanisms in place, the DApp ensures smooth user interactions while maintaining data accuracy.

## Features

- **Donation Creation**: Users can create new donation records by submitting donation details via the `/donations` endpoint.
- **Donation Retrieval**: The `/donations` endpoint allows users to retrieve a list of all donation records.
- **Individual Donation Details**: Users can access details of a specific donation record by providing its unique ID to the `/donations/:id` endpoint.
- **Persistent Storage**: Utilizes a StableBTreeMap data structure to store donation records persistently, ensuring data durability across system upgrades.
- **Timestamp Handling**: Donation records include creation timestamps generated accurately using a dedicated function.
- **Error Handling**: Provides basic error handling for scenarios such as invalid requests or missing donation records, returning appropriate HTTP status codes and error messages.

