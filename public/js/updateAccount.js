if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main)
else main()

function main() {
    //hide all cards except default
    hideProfileCards("default");

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
            default:
                break;
        }
        
    }

}

const userId = JSON.parse(getLocalStorage("loginState")).userId
document.getElementById("profilePic_userId").value = userId;


function hideProfileCards(id) {
    const cards = getClass("profile_item");
    for (let card of cards) {
        if (getattribute(card, "id") != id)
            card.classList.add("hidden");
        else 
            {
                if(card.classList.contains("hidden"))
                    card.classList.remove("hidden");
            }
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
    
    postData("/admin/update/name", {userId: userId, firstname: firstname, lastname: lastname})
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

    postData("/admin/update/gender", {userId: userId, gender: gender, dob: dob})
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
    
    postData("/admin/update/username", {userId: userId, username: username})
    .then(res => {
        console.log(res);
    })
    .catch(error => {
        console.log(error);
    })
    hideProfileCards("pictureprof")
}