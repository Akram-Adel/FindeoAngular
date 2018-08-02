#### General notes
- Default language is arabic
- Default city is Baghdad
- Top menu to include "Agents Directory" to list all agents with a search by city box at the top


### Getting started:
Below are the sections that require interactions with the API (see below for more detailes).

#### User management
##### New user sign up (email activation not configured yet so you will need to activate the user via the admin) - include sign up by google, facebook and twitter
##### Reset password (while logged in)
##### Update profile details
##### Forget password

#### Ad management
##### Create a new ad
##### Modifying existing ad - add/remove images, update details...etc

#### Agent management
##### Sign up an agent - basically a user sign up and agent creating forms on one page (see below)
##### Update agent details

#### Search properties (see below)

#### Search agents (see below)



#### Search properties:
Search properties: /api/public/properties

sample search query with all possible options (only serviceType is a required option):


        /api/public/properties?
            serviceType.in=SALE&
            cityId.equals=1&
            price.greaterOrEqualThan=500&
            price.lessOrEqualThan=500000&
            propertyType.in=HOUSE&
            propertyType.in=UNIT&
            regionId.equals=2&
            landSize.greaterOrEqualThan=200&
            bedrooms.greaterOrEqualThan=2&
            bathrooms.greaterOrEqualThan=2



View single property: /api/public/{id}

#### Search agents
Search /api/public/agents

View single agent: /api/public/agents/{Id}

#### User sign up
POST a request to /api/register

        {
          "email": "string@ggg.com",
          "login": "string@ggg.com",
          "password": "Pass@2018",
          "firstName": "Test user",
          "langKey": "ar"
        }

You will need to activate the user via the API
1. Retrieve all users api/users
2. Then find the user just created and submit a PUT request to: /api/users

         {
           "id": 6,
           "login": "string@ggg.com",
           "firstName": "Test user",
           "lastName": null,
           "email": "string@ggg.com",
           "imageUrl": null,
           "activated": true,
           "langKey": "ar",
           "createdBy": "admin",
           "createdDate": "2018-06-28T01:47:03Z",
           "lastModifiedBy": "admin",
           "lastModifiedDate": "2018-06-28T01:47:03Z",
           "authorities": [
             "ROLE_USER"
           ]
         }



#### User login
Post the below to to /api/authenticate

        {
          "username": "user@email.com",
          "password": "password"

        }

        headers:
        Content-Type: application/json
        Accept: application/json

The above request will return a JWT token "id_token" that needs to be stored in the app for subsequent requests.

        {
            "id_token": "token-string"
        }


To pass the token in the request, include the below header in the request:

         Authorization: Bearer token-string

NOTE: make sure you include the "Bearer " before the token-string



#### Creating a new ad

- If the user is NOT logged in, he/she may have an account already see here is how we deal with it:
At the end of the create a new ad page show a radio option with "I am an existing user" and "I don't have account".
If the first option is selected show the the login form. If the second option is selected, show the sign up new user form.


1. create an ad by posting to:

/api/ads

        {
            "userId": 10 <--- current user id
        }

Response:

        {
          "id": 37,
          "status": "PENDING",
          "createdTs": null,
          "modifiedTs": null,
          "startDate": "2018-06-11T09:28:59.540Z",
          "finishDate": "2018-08-10T09:28:59.540Z",
          "userId": 10
        }

2. Take ad id above and use it to populate the adId in the create property request:
To create a property, you will first need to make the user choose the main city from a drop down. Use the below route to retrieve the city list:

        /api/regions?parentId.equals=0&countryId.equals=1

Once a city has been selected, the user need to enter the name of the area in the area field.
This field should perform an auto-complete functionality (see below) as the user types three letters or more.

The next step is for the user to pin point the location of the property on the map see this for example http://iq.waseet.net/ar/add/realestate/step_one
The lng and lat from the pin point to be inserted in the location request below.

The next step is create the location by posting to the following:
api/locations

Request:
        {
          "city": " الكرخ - الكاظميه - الرحمانيه - المنصور",
          "street": "Near ABC School",
          "lat": 22.234234,  <--- the lat from user map pin
          "lng": 33.234234, <--- the lng from user map pin
          "regionId": 1, <--- main city id from drop down
          "regionCityId": 112233 <--- this id returned from the auto complete function or null not found
        }

response:

        {
          "id": 39,
          "city": " الكرخ - الكاظميه - الرحمانيه - المنصور",
          "street": "Near ABC School",
          "postalCode": null,
          "lat": 22.234234,
          "lng": 33.234234,
          "regionId": 1,
          "regionCityId": 112233
        }

There are several types of properties to submit. The data submitted depends on the property type selected by the user.
Available Property types are:

        HOUSE, UNIT, LAND, FARM


#### Price field to be displayed/enabled once the propertyType and serviceType have been selected
Check the support APIs list below.

#####a. HouseProperty
post to api/house-properties

        {
          "adId": 37, <--- from create ad response
          "ageType": "BRAND_NEW",
          "bathrooms": 2,
          "bedrooms": 4,
          "propertyType": "HOUSE",
          "serviceType": "SALE",
          "buildingQuality": "FIRST_CLASS",
          "currency": "MILLION_IQD",
          "price": 250,
          "priceType": "SALE_PER_METER",
          "description": "Some description",
          "landSize": 200,
          "landSizeMeasureType": "SQUARE_METER",
          "locationId": 39, <--- from create location request above
          "title": "string"
        }

Response:

        {
          "id": 38,
          "serviceType": "RENTAL",
          "title": "string",
          "description": "Some description",
          "propertyType": "HOUSE",
          "serviceType": "SALE",
          "buildingQuality": "FIRST_CLASS",
          "currency": "MILLION_IQD",
          "price": 250,
          "priceType": "SALE_PER_METER",
          "adId": 37,
          "locationId": 39,
          "landSize": 200,
          "bedrooms": 4,
          "bathrooms": 2,
          "ageType": "BRAND_NEW",
          "buildingSize": null,
          "buildSizeMeasureType": "SQUARE_METER",
          "buildingQuality": "FIRST_CLASS"
        }

####b. UnitProperty
post to api/unit-properties

        {
          "adId": 38,
          "ageType": "BRAND_NEW",
          "bathrooms": 2,
          "bedrooms": 4,
          "buildingQuality": "FIRST_CLASS",

          "price": 1000,
          "priceType": "RENTAL_MONTHLY",
          "currency": "USD",
          "serviceType": "RENTAL",

          "description": "Some description",
          "landSize": 200,
          "landSizeMeasureType": "SQUARE_METER",
          "locationId": 40,
          "propertyType": "UNIT",
          "title": "string"
        }


####c. LandProperty
post to api/land-properties

        {
          "adId": 39,
          "currency": "IQD",
          "description": "Land ad description",
          "landSize": 1000,
          "landSizeMeasureType": "SQUARE_METER",
          "locationId": 41,
          "price": 330,
          "priceType": "SALE_PER_METER",
          "propertyType": "LAND",
          "serviceType": "SALE",
          "title": "Land ad title"
        }


####d. FarmProperty
post to api/farm-properties

        {
          "adId": 40,
          "currency": "MILLION_IQD",
          "description": "Farm description",
          "landSize": 10,
          "landSizeMeasureType": "DUNAM",
          "locationId": 42,
          "price": 100,
          "priceType": "SALE_PER_DUNAM",
          "propertyType": "FARM",
          "serviceType": "SALE",
          "title": "Farm title"
        }

##### add images to a property
Adding property images involves the following steps:
1. Uploading an image (see the upload image section above) - the process should be similar to see http://iq.waseet.net/ar/add/realestate/step_one
So the above will result in a number of image id's returned to you.
2. Once the user finalise the ad/property record has been created, you will need create a propertyImage record for each of the uploaded images
To creating a propertyImage record
POST to /api/property-images

        {
          "imageId": 2, <-- the image id
          "position": 1, <--- this is the position of the image assuming that the user can drag/drop images around to change their positions
          "propertyId": 1 <-- the created propertyId
        }



There are 4 steps to upload property images
Images will need to uploaded to S3 first (see upload images section below)

#### add agent account
POST a request to /api/agents

        {
          "name": "agent name", <-- required
          "description": "some description", <--- required
          "phone": "0402456521", <--- required
          "email": "agent@gg.com", <-- required
          "website": "abx@g.com",
          "logoId": 1234, <--- see the upload images section
          "userId": 25, <---- hence the user needs to be created first
          "locationId": 47 <--- see how to create a location above
        }

##### update agent
PUT request to /api/agents

        {
          "id": 99,
          "name": "agent name", <-- required
          "description": "some description", <--- required
          "phone": "0402456521", <--- required
          "email": "agent@gg.com", <-- required
          "website": "abx@g.com",
          "logoId": 1234, <--- see the upload images section
          "userId": 25, <---- hence the user needs to be created first
          "locationId": 47 <--- see how to create a location above
        }

##### upload logo image for the agent
The agent can choose to upload a logo either at the time of creating an agent record or afterward
by editing his/her profile. The process is the same in both cases.

As the images are stored in Amazon S3, there are 3 steps to add a logo image to the agent.
1. Upload the image to S3 and get back the S3Key
POST (upload image) to /api/images/upload-image

Response:

        https://aliraqhomes-dev.s3.eu-central-1.amazonaws.com/media/agents/FAkAVDBjZjx.png

2. Create an image record in the system
POST to /api/images

        {
          "s3Path": "https://aliraqhomes-dev.s3.eu-central-1.amazonaws.com/media/agents/FAkAVDBjZjx.png"
        }

Response:

        {
          "id": 1,
          "thumbnail": "",
          "s3Path": "https://aliraqhomes-dev.s3.eu-central-1.amazonaws.com/media/agents/FAkAVDBjZjx.png"
        }


3. Add the image id to the the agent request being created/updated
POST or PUT to /api/agents


###Search regions (use with auto-complete)
submit a get request to:
    /api/regions/search/[main-city-id]/[three or more letters of the region (arabic) name]
    eg:
    api/regions/search/1/المنص

Response:
        {
          "35": "الكرخ - الكاظميه - الرحمانيه - المنصور",
          "165": "الكرخ - الكاظميه - الرحمانيه - المنصور - حي دراغ",
          "213": "الكرخ - الكاظميه - الرحمانيه - المنصور - المتنبي",
          "214": "الكرخ - الكاظميه - الرحمانيه - المنصور - حي المهندسين",
          "248": "الكرخ - الكاظميه - الرحمانيه - المنصور - 14رمضان",
          "413": "الكرخ - الكاظميه - الرحمانيه - المنصور - الماليه",
          "551": "الكرخ - اسكان المنصور",
          "707": "الكرخ - الكاظميه - الرحمانيه - المنصور - شارع الاميرات",
          "776": "الكرخ - الكاظميه - الرحمانيه - المنصور - الاسكان"
        }


###Support APIs list
Price types:

        /properties/price-types/{language}/{propertyType}/{serviceType}

Currency types:

        /properties/currency-types/{language}/{serviceType}

Property types:

        /properties/property-types/{language}

Building quality types:

        /properties/building-qualities/{language}

Age types:

        /properties/age-types/{language}

land measure types:

        /properties/land-measure-types/{language}/{propertyType}

Service types:

        /properties/service-types/{language}


