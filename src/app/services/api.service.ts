import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {

  constructor() { }

  api = {
    "featuredListings": [
      {
        "id": 1,
        "state": "For Sale",
        "name": "Eagle Apartments",
        "price": "$275,000",
        "area": "530 sq ft",
        "rooms": "3",
        "beds": "1",
        "baths": "1",
        "image": "assets/images/listing-01.jpg"
      },
      {
        "id": 2,
        "state": "For Sale",
        "name": "Serene Uptown",
        "price": "$900 / monthly",
        "area": "440 sq ft",
        "rooms": "3",
        "beds": "1",
        "baths": "1",
        "image": "assets/images/listing-02.jpg"
      },
      {
        "id": 3,
        "state": "For Rent",
        "name": "Meridian Villas",
        "price": "$1700 / monthly",
        "area": "1450 sq ft",
        "rooms": "3",
        "beds": "2",
        "baths": "2",
        "image": "assets/images/listing-03.jpg"
      },
      {
        "id": 4,
        "state": "For Sale",
        "name": "Selway Apartments",
        "price": "$420,000",
        "area": "540 sq ft",
        "rooms": "2",
        "beds": "2",
        "baths": "1",
        "image": "assets/images/listing-04.jpg"
      },
      {
        "id": 5,
        "state": "For Sale",
        "name": "Oak Tree Villas",
        "price": "$535,000",
        "area": "550 sq ft",
        "rooms": "3",
        "beds": "2",
        "baths": "1",
        "image": "assets/images/listing-05.jpg"
      },
      {
        "id": 6,
        "state": "For Sale",
        "name": "Old Town Manchester",
        "price": "$500 / monthly",
        "area": "850 sq ft",
        "rooms": "3",
        "beds": "2",
        "baths": "1",
        "image": "assets/images/listing-06.jpg"
      }
    ],
    "testimonials": [
      {
        "id": 1,
        "name": "Jennie Wilson",
        "type": "Rented Apartment",
        "testimonial": "Aliquam dictum elit vitae mauris facilisis, at dictum urna dignissim. Donec vel lectus vel felis lacinia luctus vitae iaculis arcu. Mauris mattis, massa eu porta ultricies.",
        "profilePic": "assets/images/happy-client-01.jpg"
      },
      {
        "id": 2,
        "name": "Thomas Smith",
        "type": "Bought House",
        "testimonial": "Aliquam dictum elit vitae mauris facilisis, at dictum urna dignissim. Donec vel lectus vel felis lacinia luctus vitae iaculis arcu. Mauris mattis, massa eu porta ultricies.",
        "profilePic": "assets/images/happy-client-02.jpg"
      },
      {
        "id": 3,
        "name": "Robert Lindstrom",
        "type": "Sold Apartment",
        "testimonial": "Aliquam dictum elit vitae mauris facilisis, at dictum urna dignissim. Donec vel lectus vel felis lacinia luctus vitae iaculis arcu. Mauris mattis, massa eu porta ultricies.",
        "profilePic": "assets/images/happy-client-03.jpg"
      },
      {
        "id": 4,
        "name": "Jennie Wilson",
        "type": "Rented Apartment",
        "testimonial": "Aliquam dictum elit vitae mauris facilisis, at dictum urna dignissim. Donec vel lectus vel felis lacinia luctus vitae iaculis arcu. Mauris mattis, massa eu porta ultricies.",
        "profilePic": "assets/images/happy-client-01.jpg"
      }
    ],
    "topPopularPlaces": [
      {
        "place": "New York",
        "area": "new-yourk",
        "properties_num": 14,
        "featured": true,
        "image": "assets/images/popular-location-01.jpg"
      },
      {
        "place": "Los Angeles",
        "area": "los-angeles",
        "properties_num": 24,
        "featured": false,
        "image": "assets/images/popular-location-02.jpg"
      },
      {
        "place": "San Francisco",
        "area": "san-francisco",
        "properties_num": 14,
        "featured": false,
        "image": "assets/images/popular-location-03.jpg"
      },
      {
        "place": "Miami",
        "area": "miami",
        "properties_num": 14,
        "featured": false,
        "image": "assets/images/popular-location-04.jpg"
      }
    ],
    "blog": [
      {
        "id": 1,
        "title": "8 Tips to Help You Finding New Home",
        "date": "Novemer 12, 2016",
        "post_header": "<p>Nam nisl lacus, dignissim ac tristique ut, scelerisque eu massa. Vestibulum ligula nunc, rutrum in malesuada vitae. </p>",
        "post": "<p>Nam nisl lacus, dignissim ac tristique ut, scelerisque eu massa. Vestibulum ligula nunc, rutrum in malesuada vitae, tempus sed augue. Curabitur quis lectus quis augue dapibus facilisis. Vivamus tincidunt orci est, in vehicula nisi eleifend ut. Vestibulum sagittis varius orci vitae.</p><div class='post-quote'><span class='icon'></span><blockquote>Mauris aliquet ultricies ante, non faucibus ante gravida sed. Sed ultrices pellentesque purus, vulputate volutpat ipsum hendrerit sed neque sed sapien rutrum.</blockquote></div><p>In ut odio libero, at vulputate urna. Nulla tristique mi a massa convallis cursus. Nulla eu mi magna. Etiam suscipit commodo gravida. Cras suscipit, quam vitae adipiscing faucibus, risus nibh laoreet odio, a porttitor metus eros ut enim. Morbi augue velit, tempus mattis dignissim nec, porta sed risus. Donec eget magna eu lorem tristique pellentesque eget eu dui. Fusce lacinia tempor malesuada. Ut lacus sapien, placerat a ornare nec, elementum sit amet felis. Maecenas pretium lorem hendrerit eros sagittis fermentum.</p><p>Phasellus enim magna, varius et commodo ut, ultricies vitae velit. Ut nulla tellus, eleifend euismod pellentesque vel, sagittis vel justo. In libero urna, venenatis sit amet ornare non, suscipit nec risus. Sed consequat justo non mauris pretium at tempor justo sodales. Quisque tincidunt laoreet malesuada. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer vitae ante enim. Fusce sed elit est. Suspendisse sit amet mauris in quam pretium faucibus et aliquam odio. </p>",
        "image": "assets/images/blog-post-01.jpg",
        "comments": 5
      },
      {
        "id": 2,
        "title": "Bedroom Colors You'll Never Regret",
        "date": "Novemer 12, 2016",
        "post_header": "<p>Nam nisl lacus, dignissim ac tristique ut, scelerisque eu massa. Vestibulum ligula nunc, rutrum in malesuada vitae. </p>",
        "post": "<p>Nam nisl lacus, dignissim ac tristique ut, scelerisque eu massa. Vestibulum ligula nunc, rutrum in malesuada vitae, tempus sed augue. Curabitur quis lectus quis augue dapibus facilisis. Vivamus tincidunt orci est, in vehicula nisi eleifend ut. Vestibulum sagittis varius orci vitae.</p><div class='post-quote'><span class='icon'></span><blockquote>Mauris aliquet ultricies ante, non faucibus ante gravida sed. Sed ultrices pellentesque purus, vulputate volutpat ipsum hendrerit sed neque sed sapien rutrum.</blockquote></div><p>In ut odio libero, at vulputate urna. Nulla tristique mi a massa convallis cursus. Nulla eu mi magna. Etiam suscipit commodo gravida. Cras suscipit, quam vitae adipiscing faucibus, risus nibh laoreet odio, a porttitor metus eros ut enim. Morbi augue velit, tempus mattis dignissim nec, porta sed risus. Donec eget magna eu lorem tristique pellentesque eget eu dui. Fusce lacinia tempor malesuada. Ut lacus sapien, placerat a ornare nec, elementum sit amet felis. Maecenas pretium lorem hendrerit eros sagittis fermentum.</p><p>Phasellus enim magna, varius et commodo ut, ultricies vitae velit. Ut nulla tellus, eleifend euismod pellentesque vel, sagittis vel justo. In libero urna, venenatis sit amet ornare non, suscipit nec risus. Sed consequat justo non mauris pretium at tempor justo sodales. Quisque tincidunt laoreet malesuada. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer vitae ante enim. Fusce sed elit est. Suspendisse sit amet mauris in quam pretium faucibus et aliquam odio. </p>",
        "image": "assets/images/blog-post-02.jpg",
        "comments": 5
      },
      {
        "id": 3,
        "title": "8 Tips to Help You Finding New Home",
        "date": "Novemer 26, 2016",
        "post_header": "<p>Nam nisl lacus, dignissim ac tristique ut, scelerisque eu massa. Vestibulum ligula nunc, rutrum in malesuada vitae. </p>",
        "post": "<p>Nam nisl lacus, dignissim ac tristique ut, scelerisque eu massa. Vestibulum ligula nunc, rutrum in malesuada vitae, tempus sed augue. Curabitur quis lectus quis augue dapibus facilisis. Vivamus tincidunt orci est, in vehicula nisi eleifend ut. Vestibulum sagittis varius orci vitae.</p><div class='post-quote'><span class='icon'></span><blockquote>Mauris aliquet ultricies ante, non faucibus ante gravida sed. Sed ultrices pellentesque purus, vulputate volutpat ipsum hendrerit sed neque sed sapien rutrum.</blockquote></div><p>In ut odio libero, at vulputate urna. Nulla tristique mi a massa convallis cursus. Nulla eu mi magna. Etiam suscipit commodo gravida. Cras suscipit, quam vitae adipiscing faucibus, risus nibh laoreet odio, a porttitor metus eros ut enim. Morbi augue velit, tempus mattis dignissim nec, porta sed risus. Donec eget magna eu lorem tristique pellentesque eget eu dui. Fusce lacinia tempor malesuada. Ut lacus sapien, placerat a ornare nec, elementum sit amet felis. Maecenas pretium lorem hendrerit eros sagittis fermentum.</p><p>Phasellus enim magna, varius et commodo ut, ultricies vitae velit. Ut nulla tellus, eleifend euismod pellentesque vel, sagittis vel justo. In libero urna, venenatis sit amet ornare non, suscipit nec risus. Sed consequat justo non mauris pretium at tempor justo sodales. Quisque tincidunt laoreet malesuada. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer vitae ante enim. Fusce sed elit est. Suspendisse sit amet mauris in quam pretium faucibus et aliquam odio. </p>",
        "image": "assets/images/blog-post-03.jpg",
        "comments": 3
      },
      {
        "id": 4,
        "title": "ANOTHER---8 Tips to Help You Finding New Home",
        "date": "Novemer 12, 2016",
        "post_header": "<p>Nam nisl lacus, dignissim ac tristique ut, scelerisque eu massa. Vestibulum ligula nunc, rutrum in malesuada vitae. </p>",
        "post": "<p>Nam nisl lacus, dignissim ac tristique ut, scelerisque eu massa. Vestibulum ligula nunc, rutrum in malesuada vitae, tempus sed augue. Curabitur quis lectus quis augue dapibus facilisis. Vivamus tincidunt orci est, in vehicula nisi eleifend ut. Vestibulum sagittis varius orci vitae.</p><div class='post-quote'><span class='icon'></span><blockquote>Mauris aliquet ultricies ante, non faucibus ante gravida sed. Sed ultrices pellentesque purus, vulputate volutpat ipsum hendrerit sed neque sed sapien rutrum.</blockquote></div><p>In ut odio libero, at vulputate urna. Nulla tristique mi a massa convallis cursus. Nulla eu mi magna. Etiam suscipit commodo gravida. Cras suscipit, quam vitae adipiscing faucibus, risus nibh laoreet odio, a porttitor metus eros ut enim. Morbi augue velit, tempus mattis dignissim nec, porta sed risus. Donec eget magna eu lorem tristique pellentesque eget eu dui. Fusce lacinia tempor malesuada. Ut lacus sapien, placerat a ornare nec, elementum sit amet felis. Maecenas pretium lorem hendrerit eros sagittis fermentum.</p><p>Phasellus enim magna, varius et commodo ut, ultricies vitae velit. Ut nulla tellus, eleifend euismod pellentesque vel, sagittis vel justo. In libero urna, venenatis sit amet ornare non, suscipit nec risus. Sed consequat justo non mauris pretium at tempor justo sodales. Quisque tincidunt laoreet malesuada. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer vitae ante enim. Fusce sed elit est. Suspendisse sit amet mauris in quam pretium faucibus et aliquam odio. </p>",
        "image": "assets/images/blog-post-01.jpg",
        "comments": 5
      },
      {
        "id": 5,
        "title": "ANOTHER---Bedroom Colors You'll Never Regret",
        "date": "Novemer 12, 2016",
        "post_header": "<p>Nam nisl lacus, dignissim ac tristique ut, scelerisque eu massa. Vestibulum ligula nunc, rutrum in malesuada vitae. </p>",
        "post": "<p>Nam nisl lacus, dignissim ac tristique ut, scelerisque eu massa. Vestibulum ligula nunc, rutrum in malesuada vitae, tempus sed augue. Curabitur quis lectus quis augue dapibus facilisis. Vivamus tincidunt orci est, in vehicula nisi eleifend ut. Vestibulum sagittis varius orci vitae.</p><div class='post-quote'><span class='icon'></span><blockquote>Mauris aliquet ultricies ante, non faucibus ante gravida sed. Sed ultrices pellentesque purus, vulputate volutpat ipsum hendrerit sed neque sed sapien rutrum.</blockquote></div><p>In ut odio libero, at vulputate urna. Nulla tristique mi a massa convallis cursus. Nulla eu mi magna. Etiam suscipit commodo gravida. Cras suscipit, quam vitae adipiscing faucibus, risus nibh laoreet odio, a porttitor metus eros ut enim. Morbi augue velit, tempus mattis dignissim nec, porta sed risus. Donec eget magna eu lorem tristique pellentesque eget eu dui. Fusce lacinia tempor malesuada. Ut lacus sapien, placerat a ornare nec, elementum sit amet felis. Maecenas pretium lorem hendrerit eros sagittis fermentum.</p><p>Phasellus enim magna, varius et commodo ut, ultricies vitae velit. Ut nulla tellus, eleifend euismod pellentesque vel, sagittis vel justo. In libero urna, venenatis sit amet ornare non, suscipit nec risus. Sed consequat justo non mauris pretium at tempor justo sodales. Quisque tincidunt laoreet malesuada. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer vitae ante enim. Fusce sed elit est. Suspendisse sit amet mauris in quam pretium faucibus et aliquam odio. </p>",
        "image": "assets/images/blog-post-02.jpg",
        "comments": 5
      },
      {
        "id": 6,
        "title": "ANOTHER---8 Tips to Help You Finding New Home",
        "date": "Novemer 26, 2016",
        "post_header": "<p>Nam nisl lacus, dignissim ac tristique ut, scelerisque eu massa. Vestibulum ligula nunc, rutrum in malesuada vitae. </p>",
        "post": "<p>Nam nisl lacus, dignissim ac tristique ut, scelerisque eu massa. Vestibulum ligula nunc, rutrum in malesuada vitae, tempus sed augue. Curabitur quis lectus quis augue dapibus facilisis. Vivamus tincidunt orci est, in vehicula nisi eleifend ut. Vestibulum sagittis varius orci vitae.</p><div class='post-quote'><span class='icon'></span><blockquote>Mauris aliquet ultricies ante, non faucibus ante gravida sed. Sed ultrices pellentesque purus, vulputate volutpat ipsum hendrerit sed neque sed sapien rutrum.</blockquote></div><p>In ut odio libero, at vulputate urna. Nulla tristique mi a massa convallis cursus. Nulla eu mi magna. Etiam suscipit commodo gravida. Cras suscipit, quam vitae adipiscing faucibus, risus nibh laoreet odio, a porttitor metus eros ut enim. Morbi augue velit, tempus mattis dignissim nec, porta sed risus. Donec eget magna eu lorem tristique pellentesque eget eu dui. Fusce lacinia tempor malesuada. Ut lacus sapien, placerat a ornare nec, elementum sit amet felis. Maecenas pretium lorem hendrerit eros sagittis fermentum.</p><p>Phasellus enim magna, varius et commodo ut, ultricies vitae velit. Ut nulla tellus, eleifend euismod pellentesque vel, sagittis vel justo. In libero urna, venenatis sit amet ornare non, suscipit nec risus. Sed consequat justo non mauris pretium at tempor justo sodales. Quisque tincidunt laoreet malesuada. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer vitae ante enim. Fusce sed elit est. Suspendisse sit amet mauris in quam pretium faucibus et aliquam odio. </p>",
        "image": "assets/images/blog-post-03.jpg",
        "comments": 3
      }
    ],
    "defaultListings": [
      {
        "LocationURL": 1,
        "LocationPrice": "$275,000",
        "LocationPriceDetails": "$520 / sq ft",
        "LocationIMG": "assets/images/listing-01.jpg",
        "LocationTitle": "Eagle Apartmets",
        "LocationAddress": "9364 School St. Lynchburg, NY",
        "LocationLatitude": 40.7427837,
        "LocationLongitude": -73.11445617675781
      },
      {
        "LocationURL": 2,
        "LocationPrice": "$900",
        "LocationPriceDetails": "monthly",
        "LocationIMG": "assets/images/listing-02.jpg",
        "LocationTitle": "Serene Uptown",
        "LocationAddress": "6 Bishop Ave. Perkasie, PA",
        "LocationLatitude": 40.70437865245596,
        "LocationLongitude": -73.98674011230469
      },
      {
        "LocationURL": 3,
        "LocationPrice": "$425,000",
        "LocationPriceDetails": "$770 / sq ft",
        "LocationIMG": "assets/images/listing-04.jpg",
        "LocationTitle": "Selway Apartments",
        "LocationAddress": "33 William St. Northbrook, IL",
        "LocationLatitude": 40.94401669296697,
        "LocationLongitude": -74.16938781738281
      },
      {
        "LocationURL": 4,
        "LocationPrice": "$535,000",
        "LocationPriceDetails": "$640 / sq ft",
        "LocationIMG": "assets/images/listing-05.jpg",
        "LocationTitle": "Oak Tree Villas",
        "LocationAddress": "71 Lower River Dr. Bronx, NY",
        "LocationLatitude": 40.77055783505125,
        "LocationLongitude": -74.26002502441406
      },
      {
        "LocationURL": 5,
        "LocationPrice": "$1700",
        "LocationPriceDetails": "monthly",
        "LocationIMG": "assets/images/listing-03.jpg",
        "LocationTitle": "Meridian Villas",
        "LocationAddress": "778 Country St. Panama City, FL",
        "LocationLatitude": 41.79424986338271,
        "LocationLongitude": -87.7093505859375
      },
      {
        "LocationURL": 6,
        "LocationPrice": "$500",
        "LocationPriceDetails": "monthly",
        "LocationIMG": "assets/images/listing-06.jpg",
        "LocationTitle": "Old Town Manchester",
        "LocationAddress": "7843 Durham Avenue, MD",
        "LocationLatitude": 41.76967281691741,
        "LocationLongitude": -87.9510498046875
      },
      {
        "LocationURL": 7,
        "LocationPrice": "$275,000",
        "LocationPriceDetails": "$520 / sq ft",
        "LocationIMG": "assets/images/listing-01.jpg",
        "LocationTitle": "Eagle Apartmets",
        "LocationAddress": "9364 School St. Lynchburg, NY",
        "LocationLatitude": 36.13610021320376,
        "LocationLongitude": -115.1312255859375
      },
      {
        "LocationURL": 8,
        "LocationPrice": "$900",
        "LocationPriceDetails": "monthly",
        "LocationIMG": "assets/images/listing-02.jpg",
        "LocationTitle": "Serene Uptown",
        "LocationAddress": "9364 School St. Lynchburg, NY",
        "LocationLatitude": 36.10637081203522,
        "LocationLongitude": -115.22872924804688
      },
      {
        "LocationURL": 9,
        "LocationPrice": "$1700",
        "LocationPriceDetails": "monthly",
        "LocationIMG": "assets/images/listing-03.jpg",
        "LocationTitle": "Meridian Villas",
        "LocationAddress": "9364 School St. Lynchburg, NY",
        "LocationLatitude": 32.86020942314693,
        "LocationLongitude": -97.09442138671875
      },
      {
        "LocationURL": 10,
        "LocationPrice": "$275,000",
        "LocationPriceDetails": "$520 / sq ft",
        "LocationIMG": "assets/images/listing-04.jpg",
        "LocationTitle": "Eagle Apartmets",
        "LocationAddress": "9364 School St. Lynchburg, NY",
        "LocationLatitude": 32.80943825730526,
        "LocationLongitude": -96.88018798828125
      },
      {
        "LocationURL": 11,
        "LocationPrice": "$275,000",
        "LocationPriceDetails": "$520 / sq ft",
        "LocationIMG": "assets/images/listing-05.jpg",
        "LocationTitle": "Oak Tree Villas",
        "LocationAddress": "9364 School St. Lynchburg, NY",
        "LocationLatitude": 32.684695132205626,
        "LocationLongitude": -96.89666748046875
      }
    ],
    "limitedListings": [
      {
        "LocationURL": 1,
        "LocationPrice": "$275,000",
        "LocationPriceDetails": "$520 / sq ft",
        "LocationIMG": "assets/images/listing-01.jpg",
        "LocationTitle": "Eagle Apartmets",
        "LocationAddress": "9364 School St. Lynchburg, NY",
        "LocationLatitude": 40.7427837,
        "LocationLongitude": -73.11445617675781
      },
      {
        "LocationURL": 2,
        "LocationPrice": "$900",
        "LocationPriceDetails": "monthly",
        "LocationIMG": "assets/images/listing-02.jpg",
        "LocationTitle": "Serene Uptown",
        "LocationAddress": "6 Bishop Ave. Perkasie, PA",
        "LocationLatitude": 40.70437865245596,
        "LocationLongitude": -73.98674011230469
      },
      {
        "LocationURL": 3,
        "LocationPrice": "$425,000",
        "LocationPriceDetails": "$770 / sq ft",
        "LocationIMG": "assets/images/listing-04.jpg",
        "LocationTitle": "Selway Apartments",
        "LocationAddress": "33 William St. Northbrook, IL",
        "LocationLatitude": 40.94401669296697,
        "LocationLongitude": -74.16938781738281
      },
      {
        "LocationURL": 10,
        "LocationPrice": "$275,000",
        "LocationPriceDetails": "$520 / sq ft",
        "LocationIMG": "assets/images/listing-04.jpg",
        "LocationTitle": "Eagle Apartmets",
        "LocationAddress": "9364 School St. Lynchburg, NY",
        "LocationLatitude": 32.80943825730526,
        "LocationLongitude": -96.88018798828125
      },
      {
        "LocationURL": 11,
        "LocationPrice": "$275,000",
        "LocationPriceDetails": "$520 / sq ft",
        "LocationIMG": "assets/images/listing-05.jpg",
        "LocationTitle": "Oak Tree Villas",
        "LocationAddress": "9364 School St. Lynchburg, NY",
        "LocationLatitude": 32.684695132205626,
        "LocationLongitude": -96.89666748046875
      }
    ],
    "searchListins": [
      {
        "LocationURL": 2,
        "LocationPrice": "$900",
        "LocationPriceDetails": "monthly",
        "LocationIMG": "assets/images/listing-02.jpg",
        "LocationTitle": "Serene Uptown",
        "LocationAddress": "6 Bishop Ave. Perkasie, PA",
        "LocationLatitude": 40.70437865245596,
        "LocationLongitude": -73.98674011230469
      },
      {
        "LocationURL": 5,
        "LocationPrice": "$1700",
        "LocationPriceDetails": "monthly",
        "LocationIMG": "assets/images/listing-03.jpg",
        "LocationTitle": "Meridian Villas",
        "LocationAddress": "778 Country St. Panama City, FL",
        "LocationLatitude": 41.79424986338271,
        "LocationLongitude": -87.7093505859375
      },
      {
        "LocationURL": 6,
        "LocationPrice": "$500",
        "LocationPriceDetails": "monthly",
        "LocationIMG": "assets/images/listing-06.jpg",
        "LocationTitle": "Old Town Manchester",
        "LocationAddress": "7843 Durham Avenue, MD",
        "LocationLatitude": 41.76967281691741,
        "LocationLongitude": -87.9510498046875
      },
      {
        "LocationURL": 11,
        "LocationPrice": "$275,000",
        "LocationPriceDetails": "$520 / sq ft",
        "LocationIMG": "assets/images/listing-05.jpg",
        "LocationTitle": "Oak Tree Villas",
        "LocationAddress": "9364 School St. Lynchburg, NY",
        "LocationLatitude": 32.684695132205626,
        "LocationLongitude": -96.89666748046875
      }
    ],
    "foundResults": [
      {
        "id": 1,
        "featured": true,
        "state": "For Sale",
        "price": "$275,000",
        "priceDetail": "$520 / sq ft",
        "images": [
          "assets/images/listing-01.jpg",
          "assets/images/listing-01b.jpg",
          "assets/images/listing-01c.jpg",
        ],
        "title": "Eagle Apartments",
        "popupAdress": "https://maps.google.com/maps?q=221B+Baker+Street,+London,+United+Kingdom&hl=en&t=v&hnear=221B+Baker+St,+London+NW1+6XE,+United+Kingdom",
        "adress": "9364 School St. Lynchburg, NY",
        "area": 530,
        "beds": 1,
        "rooms": 3,
        "bathrooms": 1,
        "user": "David Strozier",
        "date": 1
      },
      {
        "id": 2,
        "featured": false,
        "state": "For Rent",
        "price": "$900",
        "priceDetail": "monthly",
        "images": [
          "assets/images/listing-02.jpg"
        ],
        "title": "Serene Uptown",
        "popupAdress": "https://maps.google.com/maps?q=221B+Baker+Street,+London,+United+Kingdom&hl=en&t=v&hnear=221B+Baker+St,+London+NW1+6XE,+United+Kingdom",
        "adress": "6 Bishop Ave. Perkasie, PA",
        "area": 440,
        "beds": 1,
        "rooms": 1,
        "bathrooms": 1,
        "user": "Harriette Clark",
        "date": 2
      },
      {
        "id": 3,
        "featured": true,
        "state": "For Rent",
        "price": "$1700",
        "priceDetail": "monthly",
        "images": [
          "assets/images/listing-03.jpg"
        ],
        "title": "Meridian Villas",
        "popupAdress": "https://maps.google.com/maps?q=221B+Baker+Street,+London,+United+Kingdom&hl=en&t=v&hnear=221B+Baker+St,+London+NW1+6XE,+United+Kingdom",
        "adress": "778 Country St. Panama City, FL",
        "area": 1450,
        "beds": 1,
        "rooms": 2,
        "bathrooms": 2,
        "user": "Chester Miller",
        "date": 4
      },
      {
        "id": 4,
        "featured": false,
        "state": "For Sale",
        "price": "$420,000",
        "priceDetail": "$770 / sq ft",
        "images": [
          "assets/images/listing-04.jpg",
          "assets/images/listing-04b.jpg"
        ],
        "title": "Selway Apartments",
        "popupAdress": "https://maps.google.com/maps?q=221B+Baker+Street,+London,+United+Kingdom&hl=en&t=v&hnear=221B+Baker+St,+London+NW1+6XE,+United+Kingdom",
        "adress": "33 William St. Northbrook, IL",
        "area": 540,
        "beds": 1,
        "rooms": 3,
        "bathrooms": 2,
        "user": "Kristen Berry",
        "date": 3
      },
      {
        "id": 5,
        "featured": false,
        "state": "For Sale",
        "price": "$535,000",
        "priceDetail": "$640 / sq ft",
        "images": [
          "assets/images/listing-05.jpg"
        ],
        "title": "Oak Tree Villas",
        "popupAdress": "https://maps.google.com/maps?q=221B+Baker+Street,+London,+United+Kingdom&hl=en&t=v&hnear=221B+Baker+St,+London+NW1+6XE,+United+Kingdom",
        "adress": "71 Lower River Dr. Bronx, NY",
        "area": 350,
        "beds": 1,
        "rooms": 2,
        "bathrooms": 1,
        "user": "Mabel Gagnon",
        "date": 4
      },
      {
        "id": 6,
        "featured": false,
        "state": "For Rent",
        "price": "$500",
        "priceDetail": "monthly",
        "images": [
          "assets/images/listing-06.jpg"
        ],
        "title": "Old Town Manchester",
        "popupAdress": "https://maps.google.com/maps?q=221B+Baker+Street,+London,+United+Kingdom&hl=en&t=v&hnear=221B+Baker+St,+London+NW1+6XE,+United+Kingdom",
        "adress": "7843 Durham Avenue, MD",
        "area": 850,
        "beds": 2,
        "rooms": 3,
        "bathrooms": 1,
        "user": "Charles Watson",
        "date": 3
      }
    ],
    "singleProperty": {
      "id": 1,
      "name": "Selway Apartments",
      "state": "For Sale",
      "adress": "7843 Durham Avenue, MD",
      "price": "$420,000",
      "priceDetail": "$770 / sq ft",
      "images": [
        "assets/images/single-property-01.jpg",
        "assets/images/single-property-02.jpg",
        "assets/images/single-property-03.jpg",
        "assets/images/single-property-04.jpg",
        "assets/images/single-property-05.jpg",
        "assets/images/single-property-06.jpg"
      ],
      "area": "1450 sq ft",
      "rooms": 4,
      "beds": 2,
      "bathrooms": 1,
      "description": "<p> Ut euismod ultricies sollicitudin. Curabitur sed dapibus nulla. Nulla eget iaculis lectus. Mauris ac maximus neque. Nam in mauris quis libero sodales eleifend. Morbi varius, nulla sit amet rutrum elementum, est elit finibus tellus, ut tristique elit risus at metus. Sed fermentum, lorem vitae efficitur imperdiet, neque velit tristique turpis, et iaculis mi tortor finibus turpis. </p> <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque. Nulla finibus lobortis pulvinar. Donec a consectetur nulla. Nulla posuere sapien vitae lectus suscipit, et pulvinar nisi tincidunt. Aliquam erat volutpat. Curabitur convallis fringilla diam sed aliquam. Sed tempor iaculis massa faucibus feugiat. In fermentum facilisis massa, a consequat purus viverra a. Aliquam pellentesque nibh et nibh feugiat gravida. Maecenas ultricies, diam vitae semper placerat, velit risus accumsan nisl, eget tempor lacus est vel nunc. Proin accumsan elit sed neque euismod fringilla. Curabitur lobortis nunc velit, et fermentum urna dapibus non. Vivamus magna lorem, elementum id gravida ac, laoreet tristique augue. Maecenas dictum lacus eu nunc porttitor, ut hendrerit arcu efficitur. </p> <p> Nam mattis lobortis felis eu blandit. Morbi tellus ligula, interdum sit amet ipsum et, viverra hendrerit lectus. Nunc efficitur sem vel est laoreet, sed bibendum eros viverra. Vestibulum finibus, ligula sed euismod tincidunt, lacus libero lobortis ligula, sit amet molestie ipsum purus ut tortor. Nunc varius, dui et sollicitudin facilisis, erat felis imperdiet felis, et iaculis dui magna vitae diam. Donec mattis diam nisl, quis ullamcorper enim malesuada non. Curabitur lobortis eu mauris nec vestibulum. Nam efficitur, ex ac semper malesuada, nisi odio consequat dui, hendrerit vulputate odio dui vitae massa. Aliquam tortor urna, tincidunt ut euismod quis, semper vel ipsum. Ut non vestibulum mauris. Morbi euismod, felis non hendrerit viverra, nunc sapien bibendum ligula, eget vehicula nunc dolor eu ex. Quisque in semper odio. Donec auctor blandit ligula. Integer id lectus non nibh vulputate efficitur quis at arcu. </p>",
      "descriptionAr": "<p> عدد و منتصف الإمداد, بل أخرى لفرنسا أسابيع وتم. كلا أي فقامت العالمية, حين هو فهرست بالرّد وبعدما. دار ليتسنّى الإحتفاظ لم, مما بل الشرقي العناد والإتحاد. بلا ما وبدأت يعادل, إذ إستعمل الأهداف انتصارهم دول, والتي الرئيسية بلا لم. ان والقرى السادس وبالرغم كان. </p> <p> كما مرجع قائمة باستحداث ان, عن تسمّى التجارية هذه. ذات دارت الجوي أساسي أي. كلا تسمّى كُلفة يتبقّ أن, على مدينة الشهير بتخصيص أي. بفرض تحرير وقوعها، أن كما. و أصقاع واُسدل وإقامة ذات, حصدت مهمّات من شيء. </p> <p> شيء تاريخ الربيع، عل, معقل علاقة مكن مع. بـ بحق بهيئة الهجوم, أمام مشروط التحالف هو تلك. جُل وقام فمرّ عن, كل دار اعلان الضغوط. ببعض جديداً اللازمة إذ وتم. </p> <p> عدد و منتصف الإمداد, بل أخرى لفرنسا أسابيع وتم. كلا أي فقامت العالمية, حين هو فهرست بالرّد وبعدما. دار ليتسنّى الإحتفاظ لم, مما بل الشرقي العناد والإتحاد. بلا ما وبدأت يعادل, إذ إستعمل الأهداف انتصارهم دول, والتي الرئيسية بلا لم. ان والقرى السادس وبالرغم كان. </p>",
      "details": [
        "Building Age: <span>2 Years</span>",
        "Parking: <span>Attached Garage</span>",
        "Cooling: <span>Central Cooling</span>",
        "Heating: <span>Forced Air, Gas</span>",
        "Sewer: <span>Public/City</span>",
        "Water: <span>City</span>",
        "Exercise Room: <span>Yes</span>",
        "Storage Room: <span>Yes</span>"
      ],
      "detailsAr": [
        "عمر البناء: <span>2 اعوام</span>",
        "جاراج: <span>جراج مرفق</span>",
        "تكييف: <span>تكييف مركذي</span>",
        "مدفأة: <span>هواء مدفوع, غاز</span>",
        "صرف صحي: <span>عام\مدينة</span>",
        "ماء: <span>مدينة</span>",
        "غرفة تمارين: <span>نعم</span>",
        "غرفة تخزين: <span>نعم</span>"
      ],
      "features": [
        "Air Conditioning",
        "Swimming Pool",
        "Central Heating",
        "Laundry Room",
        "Gym",
        "Alarm",
        "Window Covering",
        "Internet"
      ],
      "featuresAr": [
        "تكييف هواء",
        "حمام سباحة",
        "سخان مركذي",
        "غرفة غسييل",
        "صالة رياضية",
        "جهاز انزار",
        "غطاء نوافز",
        "انترنت"
      ],
      "floorPlans": [
        {
          "title": "First Floor",
          "area": "460 sq ft",
          "image": "https://i.imgur.com/kChy7IU.jpg",
          "description": "Mauris mauris ante, blandit et, ultrices a, susceros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate aliquam egestas litora torquent conubia."
        },
        {
          "title": "Second Floor",
          "area": "440 sq ft",
          "image": "https://i.imgur.com/l2VNlwu.jpg",
          "description": "Mauris mauris ante, blandit et, ultrices a, susceros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate aliquam egestas litora torquent conubia."
        },
        {
          "title": "Garage",
          "area": "140 sq ft",
          "image": "https://i.imgur.com/0zJYERy.jpg",
          "description": "Mauris mauris ante, blandit et, ultrices a, susceros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate aliquam egestas litora torquent conubia."
        }
      ],
      "video": "https://www.youtube-nocookie.com/embed/UPBJKppEXoQ?rel=0&amp;showinfo=0",
      "latitude": "40.7427837",
      "longitude": "-73.11445617675781",
      "similarProperties": [
        {
          "id": 1,
          "state": "For Rent",
          "price": "$1700",
          "priceDetail": "monthly",
          "image": "assets/images/listing-03.jpg",
          "title": "Meridian Villas",
          "mapUrl": "https://maps.google.com/maps?q=221B+Baker+Street,+London,+United+Kingdom&hl=en&t=v&hnear=221B+Baker+St,+London+NW1+6XE,+United+Kingdom",
          "adress": "778 Country St. Panama City, FL",
          "area": 1450,
          "bedrooms": 1,
          "rooms": 2,
          "bathrooms": 2,
          "client": "Chester Miller",
          "date": 4
        },
        {
          "id": 2,
          "state": "For Sale",
          "price": "$420,000",
          "priceDetail": "$770 / sq ft",
          "image": "assets/images/listing-04.jpg",
          "title": "Selway Apartments",
          "mapUrl": "https://maps.google.com/maps?q=221B+Baker+Street,+London,+United+Kingdom&hl=en&t=v&hnear=221B+Baker+St,+London+NW1+6XE,+United+Kingdom",
          "adress": "33 William St. Northbrook, IL",
          "area": 540,
          "bedrooms": 1,
          "rooms": 2,
          "bathrooms": 3,
          "client": "Kristen Berry",
          "date": 3
        },
        {
          "id": 1,
          "state": "For Sale",
          "price": "$535,000",
          "priceDetail": "$640 / sq ft",
          "image": "assets/images/listing-05.jpg",
          "title": "Oak Tree Villas",
          "mapUrl": "https://maps.google.com/maps?q=221B+Baker+Street,+London,+United+Kingdom&hl=en&t=v&hnear=221B+Baker+St,+London+NW1+6XE,+United+Kingdom",
          "adress": "71 Lower River Dr. Bronx, NY",
          "area": 350,
          "bedrooms": 1,
          "rooms": 2,
          "bathrooms": 1,
          "client": "Mabel Gagnon",
          "date": 4
        }
      ],
      "client": {
        "id": 1,
        "name": "Jennie Wilson",
        "image": "assets/images/agent-avatar.jpg",
        "phone": "(123) 123-456"
      }
    },
    "profileInfo": {
      "name": "Jennie Wilson",
      "title": "Agent In New York",
      "phone": "(123) 123-456",
      "email": "jennie@example.com",
      "about": "Maecenas quis consequat libero, a feugiat eros. Nunc ut lacinia tortor morbi ultricies laoreet ullamcorper phasellus semper",
      "social": {
        "twitter": "https://www.twitter.com/",
        "facebook": "https://www.facebook.com/",
        "google": "https://www.google.com/",
        "linkedin": "https://www.linkedin.com/"
      },
      "image": "assets/images/agent-02.jpg"
    },
    "bookmarks": [
      {
        "id": 1,
        "image": "assets/images/listing-05.jpg",
        "title": "Oak Tree Villas",
        "adress": "71 Lower River Dr. Bronx, NY",
        "price": "$535,000",
      },
      {
        "id": 2,
        "image": "assets/images/listing-06.jpg",
        "title": "Old Town Manchester",
        "adress": "7843 Durham Avenue, MD",
        "price": "$420,000",
      },
      {
        "id": 3,
        "image": "assets/images/listing-02.jpg",
        "title": "Serene Uptown",
        "adress": "6 Bishop Ave. Perkasie, PA",
        "price": "$900 / monthly",
      },
      {
        "id": 4,
        "image": "assets/images/listing-04.jpg",
        "title": "Selway Apartments",
        "adress": "33 William St. Northbrook, IL",
        "price": "$420,000",
      }
    ],
    "properties": [
      {
        "id": 1,
        "image": "assets/images/listing-02.jpg",
        "title": "Serene Uptown",
        "adress": "6 Bishop Ave. Perkasie, PA",
        "price": "$900 / monthly",
        "expireDate": "December 30, 2016",
      },
      {
        "id": 2,
        "image": "assets/images/listing-05.jpg",
        "title": "Oak Tree Villas",
        "adress": "71 Lower River Dr. Bronx, NY",
        "price": "$535,000",
        "expireDate": "December 12, 2016",
      },
      {
        "id": 3,
        "image": "assets/images/listing-04.jpg",
        "title": "Selway Apartments",
        "adress": "33 William St. Northbrook, IL",
        "price": "$420,000",
        "expireDate": "December 04, 2016",
      },
      {
        "id": 4,
        "image": "assets/images/listing-06.jpg",
        "title": "Old Town Manchester",
        "adress": "7843 Durham Avenue, MD",
        "price": "$420,000",
        "expireDate": "November 27, 2016",
      }
    ],
    "agents": [
      {
        "id": 1,
        "image": "assets/images/agent-01.jpg",
        "name": "Tom Wilson",
        "title": "Agent In New York",
        "phone": "(123) 123-456",
        "email": "tom@example.com",
      },
      {
        "id": 2,
        "image": "assets/images/agent-02.jpg",
        "name": "Jennie Wilson",
        "title": "Agent In New York",
        "phone": "(123) 123-456",
        "email": "jennie@example.com",
      },
      {
        "id": 3,
        "image": "assets/images/agent-03.jpg",
        "name": "David Strozier",
        "title": "Agent In Chicago",
        "phone": "(123) 123-456",
        "email": "david@example.com",
      },
      {
        "id": 4,
        "image": "assets/images/agent-04.jpg",
        "name": "Charles Watson",
        "title": "Agent In Dallas",
        "phone": "(123) 123-456",
        "email": "charles@example.com",
      }
    ],
    "agentPage": {
      "id": 1,
      "image": "assets/images/agent-02.jpg",
      "name": "Jennie Wilson",
      "title": "Agent In New York",
      "about": "Maecenas quis consequat libero, a feugiat eros. Nunc ut lacinia tortor morbi ultricies laoreet ullamcorper phasellus semper",
      "phone": "(123) 123-456",
      "email": "jennie@example.com",
      "listings": [
        {
          "id": 1,
          "featured": true,
          "state": "For Sale",
          "price": "$275,000",
          "priceDetail": "$520 / sq ft",
          "images": [
            "assets/images/listing-01.jpg",
            "assets/images/listing-01b.jpg",
            "assets/images/listing-01c.jpg"
          ],
          "name": "Eagle Apartments",
          "mapUrl": "https://maps.google.com/maps?q=221B+Baker+Street,+London,+United+Kingdom&hl=en&t=v&hnear=221B+Baker+St,+London+NW1+6XE,+United+Kingdom",
          "adress": "9364 School St. Lynchburg, NY",
          "area": 530,
          "bedrooms": 1,
          "rooms": 3,
          "bathrooms": 1,
          "date": 1
        },
        {
          "id": 2,
          "featured": true,
          "state": "For Rent",
          "price": "$900",
          "priceDetail": "monthly",
          "images": [
            "assets/images/listing-02.jpg"
          ],
          "name": "Serene Uptown",
          "mapUrl": "https://maps.google.com/maps?q=221B+Baker+Street,+London,+United+Kingdom&hl=en&t=v&hnear=221B+Baker+St,+London+NW1+6XE,+United+Kingdom",
          "adress": "6 Bishop Ave. Perkasie, PA",
          "area": 440,
          "bedrooms": 1,
          "rooms": 1,
          "bathrooms": 1,
          "date": 2
        },
        {
          "id": 3,
          "featured": false,
          "state": "For Rent",
          "price": "$1700",
          "priceDetail": "monthly",
          "images": [
            "assets/images/listing-03.jpg"
          ],
          "name": "Meridian Villas",
          "mapUrl": "https://maps.google.com/maps?q=221B+Baker+Street,+London,+United+Kingdom&hl=en&t=v&hnear=221B+Baker+St,+London+NW1+6XE,+United+Kingdom",
          "adress": "778 Country St. Panama City, FL",
          "area": 1450,
          "bedrooms": 1,
          "rooms": 2,
          "bathrooms": 2,
          "date": 4
        },
        {
          "id": 4,
          "featured": false,
          "state": "For Sale",
          "price": "$420,000",
          "priceDetail": "$770 / sq ft",
          "images": [
            "assets/images/listing-04.jpg",
            "assets/images/listing-04b.jpg"
          ],
          "name": "Selway Apartments",
          "mapUrl": "https://maps.google.com/maps?q=221B+Baker+Street,+London,+United+Kingdom&hl=en&t=v&hnear=221B+Baker+St,+London+NW1+6XE,+United+Kingdom",
          "adress": "33 William St. Northbrook, IL",
          "area": 530,
          "bedrooms": 1,
          "rooms": 3,
          "bathrooms": 2,
          "date": 3
        }
      ]
    },
    "popularPosts": [
      {
        "id": 1,
        "title": "What to Do a Year Before Buying Apartment",
        "date": "October 26, 2016",
        "image": "assets/images/blog-widget-03.jpg"
      },
      {
        "id": 2,
        "title": "Bedroom Colors You'll Never Regret",
        "date": "November 9, 2016",
        "image": "assets/images/blog-widget-02.jpg"
      },
      {
        "id": 3,
        "title": "8 Tips to Help You Finding New Home",
        "date": "November 12, 2016",
        "image": "assets/images/blog-widget-01.jpg"
      }
    ],
    "blogPost": {
      "id": 1,
      "image": "assets/images/blog-post-02a.jpg",
      "title": "Bedroom Colors You'll Never Regret",
      "date": "Novemer 9, 2016",
      "commentsNum": 5,
      "post": "<p>Nam nisl lacus, dignissim ac tristique ut, scelerisque eu massa. Vestibulum ligula nunc, rutrum in malesuada vitae, tempus sed augue. Curabitur quis lectus quis augue dapibus facilisis. Vivamus tincidunt orci est, in vehicula nisi eleifend ut. Vestibulum sagittis varius orci vitae.</p><div class='post-quote'><span class='icon'></span><blockquote>Mauris aliquet ultricies ante, non faucibus ante gravida sed. Sed ultrices pellentesque purus, vulputate volutpat ipsum hendrerit sed neque sed sapien rutrum.</blockquote></div><p>In ut odio libero, at vulputate urna. Nulla tristique mi a massa convallis cursus. Nulla eu mi magna. Etiam suscipit commodo gravida. Cras suscipit, quam vitae adipiscing faucibus, risus nibh laoreet odio, a porttitor metus eros ut enim. Morbi augue velit, tempus mattis dignissim nec, porta sed risus. Donec eget magna eu lorem tristique pellentesque eget eu dui. Fusce lacinia tempor malesuada. Ut lacus sapien, placerat a ornare nec, elementum sit amet felis. Maecenas pretium lorem hendrerit eros sagittis fermentum.</p><p>Phasellus enim magna, varius et commodo ut, ultricies vitae velit. Ut nulla tellus, eleifend euismod pellentesque vel, sagittis vel justo. In libero urna, venenatis sit amet ornare non, suscipit nec risus. Sed consequat justo non mauris pretium at tempor justo sodales. Quisque tincidunt laoreet malesuada. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer vitae ante enim. Fusce sed elit est. Suspendisse sit amet mauris in quam pretium faucibus et aliquam odio. </p>",
      "next": {
        "id": 1,
        "post": "Tips For Newbie Hitchhiker"
      },
      "prev": {
        "id": 2,
        "post": "What's So Great About Merry?"
      },
      "author": {
        "image": "assets/images/agent-avatar.jpg",
        "name": "Jennie Wilson",
        "email": "jennie@example.com",
        "about": "Nullam ultricies, velit ut varius molestie, ante metus condimentum nisi, dignissim facilisis turpis ex in libero. Sed porta ante tortor, a pulvinar mi facilisis nec. Proin finibus dolor ac convallis congue."
      },
      "relatedPosts": [
        {
          "id": 1,
          "image": "assets/images/blog-post-02.jpg",
          "title": "Bedroom Colors You'll Never Regret",
          "post_header": "Nam nisl lacus, dignissim ac tristique ut, scelerisque eu massa. Vestibulum ligula nunc, rutrum in malesuada vitae."
        },
        {
          "id": 2,
          "image": "assets/images/blog-post-03.jpg",
          "title": "What to Do a Year Before Buying Apartment",
          "post_header": "Nam nisl lacus, dignissim ac tristique ut, scelerisque eu massa. Vestibulum ligula nunc, rutrum in malesuada vitae."
        }
      ],
      "comments": [
        {
          "image": "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&amp;s=70",
          "name": "Kathy Brown",
          "date": "12th, June 2015",
          "comment": "Morbi velit eros, sagittis in facilisis non, rhoncus et erat. Nam posuere tristique sem, eu ultricies tortor imperdiet vitae. Curabitur lacinia neque non metus",
          "replies": [
            {
              "image": "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&amp;s=70",
              "name": "Tom Smith",
              "date": "12th, June 2015",
              "reply": "Rrhoncus et erat. Nam posuere tristique sem, eu ultricies tortor imperdiet vitae. Curabitur lacinia neque."
            },
            {
              "image": "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&amp;s=70",
              "name": "Kathy Brown",
              "date": "12th, June 2015",
              "reply": "Nam posuere tristique sem, eu ultricies tortor."
            },
            {
              "image": "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&amp;s=70",
              "name": "John Doe",
              "date": "12th, June 2015",
              "reply": "Great template!"
            },
          ]
        },
        {
          "image": "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&amp;s=70",
          "name": "John Doe",
          "date": "15th, May 2015",
          "comment": "Commodo est luctus eget. Proin in nunc laoreet justo volutpat blandit enim. Sem felis, ullamcorper vel aliquam non, varius eget justo. Duis quis nunc tellus sollicitudin mauris.",
          "replies": []
        }
      ]
    }
  }

}
