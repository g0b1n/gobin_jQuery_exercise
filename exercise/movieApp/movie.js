// id to keep track of which element to remove (this would be better not in global scope)

// keeps track of the ID of the current movie. starts with 0
let currentId = 0;

// list of all of movies in memory for sorting / repainting
// array to hold all the movies in memory for sorting and repainting.
let moviesList = [];

// make sures teh code inside the function is executed when the DOM has finished loading
$(function() {
  // when you click the delete button, remove the closest parent tr

  // attaches a submit event handler to the form with the ID "new-movie-form". when the form is submitted, the funciton is executed
  $("#new-movie-form").on("submit", function(evt) {
   
   // prevents the default form submission behavior, which would cause the page to reload.
    evt.preventDefault();
   
   // reterives the value entered in the input field with the ID 'title' and assigns it to the 'title' variable.
    let title = $("#title").val();
    // reterives the value entered in the input field with the ID "rating" and assigns it to the 'title' variable.
    let rating = $("#rating").val();

   // creates an object with 3 properties using the values obtained from the form properties.
    let movieData = { title, rating, currentId };
   
   // calls the createMovieDataHTML function to generate HTMl content based on the movieData object.
    const HTMLtoAppend = createMovieDataHTML(movieData);

    //increments by 1.
    currentId++
   // adds moivedata object to the movie list array.
    moviesList.push(movieData);
    
    // appends the genearted HTML content to the element with the ID "movie-table-body" to display the new movie in the table
    $("#movie-table-body").append(HTMLtoAppend);
    
    // resets the form fields to their default values.
    $("#new-movie-form").trigger("reset");
  });

  // when the delete button is clicked, remove the closest parent tr and remove from the array of movies
     // attaches a click event handler to the button element with the classes 'btn' and 'btn-danger' within the table body. when button is clicked, the function is executed.
  $("tbody").on("click", ".btn.btn-danger", function(evt) {
    // find the index where this movie is
   
   // finds the index of the movie to be removed in the movieList array by comparing the currentID property of each movie object with the value stored in the button's data-delete-id attribute
    let indexToRemoveAt = moviesList.findIndex(movie => movie.currentId === +$(evt.target).data("deleteId"))
    
    // remove it from the array of movies
   
   // removes the movie at the specified index from the 'moviesList' array.
    moviesList.splice(indexToRemoveAt, 1)

    // remove it from the DOM

    //removes the closest parent <tr> element to the clicked button form the DOM, effectively removing the corresponding movie from the table.
    $(evt.target)
      .closest("tr")
      .remove();
    
  });

  // when an arrow is clicked, 

  // attaches a click event handler to all elements with the class "fas"(front awesome icons). when any of these icons are clicked, the function is exectued
  
  // adds a click event listener to the elements with the class "fas". the event handler function is called when an arrow is clicked.
  $(".fas").on("click", function(evt) {
    
    // figure out what direction we are sorting and the key to sort by
    
    // determines the sorting direction based on the presence of the class "fa-sort-down" on the clicked element. If the class exists, the direction is set to "down"; otherwise, it is set to "up".
   //determines the sorting direction based on the presence of the class "fa-sort-down" on the clicked element. if the class exists, the direction is set to "down", otherwise, it is set to "up"
    let direction = $(evt.target).hasClass("fa-sort-down") ? "down" : "up";
   
   // retrieves the value of the "id" attribute of the clicked element and assigns it to
   
   // retrieves the value of the "id" attribute of the clicked element and assigns it to the keyToSortby, this value represents the key by which movie list will be sorted.
   let keyToSortBy = $(evt.target).attr("id");
    
   // calls the sortBy function, passing in the moviesList array the keyToSortyBy and the direction. this function returns a new array of movies sorted based on the specified key and direction.
   let sortedMovies = sortBy(moviesList, keyToSortBy, direction);
    
    // empty the table with the id movie-table-body to remove any existing movie rows.
    $("#movie-table-body").empty();

    // loop over our object of sortedMovies and append a new row
   
   // loops over the sortedMovies array and generates HTMl for each movie using the createMovieDataHTML function.
    for (let movie of sortedMovies) {
      
      // appends the generated HTML to the table body with the id "movie-table-body", effietively repopulating the table with the sorted movies.
        const HTMLtoAppend = createMovieDataHTML(movie);
      $("#movie-table-body").append(HTMLtoAppend);
    }

    // toggle the arrow
    // toggles the presence of the class "fa-sort-down" and "fa-sort-up" on the clicked element, which represents the arrow icon, to visually indicate the current sorting direction.
    $(evt.target).toggleClass("fa-sort-down");
    $(evt.target).toggleClass("fa-sort-up");
  });
});

/* accepts an array of objects and a key and sorts by that key */


// this func sorts an array of objects based on a specified key and direction.

// takes 3 parameters
function sortBy(array, keyToSortBy, direction) {
  
  // use of sorth method of the array to perform the sorting. the 'sort' method takes a comparison function that defines the sorting logic.
    return array.sort(function(a, b) {
    // since rating is a number, we have to convert these strings to numbers
   
   // if ketToSortBy is rating it converts it to values of object a nd b from string to numbers using the unary plus operator.
    if (keyToSortBy === "rating") {
      a[keyToSortBy] = +a[keyToSortBy];
      b[keyToSortBy] = +b[keyToSortBy];
    }
   
   // compares the keyToSorthBy values of objects 'a' and 'b' to determine their relative order. 
   // if a[keyToSortBy] is greater than b[keyToSortBy] it returns 1 if the direction is up and -1 if the direction is down. this ensures ascending or descending sorthing based on the direction value.
    if (a[keyToSortBy] > b[keyToSortBy]) {
      return direction === "up" ? 1 : -1;
    } else if (b[keyToSortBy] > a[keyToSortBy]) {
      return direction === "up" ? -1 : 1;
    }
    return 0;
  });
}

/* createMovieDataHTML accepts an object with title and rating keys and returns a string of HTML */

function createMovieDataHTML(data) {
  return `
    <tr>
      <td>${data.title}</td>
      <td>${data.rating}</td>
      <td>
        <button class="btn btn-danger" data-delete-id=${data.currentId}>
          Delete
        </button>
      </td>
    <tr>
  `;
}
