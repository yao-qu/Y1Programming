/* eslint-disable no-return-assign */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// errorHandling
function handleErrors (response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
};

function AdminWarn () {
    alert('Admin page for editing content!');
};

function synopsis () {
    fetch('http://127.0.0.1:8090/synopsis')
    .then(handleErrors)
    .then(response => response.text())
    .then(body =>
        document.getElementById('synopsis').innerHTML = body)
    .catch(error => console.log(error));
};

// To clear results div
function del2 () {
    fetch('http://127.0.0.1:8090/emptyPost')
    .then(handleErrors)
    .then(response => response.text())
    .then(body =>
        document.getElementById('mysearchresult').innerHTML = body)
    .catch(error => console.log(error));
};

// Displaying search result in div
var searchForm = document.getElementById('search_form');
console.log(searchForm);
search_form.addEventListener('submit', async function (event) {
    try {
        event.preventDefault();
        const keyword = document.getElementById('search_keyword').value;

        const response = await fetch('http://127.0.0.1:8090/search?keyword=' + keyword);

        const body = await response.text();

        const results = JSON.parse(body);

        const resultsDiv = document.getElementById('mysearchresult');

        results.innerHTML = body;

        if (results.length > 0) {
            for (const result of results) {
                const img = document.createElement('img');
                img.setAttribute('src', result.thumbnail);
                resultsDiv.append(img);

                resultsDiv.innerHTML += '<br>';

                resultsDiv.innerHTML += '<b>Season: </b> <br>';

                const season = result.season;
                resultsDiv.append(season);

                resultsDiv.innerHTML += '<br> <br><b>Epsiode: </b> <br>';

                const episode = result.episode;
                resultsDiv.append(episode);

                resultsDiv.innerHTML += '<br> <br><b>Title: </b> <br>';

                const title = result.title;
                resultsDiv.append(title);

                resultsDiv.innerHTML += '<br> <br><b>Detective: </b> <br>';

                const detective = result.detective;
                resultsDiv.append(detective);

                resultsDiv.innerHTML += '<br> <br><b>Victim: </b> <br>';

                const victim = result.victim;
                resultsDiv.append(victim);

                resultsDiv.innerHTML += '<br> <br><b>Culprit: </b> <br>';

                const culprit = result.culprit;
                resultsDiv.append(culprit);

                resultsDiv.innerHTML += '<br> <br><b>Cause of death: </b> <br>';

                const cause = result.cause;
                resultsDiv.append(cause);

                resultsDiv.innerHTML += '<br> <br><b>Description: </b> <br>';

                const description = result.description;
                resultsDiv.append(description);

                resultsDiv.innerHTML += '<br>';
            }
        } else {
            resultsDiv.innerHTML += '<strong> This title does not exist in our (growing) database yet! Try another title.</strong>';
        }
    } catch (error) {
        alert('There was an error ' + error);
    }
});

// Add form input to JSON
var addForm = document.getElementById('add_form');
addForm.addEventListener('submit', async function (event) {
    try {
        event.preventDefault();

        // Extract input data

        const season = document.getElementById('new_season').value;
        const episode = document.getElementById('new_episode').value;
        const title = document.getElementById('new_title').value;
        const detective = document.getElementById('new_detective').value;
        const victim = document.getElementById('new_victim').value;
        const culprit = document.getElementById('new_culprit').value;
        const cause = document.getElementById('new_cause').value;
        const description = document.getElementById('new_description').value;
        const thumbnail = document.getElementById('new_thumbnail').value;
        const data = { season, episode, title, detective, victim, culprit, cause, description, thumbnail };

        const response = await fetch('http://127.0.0.1:8090/newcase',
                                   {
                                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                                    headers: {
                                    'Content-Type': 'application/json'
                                    // 'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    body: JSON.stringify(data) // body data type must match "Content-Type" header
                                   });

        alert('Case has been added to casebook.json');
    } catch (error) {
        alert('There was an error updating' + error);
    }
});

// Saving data from comment input form
var addComment = document.getElementById('add_comment');
addComment.addEventListener('submit', async function (event) {
    try {
        event.preventDefault();

        let Image;

        const Admin = document.getElementById('new_admin').value;
        if (Admin === 'Admin1') {
            Image = '../images/admin1.png';
          }
        if (Admin === 'Admin2') {
            Image = '../images/admin2.png';
          }
        if (Admin === 'Admin3') {
            Image = '../images/admin3.png';
          }

        const Comment = document.getElementById('new_comment').value;

        const data = { Admin, Comment, Image };

        const response = await fetch('http://127.0.0.1:8090/newcomment',
                                   {
                                       method: 'POST',
                                       body: JSON.stringify(data),
                                       headers: {
                                           'Content-Type': 'application/json'
                                       }
                                   });

        alert('Comment added!');
    } catch (error) {
        alert('There was an error updating' + error);
    }
});

var commentBox = document.querySelector('#commentbar');

    // fetch from comments.json
fetch('./comments.json')
.then(function (response) {
    if (!response.ok) {
        throw new Error('HTTP error, status = ' + response.status);
    }
    return response.json();
})
.then(function (json) {
    // display comments in reverse order
    // each comment is appended to a new bootstrap card via createElement
for (var i = json.length - 1; i >= 0; i--) {
    var iComment = document.createElement('div');
    iComment.className = 'card';
    iComment.innerHTML = ' <strong> Posted by: </strong>' + json[i].Admin + '<br>' + json[i].Time;
    const img = document.createElement('img');
    img.setAttribute('src', json[i].Image);
    img.style.width = 50 + 'px';
    iComment.append(img);
    iComment.innerHTML += ' <strong> Comment: </strong>' + json[i].Comment;
    commentBox.appendChild(iComment);
}
})
// if error, display error message
.catch(function (error) {
var p = document.createElement('p');
p.appendChild(
    document.createTextNode('Error: ' + error.message)
);
document.body.insertBefore(p, commentBox);
});
