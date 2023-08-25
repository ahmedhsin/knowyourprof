# API Documentation

## Table of Contents

- [Admin Actions](#admin-actions)
- [Authentication](#authentication)
- [Reactions](#reactions)
- [Reviews](#reviews)
- [Professors](#professors)
- [Facilities](#facilities)

---

## Admin Actions

### /admin/reviews/pending (GET)
Retrieve pending reviews that require approval.

### /admin/reviews/<string:id>/approve (POST)
Approve a pending review by ID.

### /admin/reviews/<string:id>/reject (POST)
Reject and delete a pending review by ID.

### /admin/reviews/approved/all (GET)
Retrieve all approved reviews along with the approving admin's name.

---

## Authentication

### /auth/register (POST)
Register a new user or admin.

### /auth/login (POST)
Log in a user or admin.

### /auth/logout (POST)
Log out a user or admin.

---

## Reactions

### /react/reviews/<string:id>/react (POST)
Manage reactions (likes/dislikes) on a specific review by ID.

### /react/reviews/<string:id>/react/count (GET)
Get the count of upvotes (likes) and downvotes (dislikes) for a specific review by ID.

---

## Reviews

### /reviews/all (GET)
Retrieve a list of all approved reviews.

### /reviews/<string:id> (GET)
Retrieve details of a specific approved review by ID.

### /reviews/<string:id> (PUT, DELETE)
Update or delete a specific review by ID.

---

## Professors

### /profs/all (GET)
Retrieve a list of all approved professors with their associated facilities.

### /profs/filter (GET)
Filter professors based on various criteria.

### /profs/<string:id> (GET)
Retrieve details of a specific approved professor by ID.

### /profs/<string:id>/reviews (GET)
Retrieve approved reviews for a specific professor by ID.

### /profs/new (POST)
Add a new professor.

### /profs/<string:id>/reviews/new (POST)
Add a new review for a specific professor by ID.

---

## Facilities

### /facilities/all (GET)
Retrieve a list of all facilities.

### /facilities/filter (GET)
Filter facilities based on specific criteria.


---
## Flask API Endpoint Analysis for Admin Actions

### Route: /admin/reviews/pending (GET)
- **Path:** `/admin/reviews/pending`
- **Method:** GET
- **Purpose:** Retrieve pending reviews that require approval.
- **Response:** JSON response containing a list of pending reviews.
  ```json
  [
    {
      "id": ...,
      "text": ...,
      ...
    },
    ...
  ]
  ```

### Route: /admin/reviews/<string:id>/approve (POST)
- **Path:** `/admin/reviews/<string:id>/approve`
- **Method:** POST
- **Purpose:** Approve a pending review by ID.
- **Response:** JSON response with approved review details.
  ```json
  {
    "id": ...,
    "text": ...,
    ...
  }
  ```

### Route: /admin/reviews/<string:id>/reject (POST)
- **Path:** `/admin/reviews/<string:id>/reject`
- **Method:** POST
- **Purpose:** Reject and delete a pending review by ID.
- **Response:** JSON response indicating successful deletion.

### Route: /admin/reviews/approved/all (GET)
- **Path:** `/admin/reviews/approved/all`
- **Method:** GET
- **Purpose:** Retrieve all approved reviews along with the approving admin's name.
- **Response:** JSON response containing a list of approved reviews.
  ```json
  [
    {
      "id": ...,
      "text": ...,
      "approved_by": ...
    },
    ...
  ]
  ```

### Route: /admin/profs/pending (GET)
- **Path:** `/admin/profs/pending`
- **Method:** GET
- **Purpose:** Retrieve pending professor profiles that require approval.
- **Response:** JSON response containing a list of pending professor profiles.

### Route: /admin/profs/<string:id>/approve (POST)
- **Path:** `/admin/profs/<string:id>/approve`
- **Method:** POST
- **Purpose:** Approve a pending professor profile by ID.
- **Response:** JSON response with approved professor profile details.

### Route: /admin/profs/<string:id>/reject (POST)
- **Path:** `/admin/profs/<string:id>/reject`
- **Method:** POST
- **Purpose:** Reject and delete a pending professor profile by ID.
- **Response:** JSON response indicating successful deletion.

### Route: /admin/profs/approved/all (GET)
- **Path:** `/admin/profs/approved/all`
- **Method:** GET
- **Purpose:** Retrieve all approved professor profiles along with the approving admin's name.
- **Response:** JSON response containing a list of approved professor profiles.

---

## Flask API Endpoint Analysis for Authentication

### Route: /auth/register (POST)
- **Path:** `/auth/register`
- **Method:** POST
- **Purpose:** Register a new user or admin.
- **Request Body:** JSON data with user/admin registration details.
  ```json
  {
    "email": ...,
    "password": ...,
    "name": ...,
    "type": ...,
    "gender": ...
  }
  ```
- **Response:** JSON response with registered user/admin details.
  ```json
  {
    "email": ...,
    "id": ...,
    "role": ...
  }
  ```

### Route: /auth/login (POST)
- **Path:** `/auth/login`
- **Method:** POST
- **Purpose:** Log in a user or admin.
- **Request Body:** JSON data with user/admin login details.
  ```json
  {
    "email": ...,
    "password": ...,
    "type": ...
  }
  ```
- **Response:** JSON response with logged in user/admin details.
  ```json
  {
    "email": ...,
    "id": ...,
    "role": ...
  }
  ```

### Route: /auth/logout (POST)
- **Path:** `/auth/logout`
- **Method:** POST
- **Purpose:** Log out a user or admin.
- **Response:** JSON response indicating successful logout or not logged in.

---


## Flask API Endpoint Analysis for Reactions

### Route: /react/reviews/<string:id>/react (POST)
- **Path:** `/react/reviews/<string:id>/react`
- **Method:** POST
- **Purpose:** Manage reactions (likes/dislikes) on a specific review by ID.
- **Request Body:** JSON data with the react value (True for like, False for dislike).
  ```json
  {
    "react": ...
  }
  ```
- **Response:** JSON response containing reaction details.
  ```json
  {
    "id": ...,
    "user_id": ...,
    "review_id": ...,
    "react": ...
  }
  ```

### Route: /react/reviews/<string:id>/react/count (GET)
- **Path:** `/react/reviews/<string:id>/react/count`
- **Method:** GET
- **Purpose:** Get the count of upvotes (likes) and downvotes (dislikes) for a specific review by ID.
- **Response:** JSON response containing the count of upvotes and downvotes.
  ```json
  {
    "upvotes": ...,
    "downvotes": ...
  }
  ```

---
## Flask API Endpoint Analysis for Reviews

### Route: /reviews/all (GET)
- **Path:** `/reviews/all`
- **Method:** GET
- **Purpose:** Retrieve a list of all approved reviews.
- **Response:** JSON response containing a list of approved reviews.
  ```json
  [
    {
      "id": ...,
      "text": ...,
      "rating": ...,
      ...
    },
    ...
  ]
  ```

### Route: /reviews/<string:id> (GET)
- **Path:** `/reviews/<string:id>`
- **Method:** GET
- **Purpose:** Retrieve details of a specific approved review by ID.
- **Response:** JSON response containing details of the review.
  ```json
  {
    "id": ...,
    "text": ...,
    "rating": ...,
    ...
  }
  ```

### Route: /reviews/<string:id> (PUT, DELETE)
- **Path:** `/reviews/<string:id>`
- **Methods:** PUT, DELETE
- **Purpose:** Update or delete a specific review by ID.
- **Request (PUT) Body:** JSON data for updating review details.
  ```json
  {
    "text": ...,
    "rating": ...,
    "anonymous": ...
  }
  ```
- **Response (PUT):** JSON response containing updated review details.
  ```json
  {
    "id": ...,
    "text": ...,
    "rating": ...,
    ...
  }
  ```
- **Response (DELETE):** JSON response indicating successful deletion.
  ```json
  {
    "deleted": "true"
  }
  ```

---
## Flask API Endpoint Analysis for Profs

### Route: /profs/all (GET)
- **Path:** `/profs/all`
- **Method:** GET
- **Purpose:** Retrieve a list of all approved professors with their associated facilities.
- **Response:** JSON response containing details of all approved professors and their associated facilities.
  ```json
  [
    {
      "id": ...,
      "name": ...,
      "facilities": [...],
      ...
    },
    ...
  ]
  ```

### Route: /profs/filter (GET)
- **Path:** `/profs/filter`
- **Method:** GET
- **Purpose:** Filter professors based on name, facility, and other criteria.
- **Parameters:**
  - `name` (optional): Name of the professor to filter by (minimum 3 characters required).
  - `facility` (optional): Name of the facility associated with the professor.
  - `page` (optional): Page number for paginated results (default: 1).
  - `limit` (optional): Limit on the number of results to retrieve (default: 0, no limit).
  - `per_page` (optional): Number of results per page for pagination (default: 10).
- **Response:**
  - If `limit` is not provided, paginated results with a `hasNext` flag:
    ```json
    {
      "hasNext": ...,
      "profs": [
        {
          "id": ...,
          "name": ...,
          "facilities": [...],
          ...
        },
        ...
      ]
    }
    ```
  - If `limit` is provided, a list of filtered professors.

### Route: /profs/<string:id> (GET)
- **Path:** `/profs/<string:id>`
- **Method:** GET
- **Purpose:** Retrieve details of a specific approved professor by ID.
- **Response:** JSON response containing details of the professor and their associated facilities.
  ```json
  {
    "id": ...,
    "name": ...,
    "facilities": [...],
    ...
  }
  ```

### Route: /profs/<string:id>/reviews (GET)
- **Path:** `/profs/<string:id>/reviews`
- **Method:** GET
- **Purpose:** Retrieve approved reviews for a specific professor by ID.
- **Response:** JSON response containing a list of approved reviews for the professor.
  ```json
  [
    {
      "id": ...,
      "text": ...,
      "rating": ...,
      ...
    },
    ...
  ]
  ```

### Route: /profs/new (POST)
- **Path:** `/profs/new`
- **Method:** POST
- **Purpose:** Add a new professor.
- **Request Body:** JSON data with professor details and associated facilities.
  ```json
  {
    "name": ...,
    "facilities": [...],
    "gender": ...
  }
  ```
- **Response:** JSON response with the name and ID of the added professor.

### Route: /profs/<string:id>/reviews/new (POST)
- **Path:** `/profs/<string:id>/reviews/new`
- **Method:** POST
- **Purpose:** Add a new review for a specific professor by ID.
- **Request Body:** JSON data with review details.
  ```json
  {
    "text": ...,
    "rating": ...
  }
  ```
- **Response:** JSON response with a shortened review text and review ID.

---

## Flask API Endpoint Analysis for Facilities

### Route: /facilities/all (GET)
- **Path:** `/facilities/all`
- **Method:** GET
- **Purpose:** Retrieve a list of all facilities.
- **Response:** JSON response containing details of all facilities.
  ```json
  [
    {
      "id": ...,
      "name": ...,
      ...
    },
    ...
  ]
  ```

### Route: /facilities/filter (GET)
- **Path:** `/facilities/filter`
- **Method:** GET
- **Purpose:** Filter facilities based on specific criteria.
- **Parameters:**
  - `name` (optional): Name of the facility to filter by (minimum 3 characters required).
  - `page` (optional): Page number for paginated results (default: 1).
  - `limit` (optional): Limit on the number of results to retrieve (default: 0, no limit).
  - `per_page` (optional): Number of results per page for pagination (default: 10).
- **Response:**
  - If `limit` is not provided, paginated results with a `hasNext` flag:
    ```json
    {
      "hasNext": ...,
      "allFacilities": [
        {
          "id": ...,
          "name": ...,
          ...
        },
        ...
      ]
    }
    ```
  - If `limit` is provided, a list of filtered facilities.

---
#### Documentation generated by chatgpt 😍
#### Developed by Ahmed Mubarak 🥰
---
