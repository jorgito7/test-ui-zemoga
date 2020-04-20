var jsonArray = null;
var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function()
{
    if (this.readyState == 4 && this.status == 200) {
        jsonArray = JSON.parse(this.responseText);

        var i, j;
        var displayData = '';

        for (i in jsonArray.famous_people)
        {
            var currentFamous = jsonArray.famous_people[i];
            var currentUpAmount = sessionStorage.getItem('voteUp_' + i) 
                ? sessionStorage.getItem('voteUp_' + i)
                : currentFamous.votes[0].up;
            var currentDownAmount = sessionStorage.getItem('voteDown_' + i)
                ? sessionStorage.getItem('voteDown_' + i)
                : currentFamous.votes[0].down;

            var upVotes = getPercentVotes(parseInt(currentUpAmount), parseInt(currentDownAmount));
            var downVotes = getPercentVotes(parseInt(currentUpAmount), parseInt(currentDownAmount), false);

            var winColor =  upVotes <= downVotes ? 'rgb(235, 161, 32, 1)' : 'rgb(49, 192, 186, 1)';
            var thumb =  upVotes <= downVotes ? 'down' : 'up';       

            displayData += '<article style="background-image: url(img/' + currentFamous.image + ')">'
               + '<div class="card-content"><header class="person-name" role="heading">'
               + '<span class="fa fa-thumbs-' + thumb + ' fa-2x" style="background-color: ' + winColor + '; color:#fff"></span>'
               + '<h2>' + currentFamous.name + '</h2>'
               + '</header>'
               + '<div class="description">'
               + '<p class="publication-date">'
               + '<strong>1 month ago</strong>'
               + 'in ' + currentFamous.category + ' </p>'
               + '<p class="card-description" id="desc-' + currentFamous.code + '">' + currentFamous.description + '</p>'
               + '<p class="thanks-desc" id="thanks-' + currentFamous.code + '"> Thank you for voting!</p>'
               + '<p class="form-vote" id="form-vote-' + currentFamous.code + '">'
               + '<button id="form-thumb" name="good-' + currentFamous.code + '" class="good fa fa-thumbs-up fa-2x" role="button"></button>'
               + '<button id="form-thumb" name="bad-' + currentFamous.code + '" class="bad fa fa-thumbs-down fa-2x" role="button"></button>'
               + '<button class="vote" id="vote-once" value="' + currentFamous.code + '">Vote now</button>'
               + '</p><p class="form-again" id="form-again-' + currentFamous.code + '">'
               + '<button class="vote" id="vote-again" value="' + currentFamous.code + '">Vote again</button>'
               + '</p></div><footer>'
               + '<div class="progress">'
               + '<div class="bar" id="bar-up-' + currentFamous.code + '" style="width: ' + upVotes + '%"></div>'
               + '<p class="percent">'
               + '<span class="fa fa-thumbs-up fa-2x"></span>'
               + '<b class="percent-text" id="percent-up-' + currentFamous.code + '">' + upVotes + '%</b>'
               + '</p><div id="bar-down-' + currentFamous.code + '"style="width: ' + downVotes + '%">'
               + '<p class="restant">'
               + '<b class="percent-text" id="percent-down-' + currentFamous.code + '">' + downVotes + '%</b>'
               + '<span class="fa fa-thumbs-down fa-2x"></span></p>'
               + '</div></div></footer></div>'
               + '</article>';
        }
    }

    document.getElementById('famous-container').innerHTML = displayData;
};
        
xmlhttp.open("GET", 'js/famous-data.json', true);
xmlhttp.send();


/*
*   Function to determine the percent to show on the UP progress bar
*
*   @param upVotes int
*   @param downVotes int
*   @param isUpInformation bool
*   @return int
*/

function getPercentVotes(upVotes, downVotes, isUpInformation = true)
{
    var totalVotes = upVotes + downVotes;
    var percentVotes = isUpInformation 
        ? (upVotes*100) / totalVotes
        : (downVotes*100) / totalVotes;
    return Math.round(percentVotes);
}

/*
*   Vanilla Part.
*/

document.addEventListener('click', function (event) {

    var selectedEvent = event.target;

    if (selectedEvent.matches('#form-thumb')) getVote(selectedEvent);
    else if (selectedEvent.matches('#vote-once')) handleVote(selectedEvent);
    else if (selectedEvent.matches('#vote-again')) voteAgain(selectedEvent);
    else return;
    // Don't follow the link
    event.preventDefault();

    // Log the clicked element in the console
    console.log(event.target);

}, false);


/*
*   Function to select the current vote
*
*   @param selectedEvent DOM element
*   @return void
*/

function getVote(selectedEvent)
{
    var code = selectedEvent.name.split('-')[1],
        thumbUp = document.getElementsByName('good-' + code)[0],
        thumbDown = document.getElementsByName('bad-' + code)[0];

    if (thumbUp.classList.contains('selected'))
        thumbUp.classList.remove('selected');
    if (thumbDown.classList.contains('selected'))
        thumbDown.classList.remove('selected');

    selectedEvent.classList.add('selected');
}

/*
*   Function to manage the votes
*
*   @param personSelected int
*   @return void
*/

function handleVote(personSelected)
{
    var code = personSelected.value,
        thumbUp = document.getElementsByName('good-' + code)[0],
        thumbDown = document.getElementsByName('bad-' + code)[0];
    
    if (thumbUp.classList.contains('selected') 
        || thumbDown.classList.contains('selected')) {
        descContainer = document.getElementById('desc-' + code);
        document.getElementById('desc-' + code).style.display = 'none';
        document.getElementById('thanks-' + code).style.display = 'block';
        document.getElementById('form-vote-' + code).style.display = 'none';
        document.getElementById('form-again-' + code).style.display = 'block';
        saveVote(code-1, thumbUp.classList.contains('selected'));

    } else {
        alert('You must select one thumb.');
    }
}

/*
*   Function to modify the voteAgain section
*
*   @param personSelected int
*   @return void
*/

function voteAgain(personSelected)
{
    var code = personSelected.value;
    document.getElementById('form-vote-' + code).style.display = 'block';
    document.getElementById('form-again-' + code).style.display = 'none';
    document.getElementById('desc-' + code).style.display = 'block';
    document.getElementById('thanks-' + code).style.display = 'none';
}

/*
*   Function to save the current vote
*
*   @param personSelected int
*   @param isUpVote boolean
*   @return void
*/

function saveVote(personSelected, isUpVote) {
    var currentUpAmount = sessionStorage.getItem('voteUp_' + personSelected) 
        ? sessionStorage.getItem('voteUp_' + personSelected)
        : jsonArray.famous_people[personSelected].votes[0].up;
    var currentDownAmount = sessionStorage.getItem('voteDown_' + personSelected)
        ? sessionStorage.getItem('voteDown_' + personSelected)
        : jsonArray.famous_people[personSelected].votes[0].down;
   
    if (isUpVote) {
        sessionStorage.setItem('voteUp_' + personSelected, parseInt(currentUpAmount) + 1);
    } else {
        sessionStorage.setItem('voteDown_' + personSelected, parseInt(currentDownAmount) + 1);
    }
    updatePercentBar(personSelected);
}

/*
*   Function to update the percent bar
*
*   @param personSelected int
*   @return void
*/

function updatePercentBar(personSelected) {
    var currentUpAmount = sessionStorage.getItem('voteUp_' + personSelected) 
        ? sessionStorage.getItem('voteUp_' + personSelected)
        : jsonArray.famous_people[personSelected].votes[0].up;
    var currentDownAmount = sessionStorage.getItem('voteDown_' + personSelected)
        ? sessionStorage.getItem('voteDown_' + personSelected)
        : jsonArray.famous_people[personSelected].votes[0].down;

    var upVotes = getPercentVotes(parseInt(currentUpAmount), parseInt(currentDownAmount));
    var downVotes = getPercentVotes(parseInt(currentUpAmount), parseInt(currentDownAmount), false);

    document.getElementById('bar-up-' + (personSelected+1)).style.width = upVotes.toString() + '%';
    document.getElementById('bar-down-' + (personSelected+1)).style.width = downVotes.toString() + '%';
    document.getElementById('percent-up-' + (personSelected+1)).innerHTML = upVotes.toString() + '%';
    document.getElementById('percent-down-' + (personSelected+1)).innerHTML = downVotes.toString() + '%';
}