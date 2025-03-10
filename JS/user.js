/**
 * Loads the user profile page and fetches user details
 */
function loadUserPage() {
    initializePage("user");
    updatePageTitle("My Info","here you can edit your user info")

    // Retrieve current user
    let currentUser;
    const fxhr = new FXMLHttpRequest();
    fxhr.open("GET", "currentUser");
    showLoader();
    fxhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            hideLoader();
            currentUser = JSON.parse(this.response);
            console.log("Loaded User Profile: ", currentUser);

            // Populate form with current user data
            document.getElementById("username").value = currentUser.username;
            document.getElementById("firstname").value = currentUser.firstname;
            document.getElementById("lastname").value = currentUser.lastname;
        }else if(this.readyState===4){
            hideLoader();
            showErrorMessage(this.status_text);
            loadUserPage();
        }
        
    };
    fxhr.send(null);

    // Toggle password section
    document.getElementById("toggle-password").addEventListener("click", function () {
        const passwordSection = document.getElementById("password-section");
        passwordSection.classList.toggle("hidden");
    });

    // Update profile event
    document.getElementById("update-profile").addEventListener("click", updateUserProfile);

    // Delete account event
    document.getElementById("delete-account").addEventListener("click", deleteUserAccount);
}

/**
 * Updates the user's profile details (excluding password)
 */
function updateUserProfile(event) {
    event.preventDefault();
    let updatedUser;
    
    if (document.getElementById("newpw")) {
        let newpassword = document.getElementById("newpw").value;
        let confirmpw = document.getElementById("confirmpw").value;
        if (newpassword !== confirmpw) {
            alert("Passwords must match!");
        } else {
            updatedUser = {
                firstname: document.getElementById("firstname").value,
                lastname: document.getElementById("lastname").value,
                password: newpassword
            };
        }
    } else {
        updatedUser = {
            firstname: document.getElementById("firstname").value,
            lastname: document.getElementById("lastname").value
        };
    }


    const fxhr = new FXMLHttpRequest();
    fxhr.open("PUT", "user");
    showLoader();
    fxhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            hideLoader();
            showCustomModal("Done","Profile updated successfully!")
        } else if (this.readyState === 4) {
            hideLoader();
            showErrorMessage("Failed to update profile. Please try again.")
        }
    };
    fxhr.send(JSON.stringify(updatedUser));
}

/**
 * Deletes the user's account after confirmation
 */
function deleteUserAccount(event) {
    event.preventDefault();

    showCustomModal(
        "Delete Account",
        "Are you sure you want to delete your account? This action cannot be undone.",
        function () {
            const fxhr = new FXMLHttpRequest();
            fxhr.open("DELETE", "users");
            showLoader();
            fxhr.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    hideLoader();
                    showCustomModal("Done","Account deleted successfully.")
                    loadLoginPage(); 
                } else if (this.readyState === 4) {
                    alert("Failed to delete account. Please try again.");
                }
            };
            fxhr.send();
        }
    );
}

