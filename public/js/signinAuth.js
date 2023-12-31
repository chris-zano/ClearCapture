if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main);
else main()

function main() {
    checkLoginState()
}


/**
 * checkLoginState - Authenticates the User before making subsequent request to the database
 * for restricted data, or app usage
 */
function checkLoginState() {
    //fetch login state from local storage
    const loginState = getLocalStorage("loginState");

    if (!loginState) {
        window.location.href = "/admin/redirect/login";
    }

    else {
        if (JSON.parse(loginState).isLoggedIn == true) {
            //if user is logged in, check if session has expired
            // expiration set to 7days after login
            const expiration_date = JSON.parse(loginState).expiration

            if (Date.now >= expiration_date) {
                removeLocalStorage("loginState");
                alert("Session Expired. Please Login again to continue");
                window.location.href = "admin/redirect/login";

            }
            else {

                const count = localStorage.getItem("loginNotification");

                if (count == null) {
                    return;
                }
                else {
                    if (JSON.parse(count).count == 1) {
                        window.Notification.requestPermission().then(permission => {
                            if (permission != 'granted')
                                return;

                            const notification = new Notification('Session Manager',
                                {
                                    body: "Login successful!!"
                                })
                        });
                        setLocalStorage("loginNotification", JSON.stringify({ count: 2 }));
                    }
                }

            }
        }
    }

    //add listener to the logout button
    try {
        const logoutBtn = document.getElementById("logoutBtn");
        logoutBtn.addEventListener("click", () => {
            listenOnLogout(JSON.parse(loginState).userId)
                .then(response => {
                    if (response.error == false && response.message == "User Logged Out Successfully") {

                        localStorage.clear();
                        localStorage.setItem("loginNotification", JSON.stringify({ count: 1 }));
                        alert("Session Expired. Please Login again to continue");
                        window.location.href = "/admin/redirect/login";
                    }
                })
        })
    } catch (error) {
        console.log(error);
    }

    //add listener to the profile button
    //  try {
    //      const profileBtn = document.getElementById("profileBtn");
    //      profileBtn.addEventListener("click", () => {
    //          getUserProfile(JSON.parse(loginState).userId)
    //              .then(response => {
    //                  if (response.error == false) {//the user has been autheticated
    //                      if(response.userId == JSON.parse(loginState).userId) {//check if id matches cached id
    //                          location.href = `/user/profile/${response.userId}`
    //                      }
    //                  }
    //              })
    //      })
    //  } catch (error) {
    //      location.href = `/error/${error}`;
    //  }
}

async function listenOnLogout(id) {
    try {
        const req = await fetch(`/userLogout/${id}`);
        const res = await req.json();

        return (res);
    } catch (error) {
        console.error(error);
    }
}