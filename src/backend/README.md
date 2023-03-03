# Application Setup Instructions

To set up this application on your local machine, please follow the instructions below:

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

- [Python 3.x](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installation/)
- [Git](https://git-scm.com/downloads)

## Installation

1. Navigate to the project directory:

    cd src/backend

2. Set the executable permissions for the `init.sh` and `dev_srv.sh` scripts by running the following commands:

    chmod +x ./init.sh
    chmod +x ./dev_srv.sh

These scripts are used to set up the project dependencies and start the development server respectively.

4. Run the `init.sh` script to create a virtual environment and install the project dependencies:

    ./init.sh

5. Once the dependencies are installed, you can start the development server by running the `dev_srv.sh` script:

    ./dev_srv.sh

This will start the server and the application will be accessible at `http://localhost:8000`.

## API
Input: Bytes (Audio)
Takes in browser based audio to the /listen route. 

Output - No Output yet