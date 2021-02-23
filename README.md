# Our World In News

*Our World In News* is a website which aims to show what's going on around the world. It therefore displays one of the top articles from one news source from various countries around the globe in a visual way.  
This repository contains the source code of the project.

Visit the site: [our-world-in-news.org](https://our-world-in-news.org)

## Technology Stack

The website is built with [Next.js](nextjs.org) and bootstrapped with *create-next-app*.  
On top of that it uses the following services:
- [Google Firestore](https://firebase.google.com) for caching the results returned from the news APIs
- [Google Secret Manager](https://cloud.google.com/secret-manager) for managing API keys
- [Microsoft Azure Translator](https://azure.microsoft.com/services/cognitive-services/translator/) for translations of the article snippets
- Various news APIs which can be queried by country and return top headlines

All services are available in free tiers with usage limits. Because news api responses are cached in firebase, even those with query rate limits can be used.  
Google Cloud Translate was used before, but Azure offers a 4 times higher limit in its free tier.

## Run It Locally

There are a few prerequisite steps before you can run the project:
1. [Set up a new Google Cloud project](https://cloud.google.com/resource-manager/docs/creating-managing-projects) and [create a service account with role *owner*](https://cloud.google.com/resource-manager/docs/access-control-proj).
2. [Set up the Google Secret Manager](https://cloud.google.com/secret-manager/docs/configuring-secret-manager).
3. [Set up a new private key for the service account](https://cloud.google.com/iam/docs/creating-managing-service-account-keys). Save the json file, you need to set some environment variables based on this file later.
4. [Set up a new Firebase project](https://firebase.google.com/docs/firestore/quickstart), create a firestore database and create a new private key under *Service Accounts* in the project settings. Copy the entire json file content and create a new secret in Google Secret Manager, named "firebase-access-key", and paste in the credentials as its value. 
5. Create a Microsoft Azure account if you haven't already. Then activate the [Azure Translator](https://docs.microsoft.com/de-de/azure/cognitive-services/translator/). You can find the api key in the left menu under *Keys and Endpoint*.
6. Set up the following environment variables. Either create a ".env.local" file in the project's root, or add real environment variables.
```bash
GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL="<the client email from the service account credentials file downloaded earlier>"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="<the private key from the service account credentials file downloaded earlier>"
FIREBASE_ACCESS_KEY="projects/<your-google-cloud-project-handle>/secrets/firebase-access-key/versions/1"
AZURE_TRANSLATOR_KEY="<one of the two keys you find in azure>"
AZURE_TRANSLATOR_REGION="<the region where you activated the translator in>"
```
7. Also add environment variables for the news APIs used as specified in *config/sourceConfig.json*. If you use the same sources as me, this is what you need to set up:
```bash
THE_NEWS_API_KEY="<the-key>"
NEWS_API_KEY="<the-key>"
```

Make sure that all project settings are configured in a way that will not overshoot your Google Cloud budget! Mainly look into the *config/sourceConfig.json* "ttl" property for each news api, which specifies how often to re-fetch from the apis (in milliseconds).

After all of that, you can clone the repository and run:
```bash
$ yarn
$ yarn build
$ yarn start
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.