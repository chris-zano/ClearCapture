if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main)
else main()

function main() {
    const form = getId("formContact");
    addeventlistener(form, "submit", (e) => {
        e.preventDefault();

        const username = getId("username").value,
                email = getId("email").value,
                phone = getId("phone").value,
                message = getId("message").value;
        const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!emailRegExp.test(email)) {
            alert("Invalid email format! Email must be of the format\nemail@example.com");
        }
        else if(phone.length < 13) {
            alert("Phone number must be of international format")
        }
        else if (message.length < 50) {
             alert("Entetr a valid message !! Message too short");
        }
        else {
            //all inputs are valid
            postFeedbackMessage({username: username, email:email, phone:phone, message: message})
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            })
        }
    })
}

async function postFeedbackMessage(messageObject) {
    const req = await fetch("/admin/feedback/user",
    {
        method: "POST",
        headers: {
            "Content-Type" : 'application/json'
        },
        body: JSON.stringify(messageObject)
    }
    )

    const res = req.json();
}