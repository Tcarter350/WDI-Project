const mongoose = require('mongoose');
const User = require('../models/user');

let mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/events-api';
mongoose.connect(mongoUri);

User.collection.drop();

User.create([{
  firstName: "Mike",
  lastName: "Beadle",
  email: "mike.hayden@ga.co",
  age: 25,
  gender: "Male",
  interestedIn: "Women",
  postcode: "E1W 2RG",
  lat: 51.5089393,
  lng: -0.0614053,
  fact: "I once auditioned to be the Milky Bar Kid",
  profilePic: "http://www2.mmu.ac.uk/media/mmuacuk/content/images/health-professions/student-profile-simone-bianchi-piantini.jpg",
  password: "password",
  passwordConfirmation: "password"
},{
  firstName: "Kate",
  lastName: "Winton",
  email: "kenbone@example.com",
  age: 28,
  gender: "Female",
  interestedIn: "Men",
  postcode: "N17 0AP",
  lat: 51.6028157,
  lng: -0.070018,
  fact: "I like to go bouldering in my spare time. I'm an adventurist!",
  profilePic: "https://assets.entrepreneur.com/content/16x9/822/20150406145944-dos-donts-taking-perfect-linkedin-profile-picture-selfie-mobile-camera-2.jpeg",
  password: "password",
  passwordConfirmation: "password"
},{
  firstName: "James",
  lastName: "Patrick",
  email: "sterlingarcher@example.com",
  age: 36,
  gender: "Male",
  interestedIn: "Women",
  postcode: "W1D 4HS",
  lat: 51.5121345,
  lng: -0.1346313,
  fact: "Currently training to become an actor",
  profilePic: "http://adesignaward.com/designer/402730e84c6706c1f1ef41c3dfea8a3be70fb187-big.jpg",
  password: "guest",
  passwordConfirmation: "guest"
},{
  firstName: "Karl",
  lastName: "Kris",
  email: "bojackhorseman@example.com",
  age: 52,
  gender: "Male",
  interestedIn: "Women",
  postcode: "N7 7AJ",
  lat: 51.5540315,
  lng: -0.111013,
  fact: "Originally from Germany!",
  profilePic: "https://www.newschool.edu/uploadedImages/Parsons/Profiles/jamer_hunt_profile.jpg?n=4468",
  password: "password",
  passwordConfirmation: "password"
},{
  firstName: "Ray",
  lastName: "Gill",
  email: "raygillette@example.com",
  age: 37,
  gender: "Male",
  interestedIn: "Men",
  postcode: "SE1 6DP",
  lat: 51.4918063,
  lng: -0.1042003,
  fact: "I won last years 'Sony Photographer of the Year'",
  profilePic: "http://www.christopherxjjensen.com/wp-content/gallery/profile-pics/Profile-Pic_2014-09-07_1000px.jpg",
  password: "guest",
  passwordConfirmation: "guest"
},{
  firstName: "Emily",
  lastName: "Ngenwe",
  email: "dianenguyen@example.com",
  age: 56,
  gender: "Female",
  interestedIn: "Men",
  postcode: "BR3 4JP",
  lat: 51.4081874,
  lng: -0.0413848,
  fact: "I attended Boston University where I majored in Literature and Equine Studies",
  profilePic: "http://www.american.edu/uploads/profiles/large/agolini.png",
  password: "password",
  passwordConfirmation: "password"
},{
  firstName: "Phoebe",
  lastName: "Archer",
  email: "maloryarcher@example.com",
  age: 30,
  gender: "Female",
  interestedIn: "Men/Women",
  postcode: "NW7 3AL",
  lat: 51.6435682,
  lng: -0.2737067,
  fact: "I'm allergic to zucchini!",
  profilePic: "https://pbs.twimg.com/profile_images/2170585198/profile-pic_400x400.jpg",
  password: "guest",
  passwordConfirmation: "guest"
}], (err, users) => {
  if(err) console.log("Error seeding users", err);
  console.log(`${users.length} users created`);

  mongoose.connection.close();
});
