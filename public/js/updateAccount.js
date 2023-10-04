if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main)
else main()

const userId = JSON.parse(getLocalStorage("loginState")).userId;
const vpstatus = JSON.parse(getLocalStorage("vp-status")).status;
function main() {
    //hide all cards except default
    hideProfileCards("default");
    document.getElementById("profilePic_form").setAttribute("action", `/admin/update/ppic/${userId}`);

    //set default values and export
    callDefaultUservalues()

    for (let element of document.getElementsByTagName("form")) {
        let id = getattribute(element, "id")
        switch (id) {
            case "firstname_form":
                element.addEventListener("submit", (e) => {
                    e.preventDefault()
                    updateFirstAndLastName()
                });
                break;
            case "genderDob":
                element.addEventListener("submit", (e) => {
                    e.preventDefault()
                    updateDOBAndGender()
                });
                break;
            case "usernameForm":
                element.addEventListener("submit", (e) => {
                    e.preventDefault()
                    updateUsername()
                });
                break;
            case "socials_form":
                element.addEventListener("submit", (e) => {
                    e.preventDefault()
                    updateSocials()
                });
            default:
                // element.submit()
                break;
        }

    }


}

function callDefaultUservalues() {
    if (getLocalStorage("current-user")) {
        const user = JSON.parse(getLocalStorage("current-user"));

        setattribute(getId("firstname"), "value", user.firstname)
        setattribute(getId("lastname"), "value", user.lastname)
        setattribute(getId("username"), "value", user.username)
        setattribute(getId("instagram"), "value", user.instagram)
        setattribute(getId("twitter"), "value", user.twitter)
        setattribute(getId("facebook"), "value", user.facebook)
        setattribute(getId("tiktok"), "value", user.tiktok)
        setattribute(getId("youtube"), "value", user.youtube)
        setattribute(getId("whatsapp"), "value", user.whatsapp)
        setattribute(getId("default_image"), "src", user.profilePicUrl)
    }
}

function hideProfileCards(id) {
    const cards = getClass("profile_item");
    if (vpstatus !== "edit") {
        for (let card of cards) {
            if (getattribute(card, "id") != id)
                card.classList.add("hidden");
            else {
                if (card.classList.contains("hidden"))
                    card.classList.remove("hidden");
            }
        }
    }
    else if (vpstatus == "edit") {
        getId("container_main").style.height = "unset";
        getId("dobgender").style.display = "none";
        getId("ppic").removeAttribute("required");
        for (let btn of getClass("next-btn")) {
            setattribute(btn, "value", "Save")
        }
        for (let element of document.getElementsByTagName("form")) {
            element.addEventListener("submit", (e) => {
                localStorage.removeItem("current-user")
                localStorage.removeItem("creatorsCollection")
                getId("toast_message").innerText = "Changes Saved"
                getId("toast_message").classList.remove("hidden")
                setTimeout(() => {
                    getId("toast_message").classList.add("hidden")
                }, 1_000)

            })
        }

        getId("final-next-btn").setAttribute("value", "Done")

        addeventlistener(getId("profilePic_form"), "submit", (e) => {
            if (!getId("ppic").value) {
                e.preventDefault();
                window.location.href = "/"
            }
        })
    }
}

async function postData(endpoint, bodyObj) {
    try {
        const req = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyObj)
        })

        const res = await req.json();

        return res
    } catch (error) {
        console.log(error);
    }
}

function updateFirstAndLastName() {
    const firstname = getId("firstname").value;
    const lastname = getId("lastname").value;

    postData("/admin/update/name", { userId: userId, firstname: firstname, lastname: lastname })
        .then(res => {
            console.log(res);
        })
        .catch(error => {
            console.log(error);
        })
    hideProfileCards("dobgender");
}

function updateDOBAndGender() {
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const dob = getId("dob").value;

    postData("/admin/update/gender", { userId: userId, gender: gender, dob: dob })
        .then(res => {
            console.log(res);
        })
        .catch(error => {
            console.log(error);
        })
    hideProfileCards("defusernmae")
}

function updateUsername() {
    const username = getId("username").value;

    postData("/admin/update/username", { userId: userId, username: username })
        .then(res => {
            console.log(res);
        })
        .catch(error => {
            console.log(error);
        })
    hideProfileCards("socials")
}

function updateSocials() {
    const instagram = getId("instagram").value;
    const twitter = getId("twitter").value;
    const facebook = getId("facebook").value;
    const tiktok = getId("tiktok").value;
    const youtube = getId("youtube").value;
    const whatsapp = getId("whatsapp").value;


    postData("/admin/update/socials", { userId: userId, instagram: instagram, twitter: twitter, facebook: facebook, tiktok: tiktok, youtube: youtube, whatsapp: whatsapp })
        .then(res => {
            console.log(res);
        })
        .catch(error => {
            console.log(error);
        })
    hideProfileCards("pictureprof")
}