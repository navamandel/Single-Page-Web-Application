/**
 * Loads the user profile page and fetches user details
 */
function loadUserPage() {
    initializePage("user");

    // Retrieve current user
    let currentUser;
    const fxhr = new FXMLHttpRequest();
    fxhr.open("GET", "currentUser");
    fxhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            currentUser = JSON.parse(this.response);
            console.log("Loaded User Profile: ", currentUser);

            // Populate form with current user data
            document.getElementById("username").value = currentUser.username;
            document.getElementById("firstname").value = currentUser.firstname;
            document.getElementById("lastname").value = currentUser.lastname;
        }
    };
    fxhr.send(null, fxhr.onreadystatechange);

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

    const updatedUser = {
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value
    };

    const fxhr = new FXMLHttpRequest();
    fxhr.open("PUT", "users");
    fxhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            alert("Profile updated successfully!");
        } else {
            alert("Failed to update profile. Please try again.");
        }
    };
    fxhr.send(JSON.stringify(updatedUser), fxhr.onreadystatechange);
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
            fxhr.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    alert("Account deleted successfully.");
                    loadLoginPage(); // Redirect to login page
                } else {
                    alert("Failed to delete account. Please try again.");
                }
            };
            fxhr.send(null, fxhr.onreadystatechange);
        }
    );
}

