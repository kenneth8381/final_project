
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAmeXYogBm3ceCqQgVXMys0_D8BrbMoC54",
  authDomain: "final-project-dc696.firebaseapp.com",
  databaseURL: "https://final-project-dc696.firebaseio.com",
  projectId: "final-project-dc696",
  storageBucket: "",
  messagingSenderId: "708373659744"
};
firebase.initializeApp(config);
//Connect with database
var database = firebase.database();
var form_open = false;

function Idea(id, initials, name, idea, tags, date_posted, location) {
  this.id = id;
  this.initials = initials;
  this.name = name;
  this.idea = idea;
  this.tags = tags;
  this.date_posted = date_posted;
  this.location = location;
}


function getIdeas(){

    database.ref('ideas').on('value', function(results){

      var allIdeas= results.val();
      var ideas = [];
      for(var item in allIdeas){

        var currentIdea = allIdeas[item];
        var idea = new Idea(item, currentIdea.name.substring(0, 1), currentIdea.name, currentIdea.idea, currentIdea.tags, currentIdea.date_posted, currentIdea.location);
        var source = $('#idea-card-template').html();
        var template = Handlebars.compile(source);
        var ideaListElement = template(idea);
        ideas.push(ideaListElement);

      }

      $('.list-ideas').empty();
      for(var i in ideas){
        $('.list-ideas').prepend(ideas[i]);
      }

    });
}

getIdeas();


$('#idea-form').on('submit', function (e) {
  e.preventDefault()
  var name = $('#name').val()
  var idea = $('#idea').val()
  var tags = $('#tags').val()

  var errorElement = $(".error-message");
  if (name === '') {
    errorElement.removeClass("hidden");
    errorElement.text("Please enter your name");
    return;
  } else if (idea === '') {
    errorElement.removeClass("hidden");
    errorElement.text("Please enter your amazing idea");
    return;
  } else if (tags === '') {
    errorElement.removeClass("hidden");
    errorElement.text("Please enter atleast one tag");
    return;
  } else {
    errorElement.addClass("hidden");
    errorElement.text("");
  }

  var newIdea = {
    name: name,
    idea: idea,
    tags: tags,
    date_posted: new Date().toDateString(),
    location: {
      longitude: 32.10,
      latitude: 35.10
    }
  }
  var ideaCollection = database.ref('ideas');
  ideaCollection.push(newIdea)

  $('#idea-form')[0].reset();
  changeform();
});

function initMap(){
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 38.9907, lng: -77.0261},
        zoom: 15,
        scrollwheel: false
      });

    var marker = new google.maps.Marker({
      position: map.center,
      map: map
    });
}

function changeform() {
  if (form_open === true) {
    form_open = false;
    $('#idea-form').addClass('hidden');
    $('.floating').text("+")
  } else {
    form_open = true;
    $('#idea-form').removeClass('hidden');
    $('.floating').text("x")
  }
}