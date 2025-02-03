function User(firstname, lastname, username, password) {
    return {
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname,
        contacts: [],
        toDos: [],
        meetings: []
    }
}

function Contact(name, company, phone, email){
    return {
        name: name,
        company: company,
        phone: phone,
        email: email
    }
}

function contactToHTMLString(contact) {
    return `<tr> 
                <td>${contact.name}</td> 
                <td>${contact.company}</td> 
                <td>${contact.phone}</td> 
                <td>${contact.email}</td> 
            </tr>`;
}

function Meeting(topic, date, time, duration, location, leader) {
    return {
        topic: topic,
        date: date,
        time: time,
        duration: duration,
        location: location,
        leader: leader
    };
}

function meetingToHTMLString(meeting) {
    return `<li>${meeting.topic}</li>
            <ul>
                <li>${meeting.date} ${meeting.time}</li>
                <li>${meeting.location}</li>
                <li>${meeting.leader}</li>
            </ul>`;
}





const app = {
    init: function() {
        //localStorage.setItem("Current User", "");
        
        this.login();
    },

    show: function(templateId) {
        let pgToRemove = document.querySelectorAll('.showing');
        pgToRemove.forEach(pg => document.body.removeChild(pg));

        let template = document.getElementById(templateId);
        let templateContent = template.content.cloneNode(true);

        let div_ = document.createElement('div');
        div_.classList.add('showing');
        div_.appendChild(templateContent);

        if (templateId !== 'login' && templateId !== 'register') {
            let nav_bar = document.getElementById('nav-bar');
            let nav_bar_content = nav_bar.content.cloneNode(true);
            let nav_bar_div = document.getElementById('flex-container');
            nav_bar_div.classList.add('showing');
            nav_bar_div.appendChild(nav_bar_content);

            document.getElementById('go-to-meetings').addEventListener('click', (event) => {
                event.preventDefault();
                this.meetingsPage();
            });

            document.getElementById('go-to-tasks').addEventListener('click', (event) => {
                event.preventDefault();
                this.toDoPage();
            });

            document.getElementById('go-to-contacts').addEventListener('click', (event) => {
                event.preventDefault();
                this.contactsPage();
            });

            document.getElementById('logout').addEventListener('click', (event) => {
                event.preventDefault();
                this.logout();
            });
        } 
        document.body.appendChild(div_);
    },

    login: function() {
        
        this.show('login');

        document.querySelector('a').addEventListener('click', () => {
            this.register();
        })

        document.querySelector('.showing form').addEventListener('submit', (event) => {
            event.preventDefault();

            const username_ = document.getElementById('username').value;
            const password_ = document.getElementById('pw').value;
            //const response = server.setCurrentUser(username_, password_);



            if (response === 404) {
                alert('User Not Found');
                return;
            }
            if (response === 201) {
                alert('Password is Incorrect');
                return;
            } 
            if (response === 200) {
                alert('Log In Successful');
                this.meetingsPage();
            }
        });
    },

    register: function() {
        this.show('register');

        document.querySelector('.showing form').addEventListener('submit', (event) => {
            event.preventDefault();

            const username_ = document.getElementById('newusername').value;
            const password_ = document.getElementById('newpw').value;
            const confirmPassword = document.getElementById('confirmpw').value;
            const firstname_ = document.getElementById('firstname').value;
            const lastname_ = document.getElementById('lastname').value;

            

            if (users_ && users_.keys.find(usrname => usrname === username_)) {
                alert('Username is taken, please choose a different username');
                return;
            }
            if (password_ !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            const newuser = new User(firstname_, lastname_, username_, password_);

            

            //this.login();
        });
    },

    logout: function() {
        server.setCurrentUser('');
        this.login();
    },

    meetingsPage: function() {
        this.show('meetings');
        const meetingDetails = server.getMeetingsDetails(true);
        document.querySelector('ol').innerHTML = meetingDetails;
        
        document.getElementById('create-meeting').addEventListener('click', server.addMeeting);
    },

    contactsPage: function() {
        this.show('contacts');
        const userContacts = server.getContacts(true);
        document.querySelector('tbody').innerHTML = userContacts;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});