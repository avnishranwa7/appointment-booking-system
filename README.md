# Appointment Booking System

## Features
Implemented API endpoints to:
* register a new user using Firebase Authentication
* authenticate the user and return a JWT token for authorization
* GET /appointments - Retrieve all appointments
* POST /appointments - Create a new appointment
* GET /appointments/:id - Retrieve a specific appointment by it's id
* PUT /appointments/:id - Update a specific appointment by it's id
* DELETE /appointments/:id - Delete a specific appointment by it's id

Only authenticated users are allowed to access these endpoints
## Firebase Realtime Database Schema
Each appointment contains the following fields:
* ID (randomly generated)
* First Name
* Last Name
* Date
* Time

![Screenshot of Firebase Realtime Database Schema](https://github.com/avnishranwa7/appointment-booking-system/blob/main/Appointment-Schema.png)
