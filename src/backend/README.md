# Application Setup Instructions

To set up this application on your local machine, please follow the instructions below:

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)

## Installation

1. Navigate to the project directory:

    cd src/backend

2. Run the Dockerfile + Docker Compose script

    docker-compose up --build

This will start the server and the application will be accessible at `http://localhost:8000`.

## API (/practice)
Input: Bytes (Audio)
Takes in browser based audio to the /practice route. 

Output - No Output yet