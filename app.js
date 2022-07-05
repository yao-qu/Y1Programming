const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

var casebook = require('./casebook.json');
var comments = require('./client/comments.json');

app.use(express.static('client'));

const synopsis = ['British detective Richard Poole is assigned to investigate the murder of a British police officer on the fictional Caribbean island of Saint Marie. <br>',
'<iframe width="240" height="200"',
'src="https://www.youtube.com/embed/XA3Ym0SbbXE" frameborder="0" allow="accelerometer;',
'autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'].join('\n');

const emptyPost = ' ';

app.get('/synopsis', function (request, response) {
    response.send(synopsis);
});

app.get('/', function (request, response) {
    response.send(casebook);
});

app.get('/emptyPost', function (request, response) {
    response.send(emptyPost);
});

app.post('/newcase', function (request, response) {
    const newCase = {
        id: casebook.length + 1,
        season: request.body.season,
        episode: request.body.episode,
        title: request.body.title,
        detective: request.body.detective,
        victim: request.body.victim,
        culprit: request.body.culprit,
        cause: request.body.cause,
        thumbnail: request.body.thumbnail,
        description: request.body.description
    };
    if (!newCase.title || !newCase.season || !newCase.episode) {
        return response.status(400).json({ Alert: 'Please include season, episode and title of the case!' });
    }
    casebook.push(newCase);

    const json = JSON.stringify(casebook);
    fs.writeFile('casebook.json', json, 'utf8', console.log);

    response.status(200).send('New case added onto JSON file!');
    });

// SEARCH case by ID
app.get('/comment/:id', (request, response) => {
    const found = comments.some(c => c.id === parseInt(request.params.id));

    if (found) {
        response.json(comments.filter(c => c.id === parseInt(request.params.id)));
    } else {
        response.status(400).json({ Alert: `Comment ${request.params.id} not found!` });
    }
    });

// POST new comment
app.post('/newcomment', (request, response) => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    var dateTime = date + ' ' + time;

    const newComment = {
        id: comments.length + 1,
        Admin: request.body.Admin,
        Image: request.body.Image,
        Comment: request.body.Comment,
        Time: dateTime
    };
    if (!newComment.Comment || !newComment.Admin || !newComment.Image) {
        return response.status(400).json({ Alert: 'Please include a description of your update!' });
    }
    comments.push(newComment);
    const json = JSON.stringify(comments);
    fs.writeFile('client/comments.json', json, 'utf8', console.log);
    response.status(200).send('New update added to comment box!');
});

// Search case by title
app.get('/search', async (request, response) => {
    try {
        const keyword = request.query.keyword;

        var matching = [];

        if (keyword) {
        for (let i = 0; i < casebook.length; i++) {
            if (casebook[i].title.toLowerCase().includes(keyword.toLowerCase())) {
                matching.push(casebook[i]);
            }
        }
        console.log(matching);

        if (matching.length > 0) {
            return response.status(200).send(matching);
        } else {
            return response.status(400).json({ Alert: 'No case found with this title, please try again.' });
        }
    }
    } catch (error) {
        console.log(error);
    }
    });

module.exports = app;
