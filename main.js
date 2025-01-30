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

const server = {
    code: {
        "ERROR_NOT_FOUND": 404,
        "ERROR_USER_DATA": 201,
        "ERROR_DATA_EXISTS": 202,
        "SUCCESS": 200
    },

    getUser: function(username_) {
        return JSON.parse(localStorage.getItem("Users"))
                .find(usr => usr.username === username_);
    },

    addUser: function(user, confirmPassword = '') {
        const users = JSON.parse(localStorage.getItem("Users"));

        if (this.getUser(user.username)) {
            return this.code["ERROR_DATA_EXISTS"];
        }
        if (user.password !== confirmPassword) {
            return this.code["ERROR_USER_DATA"];
        }

        users.push(user);
        localStorage.setItem("Users", JSON.stringify(users));
        return this.code["SUCCESS"];
    },

    getCurrentUser: function(details = false) {
        const username_ = JSON.parse(localStorage.getItem("Current User"));
        if (username_ !== "" && !details) {
            return username_;
        } else if (username_ !== "" && details){
            return this.getUser(username_);
        } else {
            return this.code["ERROR_NOT_FOUND"];
        }
    },

    setCurrentUser: function(username_, password_ = "") {
        if (username_ === "") {
            localStorage.setItem("Current User", "");
            return;
        }

        const user = this.getUser(username_);
        if (!user) {
            return this.code["ERROR_NOT_FOUND"];
        }
        if (password_ !== user.password) {
            return this.code["ERROR_USER_DATA"];
        }
        localStorage.setItem("Current User", JSON.stringify(username_));
        return this.code["SUCCESS"];
    },

    getMeetingsDetails: function(convert = false) {
        const user = this.getCurrentUser(true);
        if (convert) {
            let str = '';
            for (let mtg in user.meetings) {
                str += meetingToHTMLString(mtg);
            }
            return str;
        } else {
            return user.meetings;
        }
    },

    //לסיים
    addMeeting: function() {
        return;
    },

    getContacts: function(convert = false) {
        const user = this.getCurrentUser(true);
        if (convert) {
            let str = '';
            for (let contact in user.contacts) {
                str += contactToHTMLString(contact);
            }
            return str;
        } else {
            return user.contacts;
        }
    }
}

const app = {
    init: function() {
        localStorage.setItem("Current User", "");
        //localStorage.setItem("Users", "[]");
        localStorage.setItem("Users", JSON.stringify([new User("a", "a", "a", "a")]));
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
            const response = server.setCurrentUser(username_, password_);

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

            const newuser = new User(firstname_, lastname_, username_, password_)
            const response = server.addUser(newuser, confirmPassword);

            if (response === server.code["ERROR_DATA_EXISTS"]) {
                alert('Username is taken, please choose a different username');
                return;
            }
            if (response === server.code["ERROR_USER_DATA"]) {
                alert('Passwords do not match');
                return;
            }
            if (response === server.code["SUCCESS"]) {
                this.login();
            }

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