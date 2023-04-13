
# Kupaliska FE

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template. It's using [Craco](https://www.npmjs.com/package/@craco/craco) to allow tailwind-css

## Development Setup

### Dependencies

Before you start you need to have [backend](https://dev.azure.com/bratislava-innovation/Inovacie/_git/kupaliska-starz-be) up and running.

Install dependencies:

```
npm install
```

### Environment

Set the `VITE_HOST` variable in `.env.development` file to **FULL URL** of the backend API. The default setup runs against local backend - if you don't have BE running on http://localhost:8000, or would like to develop against staging environment backend (you need to be connected to VPN), edit the `.env.development` file.

For additional informaion about VPN, please contact Martin Pinter or Patrik Kadlcik.

#### Recaptcha

To make recaptcha work properly, you need to set `VITE_RECAPTCHA_CLIENT_SECRET` variable from [reCAPTCHA Enterprise](https://console.cloud.google.com/security/recaptcha). From there use the `kupaliska.bratislava.sk` key. (It's same key as or backend) 
To get the credentials to login, please contact Martin Pintner or Patrik Kadlcik

### Start the app

To run locally:

```
npm run start
```

### Additional development information

#### Ordering

Testing credit card: *4263970000005262*

To make emails work after order, you have to be set in authorized recipients [here](https://app.mailgun.com/app/sending/domains/sandboxa9861f03a870473b83e62ffee945e664.mailgun.org) and when you are making order, enter the exact email.

## Deployment

The app can be deployed by standard means through [bratiska-cli](https://github.com/bratislava/bratiska-cli).

## Original create-react-app README below

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
