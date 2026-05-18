# Full-Stack Interview Assignment - Frontend

React frontend integration with Google Places Autocomplete API and Spring Boot backend for location persistence.

## Technology Stack
* **React 18**
* **Redux Toolkit** (State management via Redux Thunk)
* **Tailwind CSS** (Styling)
* **Axios** (HTTP client)
* **Vite** (Build tool)
* **Lucide React** (Icons)

## Features Implemented
* **Google Places Integration**: Implementation of programmatic Google Maps Places API (New).
* **State Persistence**: Redux Toolkit integrated with `localStorage` for search history persistence across sessions.
* **Responsive Design**: Modern UI layout built with Tailwind CSS, including dynamic notification systems.
* **API Integration**: Communication layer for interaction with the Spring Boot backend service.

## Setup & Execution Instructions

### 1. Dependency Installation
Execute the following command in the `frontend` directory:

```bash
npm install
```

### 2. API Configuration
The Google Maps API key is currently integrated within the application logic for review purposes. 

### 3. Application Execution
Start the development server with the following command:

```bash
npm run dev
```

The interface is accessible at **http://localhost:5173**.

## Functional Workflow
1. Ensure the backend service is operational on port `8080`.
2. Input a location into the search bar.
3. Selection of a location adds the entry to the search history.
4. Selection of "Mark as Favorite" triggers a `POST` request to the backend.
5. Success notifications confirm data persistence and weather data retrieval.
