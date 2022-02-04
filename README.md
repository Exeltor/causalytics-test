# Causalytics Test

This test is comprised of two parts: Backend and Frontend
All considerations of code structure and alternative methods of implementation are detailed in the code comments. This file serves as a general overview of the implementation.

Aside from the requirements of the task, I have also added additional charts for Spend and Clicks (relevant metrics for the CPC) with a v-window slider, where the user can switch between the chart he wishes to see (charts split by weeks as per the task). Aside from that, I have also added the CPC, Spend and Clicks averages for the entire campaign, and a more condensed week-by-week summary of CPC, Spend and Clicks.

Lastly, if there were to be multiple campaigns running at the same time, the client and server are fully adapted to handle multiple campaigns. On the server side, I have implemented a grouping function, which arranges all the results received from the Facebook API by the campaign ID, and on the client side, I have a added a toggle to switch between all campaigns received from the endpoint so the user can choose which campaign to review.

Since there is only one campaign, the dropdown and the API responds only with one campaign group, but the implementation is fully adapted to support the switching.

## How to run
In separate terminals, navigate to the client and server folders respectively, then

- Create the .env file in the server folder, with the content `ACCESS_TOKEN=<FB_TOKEN>`
- In the client folder: `npm install && npm run serve`
- In the server folder: `npm install && npm run dev`

## Backend -Server folder

The backend is implemented in Node.js, with the additional use of the following packages:

- Express.js:  Library used to allow for easy implementation of the API endpoints and configuration
- Dotenv: Used in order to import environment variables from a .env file
- Cors: Used in order to circumvent Cors errors in localhost, but would be used to increase the security of the backend in the case of a production application
- FB: Facebook API wrapper to have easy access to the Facebook endpoints and Access Token injection

The directory structure is laid out similarly to a production application, which entails separation of concerns where each file is responsible for a core functionality of the backend (separate files for setup, routes, endpoints for specific services)

The only endpoint available in the API is as follows: 

    GET /facebook/getCpc

## Frontend - Client folder

There are alternatives for the implementation written in the code comments, especially for production use cases and reusability

The frontend is implemented with Vue 2 and Vuetify 2, with the additional use of the following packages:

- Chart.js: Core library to render charts
- vue-chartjs: Wrapper for the Chart.js library for quick implementation


