if (!getId("login_form").classList.contains("hidden") && getId("signup_form").classList.contains("hidden")) {
    console.log("true there");
    addeventlistener(getId("loginForm"), "submit", (e) => {
        e.preventDefault()
        const username = getId("username").value;
        const password = getId("login_password").value;

        //authenticate username

        authWithUsernameANdPassword(username, password)
            .then(response => {
                if (response.error == true) {
                    toastErrorMessage(response.message);
                }
                else if (response.error == false && response.message == "success") {
                    console.log(response);
                    const expiration_date = Date.now() + 604_800
                    const authObj = {
                        isLoggedIn: true,
                        userId: response.userId,
                        expiration: expiration_date
                    }
                    localStorage.setItem("loginState", JSON.stringify(authObj));
                    localStorage.setItem("loginNotification", JSON.stringify({ count: 1 }));
                    window.location.href = "/";
                }
            })
            .catch(error => {
                toastErrorMessage(error.message);
            })
    })
}

addeventlistener(getId("signupForm"), "submit", (e) => {
    e.preventDefault();
    if (getId("login_form").classList.contains("hidden") && !getId("signup_form").classList.contains("hidden")) {
        const email = getId("email").value;
        const password = getId("signup_password").value;

        console.log({ email: email, password: password });

        createUserWithEmailAndPassword(email, password)
            .then(response => {
                if (response.error == false && response.message == "success") {
                    const expiration_date = Date.now() + 604_800
                    const authObj = {
                        isLoggedIn: true,
                        userId: response.userId,
                        expiration: expiration_date
                    };
                    localStorage.setItem("loginState", JSON.stringify(authObj));
                    localStorage.setItem("loginNotification", JSON.stringify({ count: 1 }));

                   window.location.href = "/admin/redirect/createUserProfile";
                }
                else {
                    toastErrorMessage("Email already in use");
                }
            })
            .catch(error => {
                toastErrorMessage("There was an error while creating your account!");
                throw new Error(error);
            })
    }

})


async function createUserWithEmailAndPassword(email, password) {
    try {
        const req = await fetch('/admin/userSignup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        const res = await req.json();

        return res;
    }
    catch (error) {
        console.log(error);
    }

}

async function authWithUsernameANdPassword(username, password) {
    try {
        const req = await fetch(`/admin/authUserName/${username}/${password}`);
        const res = await req.json();

        return res;
    }
    catch (error) {
        console.log(error);
    }
}

function toastErrorMessage(message) {
    getId("error_message_div").classList.remove("hidden");
    getId("error_message_div").textContent = message;
}