

## Prerequisites

Parafin Capital Integration Quickstart

This guide provides the necessary steps to clone a starter repository, configure your API keys, and launch a local application that embeds the Parafin Capital widget.

--
To complete this quickstart, you'll need the following installed and accessible:

| Tool/Access | Purpose | Link |
| :--- | :--- | :--- |
| **Parafin Dashboard** | Required for fetching Sandbox API keys. | [https://dashboard.parafin.com](https://dashboard.parafin.com) |
| **Node.js** | JavaScript runtime required to run the local application. | [https://nodejs.org/en/](https://nodejs.org/en/) |
| **Postman** | Used for executing initial setup calls (Create Business, Generate Offer). | [https://www.postman.com/](https://www.postman.com/) |

---

## Integration Instructions

### Step 1: Clone and Install Dependencies

First, clone the quickstart repository and install dependencies:

```bash
$ git clone https://github.com/RoboCOVA/parafin-take-home.git
$ cd parafin-take-home
$ npm install
```


### 2. Fetch and include API keys

Secure your application by setting up environment variables with your credentials.

Next, Navigate to the [Settings > API keys](https://dashboard.parafin.com/settings/api-keys) to retrieve your Sandbox Client ID and Client Secret.

Rename the `sample.env` file to `.env` and populate with your Client ID and Client secret.

```bash
$ mv sample.env .env
```

```bash
# .env
PARAFIN_CLIENT_ID="<your-client-id>"
PARAFIN_CLIENT_SECRET="<your-client-secret>"

```

### 3. Create Core Entities via API (Postman Setup)
Before an offer can be displayed, a minimum set of entities must exist on the Parafin platform.


Import the provided Postman Collection and Environment Variables into your Postman workspace.

Run the collection requests to successfully create a Business, a Person, and a Bank Account.

💡 Note: While these entities can also be created via the Parafin dashboard, using the API demonstrates a key automated integration capabilities


- Create a [Business](https://docs.parafin.com/api-reference/businesses/create-business), [Person](https://docs.parafin.com/api-reference/persons/create-person), and [Bank Account](https://docs.parafin.com/api-reference/bank-accounts/create-bank-account)
- [Generate a Capital Product Offer](https://docs.parafin.com/api-reference/sandbox-generate-events/%5Bexperimental%5D-capital-product-offer-created-sandbox) for the newly created Business


### 4.  Update Local Configuration
Update the .env file with the IDs returned from the newly created Business entity in Step 3.

```bash
# .env (append to existing keys)
BUSINESS_PARAFIN_ID="<business-parafin-id>"
BUSINESS_EXTERNAL_ID="<business-external-id>"

```



### Step 5: Configure the Widget (App.js)
Update the application code to target the newly created entities.

In the App.js file, replace the placeholder personId with the ID of the Person you created in Step 3 (e.g., person_xxx).


#### Step 6: Run the Application (No Offer State)
Launch the local development server. At this point, the application will be running but will display a 'No Offer' state because no capital product offer has been generated yet.

In the project directory, run:

```bash
$ npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app with an embedded Parafin Widget in your browser.


### Step 7: Generate a Capital Offer
Use the provided Postman collection to run the Generate Capital Product Offer request for the Parafin Business ID you configured.

Refresh the app at http://localhost:3000. The embedded widget will now display the pre-approved offer.

### Step 8: Pre-Approve the Offer

Use the provided Postman collection to approve the newly generated offer via the API. This action completes the full lifecycle test and confirms that the offer approval flow is functioning as expected.

### Step 9: “Capital Is on Its Way” State

By following the on-screen guidance in the embedded widget, the user can accept and consent to the offer, leading to the “Capital Is on Its Way” state. This demonstrates that the embedded experience successfully drives user intent through to approval.

### Step 10: Offer Accepted – Outstanding Balance

You can simulate this state by triggering the appropriate webhook event.
Although the embedded UI component also transitions to this state, the webhook trigger provides a reliable way to test the complete capital lifecycle.

Please refer to my demo videos for a walkthrough of the standard webhook trigger flow. A corresponding Postman collection is also included to help test the full capital webhook lifecycle end-to-end.