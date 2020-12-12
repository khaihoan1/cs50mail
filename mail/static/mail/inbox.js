document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  // Compose new email
  document.querySelector('#compose-form').onsubmit = (ev) => {
    ev.preventDefault();
    new_mail();
  }
});



function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#error-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#error-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Fetch emails from this mailbox and show
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(result => {
    if ((result.length) == 0){
      document.querySelector("#error-view").style.display = "block";
      document.querySelector("#error-view").innerHTML = 'This mailbox is empty';
    } else {
      result = result.reduce(show_emails, '');
      console.log(result);
      document.querySelector('#emails-view').innerHTML = result;

    } 
  })
}

function new_mail() {
  // Prepare data to send to API
  var data = document.querySelector("#compose-form");
  var body = JSON.stringify({
    recipients: data['compose-recipients'].value,
    subject: data['compose-subject'].value,
    body: data['compose-body'].value
  });
  // Send data to API
  fetch('/emails', {
    method: 'POST',
    body: body
  })
  .then(response => response.json())
  .then(result => {
    // Success
    if (result.message) {
      load_mailbox('sent');
    } else {
      // Error
      error_inform(result);
    }
  })
}

function error_inform(obj) {
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "none";
  document.querySelector("#error-view").style.display = "block";
  document.querySelector("#error-view").innerHTML = obj['error'];
}

function show_emails(html, data) {
  let title = `<div>${data.subject}</div>`;
  let info = `<div><span>${data.sender}</span><span>${data.timestamp}</span></div>`;
  let body = `<div>${data.body}</div>`;
  return html + '<div class="email">'+ title + info + body + '</div>';
}