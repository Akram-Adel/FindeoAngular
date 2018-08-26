####General notes
- Demo theme link using PHP: https://findeo.realty/my-profile/
- Default language is arabic
- Default city is Baghdad
- Top menu to include "Agents Directory" to list all agents with a search by city box at the top
- The "My profile" page to include an option to add an agent (see how to create agent below)
- User sign up, the current form is fine: basically ask for email and password. 
When the user adds a new property, we may need to collect more details. There are basically two scenarios here: 
1. Individual: If the user is individual (not an agent profile), we will to ask the user to complete his profile by 
filling out out phone number, firstname and lastname. user avatar is optional (other fields in the theme can be removed)
2. Agent: if the user has an agent profile, we don't need to do anything as the ad will show agent details instead of user details. 

- "My properties" section should show 2 tabs at the top, Rentals and Sales
- The user should be able to edit his/her own properties by click on the edit button
- The user should be able to mark his/her own properties as Sold by clicking the "Mark it as sold" button - this will basically triger the update (PUT) property action with status set to "Sold".
   

#### Search properties: 
Search properties: /api/public/properties

sample search query with all possible options (only serviceType is required):


        /api/public/properties?
            serviceType.in=SALE&
            cityId.equals=1&
            price.greaterOrEqualThan=500&
            price.lessOrEqualThan=500000&
            propertyType.in=HOUSE&
            propertyType.in=UNIT&
            regionId.equals=2& <-- see below
            landSize.greaterOrEqualThan=200&
            bedrooms.greaterOrEqualThan=2&
            bathrooms.greaterOrEqualThan=2


        example: /api/public/properties
            ?serviceType.equals=SALE
            &adUserId.equals=13
            &regionId.in=158
            &cityId.equals=16
            &nearBy=true
            &sort.featured,desc&sort=ad.startDate,desc




sort by drop down to include the following: 
Featured
Most recent
Oldest
Cheaper
Most expensive

sort query: 
featured: &sort.featured,desc&sort=ad.startDate,desc
most recent: &sort=ad.startDate,desc
oldest: &sort=ad.startDate,asc
Cheapest: most recent: &sort=price,asc
Most expensive: most recent: &sort=price,desc

default sort is featured. 


##### loading property images
use the below to load property images. This needs to be called for each property.
 
Search result thumbnails: for each property in the list, call the below with ?position.equals=1&propertyId.equals=[property-id] . 
This will return the first image, you basically need to get the thumbnail s3Path and load it  

        /api/public/property-images?position.equals=1&propertyId.equals=1

To load all images for a given property, use the same URL above but without the position parameter. eg: 

        /api/public/property-images?propertyId.equals=[property-id]

#### viewing a single property
GET request to : /api/public/properties/{id}
        
        
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
        

#### user account
To get user profile details, see the profile section belwo

view: GET api/account

        {
          "id": 3,
          "login": "admin",
          "firstName": "Administrator1",
          "lastName": "Administrator2",
          "email": "admin@localhost",
          "imageUrl": null,
          "activated": true,
          "langKey": null,
          "createdBy": "system",
          "createdDate": "2018-08-20T13:00:58Z",
          "lastModifiedBy": "admin",
          "lastModifiedDate": "2018-08-27T11:28:34Z",
          "authorities": [
            "ROLE_USER",
            "ROLE_ADMIN"
          ]
        }
        
update: POST api/account
Only the fristname and lastname are editable. So the post request should look like the one below. 
        
        {
          "id": 3,
          "firstName": "Administrator1",
          "lastName": "Administrator2"
        }

change password: 
POST to api/account/change-password
POSTMAN JS code generator  

        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "http://iq-staging.eu-west-1.elasticbeanstalk.com/api/account/change-password",
          "method": "POST",
          "headers": {
            "content-type": "text/plain",
            "accept": "text/plain",
            "authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTUzNTQ1NTQzN30.sFsXXIte0dQVkq7atdQVPeU6DRONMO4DiTPEG-oMfhx4lxJ2yAyVSGj1k7LSDD2SLR3b1CQdK9w4aU9soKd7Bg",
            "cache-control": "no-cache",
            "postman-token": "37231f14-c6b8-bef4-c93c-186f52a322e5"
          },
          "data": "admin"
        }
        
        $.ajax(settings).done(function (response) {
          console.log(response);
        });

Reset password: 
1. request new password which will send an email to the user with a reset password link: 
POST /api/account/reset-password/init


          var settings = {
                  "async": true,
                  "crossDomain": true,
                  "url": "http://iq-staging.eu-west-1.elasticbeanstalk.com/api/account/reset-password/init",
                  "method": "POST",
                  "headers": {
                    "content-type": "text/plain",
                    "accept": "text/plain",
                    "authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTUzNTQ1NTQzN30.sFsXXIte0dQVkq7atdQVPeU6DRONMO4DiTPEG-oMfhx4lxJ2yAyVSGj1k7LSDD2SLR3b1CQdK9w4aU9soKd7Bg",
                    "cache-control": "no-cache",
                    "postman-token": "37231f14-c6b8-bef4-c93c-186f52a322e5"
                  },
                  "data": "admin@localhost"
                }
                
                $.ajax(settings).done(function (response) {
                  console.log(response);
                });

2. user clicks on the link in the reset password email to take him to the reset password page. The link will contain the key that you need to submit the below form
 NOTE: I need the path of the reset password front end page to put on the reset password email. 
 
 POST /api/account/reset-password/finish
 
         {
           "key": "71840994264386776402",
           "newPassword": "admin"
         }
 

        
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

        api/public/regions?parentId.specified=false
 
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
          "adId": 37,
          "ageType": "BRAND_NEW",
          "bathrooms": 2,
          "bedrooms": 4,
          "buildingQuality": "FIRST_CLASS",
          "price": 250,
          "priceType": "SALE_PER_METER",
          "currency": "MILLION_IQD",
          "serviceType": "SALE",
          
          "description": "Some description",
          "landSize": 200,
          "buildSizeMeasureType": "SQUARE_METER",
          "locationId": 39,
          "propertyType": "HOUSE",
          "title": "string",
          
          
          "serviceType": "RENTAL",
          
          "buildingSize": null,
          
          "buildingQuality": "FIRST_CLASS",
          
          
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
Note: This needs to be after the property reocrd has been created as you will need the propertyId to create the records

For each image, do the following:    
1. Upload an image (see the upload image section below) to get the image id - the process should be similar to see http://iq.waseet.net/ar/add/realestate/step_one
2. Create a propertyImage record by submitting a 
POST request to /api/property-images

        {
          "imageId": 2, <-- the image id from step 1
          "position": 1, <--- this is the position of the image assuming that the user can drag/drop images around to change their positions 
          "propertyId": 1 <-- the created propertyId
        }

#### Upload image

1. upload an image to s3 by submitting a POST request to /api/images/upload-image/[namespace]
namespace is set based what is being uploaded. ie uploading property images, set it to properties, agent images set to agents and so on 
The above post will return a response similar to the one below: 

         {
           "id": 1,
           "thumbnail": null,
           "s3Path": "https://aliraqhomes-dev.s3.eu-central-1.amazonaws.com/media/properties/vOGDQrqENW6.jpg",
           "imageStatus": "QUEUED"
         }
         
What you need fromt he above response is the id:  
        

        
#### add agent account

POST a request to /api/agents

        {
          "name": "agent name", <-- required
          "description": "some description", <--- required
          "phone": "0402456521", <--- required
          "email": "agent@gg.com", <-- required
          "website": "abx@g.com",
          "logoId": 1234, <--- imageId - see upload logo section
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
by editing his/her agent profile. The process is the same in both cases. 

To upload a logo, follow the below steps: 
1. Upload the logo image (to get the imageId) - see "Upload image" section 
2. Add the image id to the the agent request being created/updated above 
     
     
     
     


   
#### add user profile

POST a request to /api/profiles

      {
        "phone": "98797333", <-- required 
        "avatarId": 12345, <-- imageId 
        "userId": 4 <-- current logged in user id
      }
    
##### update profile
PUT request to /api/profiles

        {
                "id": 1,
                "phone": "98797333", <-- required 
                "avatarId": 12345, <-- imageId
                "userId": 4 <-- current logged in user
        }
     
##### upload profile avatar
(similar to agent logo)
To upload a user avatar, follow the below steps: 
1. Upload the avatar image (to get the imageId) - see "Upload image" section 
2. Add the image id to the the profile request being created/updated above 

##### get a user profile
to get a user profile (nested objects) use
GET /api/public/profiles?id.equals=[user_id]

     
     
     
     
###Search regions (use with auto-complete)
submit a get request to: 
    /api/public/regions/search/[main-city-id]/[three or more letters of the region (arabic) name]
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


###Bookmarks
How it works: when a user logs in, retrieve all his/her bookmarks using the below URL. 
When displaying properties, simply check if the property id exists in the bookmark list, if exists, highlight the star. 
If the user clicks on a highlighted star (bookmarked), use the delete route below to delete it from the DB. 
Remember to refresh the list everytime you add/remove bookmarks. 

Get user bookmarks: 
GET api/bookmarks

####Create a book mark: 
POST to /api/bookmarks

        {
          "propertyId": 4,
          "userId": 3
        }
        
####Delete bookmark
DELETE /api/bookmarks/6

         



###Support APIs list
Price types: 

        /api/public/properties/price-types/{language}/{propertyType}/{serviceType}

Currency types: 

        /api/public/properties/currency-types/{language}/{serviceType}
        
Property types:
        
        /api/public/properties/property-types/{language}/{serviceType}
        
Building quality types:         
        
        /api/public/properties/building-qualities/{language}
        
Age types: 
        
        /api/public/properties/age-types/{language}
        
land measure types:
        
        /api/public/properties/land-measure-types/{language}/{propertyType}
        
Service types:        
        
        /api/public/properties/service-types/{language}
            
                 
