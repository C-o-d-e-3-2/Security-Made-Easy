const base_url = 'https://glowing-capybara-5g5qx597qw434j5v-3000.app.github.dev';

if (localStorage.getItem('loggedIn') != 'true') {
    window.location = './index.html';
}

function logOut() {
    localStorage.setItem('loggedIn', 'false');
    localStorage.removeItem('username');
    window.location = './index.html';
}



/* Unset Variables */
let templateArray;
let selectedTempId;
let selectedTempItem;
let newListItem;
let emailArray;
let newEmailItem;

/* DOM Variables */
const listContainer = document.getElementById('templateListContainer');
const emailContainer = document.getElementById('emailList');
let dropDownValue = document.getElementById('tempDropDisplay');
var addEmailBtn = document.getElementById('addEmailBtn');
var emailItems = document.querySelectorAll('.email-item');



/* Function to select the corrisponding radio button when an item on the template list is clicked */
function selectRadio(radioId) {
    $('#sendMailBtn').removeClass('disabled-send');
    document.getElementById(radioId).checked = true;
    selectedTempId = radioId.substring(4);
    selectedTempItem = templateArray.find(template => template.id == selectedTempId);
    dropDownValue.innerHTML = `<span>${selectedTempItem.name}</span><span id="dropdownCarets"><i class="fas fa-caret-up" style="margin-bottom: -2px;"></i><i class="fas fa-caret-down" style="margin-top: -2px;"></i></span>`;
    $('#tempEditor').val(selectedTempItem.content);
    $('#tempName').val(selectedTempItem.name);
    $('#tempName').removeAttr('disabled');
    if ($('#templateListContainer').hasClass('active')) {
        $('#templateListContainer').removeClass('active');
    }
}
/* Function to open and close the template list */
function openCloseTempList() {
    if ($('#templateListContainer').hasClass('active')) {
        $('#templateListContainer').removeClass('active');
    } else {
        $('#templateListContainer').addClass('active');
    }
}



/* Function to add an item to the email list */
function addEmailItem() {
    if ($('#emailInput').val() != '') {
        fetch(base_url + '/user/add/new', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ email: $('#emailInput').val() }),
        })
        .then((res) => res.json())
        .then((response) => {
            $('#emailInput').val('');
            emailContainer.innerHTML = '';
            response.forEach((email) => {
                newEmailItem = `<span class="email-item"><span class="email-text">${email.email}</span><span class="delete-item" onclick="removeEmailItem(this)"><i class="fas fa-close"></i></span></span>`;
                emailContainer.insertAdjacentHTML('beforeend', newEmailItem);
            });
            emailArray = response;
        })
    }
}
/* Function to remove an item from the email list */
function removeEmailItem(el) {
    fetch(base_url + '/user/delete/id', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ email: $(el).prev().text() }),
    })
    .then((res) => res.json())
    .then((response) => {
        emailContainer.innerHTML = '';
        response.forEach((email) => {
            newEmailItem = `<span class="email-item"><span class="email-text">${email.email}</span><span class="delete-item" onclick="removeEmailItem(this)"><i class="fas fa-close"></i></span></span>`;
            emailContainer.insertAdjacentHTML('beforeend', newEmailItem);
        });
        emailArray = response;
    })
}



/* Event Listeners */
window.addEventListener('click', function (e) {
    if ($('#templateListContainer').hasClass('active')) {
        if (document.getElementById('templateDropdown').contains(e.target)) {
            return;
        } else {
            $('#templateListContainer').removeClass('active');
        }
    }
});



/* Function to save the template */
function saveTemplate() {
    fetch(base_url + '/email/edit/id', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ templateId: selectedTempId, name: $('#tempName').val(), content: $('#tempEditor').val() }),
    })
    .then((res) => res.json())
    .then((response) => {
        $('#tempEditor').val('');
        $('#tempName').val('');
        listContainer.innerHTML = '';
        dropDownValue.innerHTML = `<span>Select a template...</span><span id="dropdownCarets"><i class="fas fa-caret-up" style="margin-bottom: -2px;"></i><i class="fas fa-caret-down" style="margin-top: -2px;"></i></span>`;
        response.forEach((template) => {
            newListItem = `<span class="template-list-item" onclick="selectRadio('temp${template.id}')">${template.name}<input type="radio" class="template-radio" name="template-list" value="${template.name}" id="temp${template.id}"/></span>`;
            listContainer.insertAdjacentHTML('beforeend', newListItem);
        });
        templateArray = response;
    })
}



/* Function to send the mail */
function sendMailFunc() {
    let newEmailArray = [];

    emailArray.forEach((email) => {
        newEmailArray.push(email.email)
    })
    fetch('https://app-gp6swyu7ma-uc.a.run.app/sendPhishingEmails', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ emails: newEmailArray, templateId: selectedTempId, subject: selectedTempItem.name, emailTemplate: selectedTempItem.content })
    })
}



/* Page Load Functions */
$('#username').text(localStorage.username);
function getAllEmails() {
    fetch(base_url + '/user/all', {
        method: 'GET'
    })
        .then((res) => res.json())
        .then((response) => {
            response.forEach((email) => {
                newEmailItem = `<span class="email-item"><span class="email-text">${email.email}</span><span class="delete-item" onclick="removeEmailItem(this)"><i class="fas fa-close"></i></span></span>`;
                emailContainer.insertAdjacentHTML('beforeend', newEmailItem);
            });
            emailArray = response;
        })
}
function getAllTemplates() {
    fetch(base_url + '/email/all', {
        method: 'GET'
    })
        .then((res) => res.json())
        .then((response) => {
            response.forEach((template) => {
                newListItem = `<span class="template-list-item" onclick="selectRadio('temp${template.id}')">${template.name}<input type="radio" class="template-radio" name="template-list" value="${template.name}" id="temp${template.id}"/></span>`;
                listContainer.insertAdjacentHTML('beforeend', newListItem);
            });
            templateArray = response;
        })
}

getAllEmails();
getAllTemplates();