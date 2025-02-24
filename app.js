//------ COOKIE HELPER FUNCTIONS ------

function setCookie(name, value, duration) {
    const expires_ = new Date();
    expires_.setHours(expires_.getHours() + duration);

    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires_.toUTCString()}; path=/`;
}

function getCookie(name_) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === name_) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=${(new Date(0)).toUTCString()}; path=/`;
}

//------ END OF COOKIE HELPER FUNCTIONS ------

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
        let LoggedIn = getCookie('LoggedIn');

        if (!LoggedIn) {

            setCookie('navBar', 'false', 2);
            this.login();
        } else {
            this.meetingsPage();
        }
    },

    show: function(templateId) {
        let pgToRemove = document.querySelectorAll('.showing');
        pgToRemove.forEach(pg => document.body.removeChild(pg));

        let template = document.getElementById(templateId);
        let templateContent = template.content.cloneNode(true);

        let div_ = document.createElement('div');
        div_.classList.add('showing');
        div_.appendChild(templateContent);

        //Fixes bugs with the nav bar
        let NavBar = getCookie('navBar') === 'true';

        if (templateId !== 'login' && templateId !== 'register' && !NavBar) {
            
            let nav_bar = document.getElementById('nav-bar');
            let nav_bar_content = nav_bar.content.cloneNode(true);
            let nav_bar_div = document.getElementById('flex-container');
            nav_bar_div.classList.add('show-nav-bar');
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

            setCookie('navBar', 'true', 2);

        } else if (NavBar && (templateId === 'login' || templateId === 'register')) {
            let removeNavBar = document.querySelectorAll('.show-nav-bar');
            removeNavBar.forEach(x => x.replaceChildren());
            setCookie('navBar', 'false', 2);
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

            //Now done with FXMLHttpRequest
            let response_;
            const fxhr = new FXMLHttpRequest.FXMLHttpRequest();
            fxhr.open("GET", "users");
            fxhr.send(username_);

            fxhr.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    response_ = JSON.parse(this.response);
                    
                    if (response_ !== password_) {
                        alert('Password is Incorrect');
                        return;
                    } 
                    
                    setCookie('LoggedIn', username_, 2);
                    alert('Log In Successful');
                    app.meetingsPage();
                } else if (this.status === 404) {
                    alert('User Not Found');
                    return;
                }
            };
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

            if (password_ !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            const newuser = new User(firstname_, lastname_, username_, password_);

            //Now uses FXMLHttpRequest
            const fxhr = new FXMLHttpRequest.FXMLHttpRequest();
            fxhr.open("POST", "users");
            fxhr.send(newuser);

            fxhr.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status === 402) {
                        alert('Username is taken, please choose a different username');
                        return;
                    }
                    if (this.status === 200) {
                        app.login();
                    }
                }
            };

        });
    },

    logout: function() {
        deleteCookie('LoggedIn');
        this.login();
    },

    meetingsPage: function() {
        this.show('meetings');

        //Now done with FXMLHttpRequest
        const fxhr = new FXMLHttpRequest.FXMLHttpRequest();
        fxhr.open("GET", "meetings");
        fxhr.send();

        fxhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let response_ = JSON.parse(this.response);
                let meetingDetails = response_.reduce(
                    (str, meeting) => str + meetingToHTMLString(meeting),
                     '');
                document.querySelector('ol').innerHTML = meetingDetails;
            }
        };
    },

    contactsPage: function() {
        this.show('contacts');
        
        //Now done with FXMLHttpRequest
        const fxhr = new FXMLHttpRequest.FXMLHttpRequest();
        fxhr.open("GET", "contacts");
        fxhr.send();

        fxhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let response_ = JSON.parse(this.response);
                let userContacts = response_.reduce(
                    (str, contact) => str + meetingToHTMLString(contact),
                     '');
                document.querySelector('tbody').innerHTML = userContacts;
            }
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});