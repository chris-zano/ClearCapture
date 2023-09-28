if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main())
else main()

function main() {
    document.getElementById("verify-emailForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;

        verfiyEmail(email)
            .then(response => {
                console.log(response.message, response.userId);
                localStorage.setItem("userId", JSON.stringify(response.userId));
                localStorage.setItem("email", JSON.stringify(email));
                document.getElementById("verify-code").style.display = "grid"
                document.getElementById("verify-emailForm").style.display = "none"
            })
            .catch(error => {
                console.error(error);
            })
    })

    document.getElementById("verify-code").addEventListener("submit", (e) => {
        e.preventDefault();
        const userId = JSON.parse(localStorage.getItem("userId"))
        if (userId) {
            const code = document.getElementById("code").value;

            verifyCode(code, JSON.parse(localStorage.getItem("email")))
                .then(response => {
                    console.log(response);
                    document.getElementById("password-form").style.display = "grid"
                    document.getElementById("verify-code").style.display = "none"
                })
                .catch(error => {
                    console.error(error)
                })
        }
    })

    document.getElementById("password-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const password = document.getElementById("password").value;

        resetpassword(JSON.parse(localStorage.getItem("userId")), JSON.parse(localStorage.getItem("email")), password)
            .then(response => {
                console.log(response);
                window.location.href = "/admin/redirect/login";
            })
            .catch(error => {
                console.log(error);
            })
    })
}

async function verfiyEmail(email) {
    try {
        const req = await fetch(`/admin/verify-email/${email}`)
        const res = await req.json();

        return res;
    }
    catch (error) {
        console.error(error);
    }
}

async function verifyCode(code, email) {
    try {
        const req = await fetch(`/admin/verify-code/${code}/${email}`);
        const res = await req.json()

        return res
    }
    catch (error) {
        console.log(error);
    }
}

async function resetpassword(userId, email, password) {
    try {
        const req = await fetch(`/admin/password-reset/${email}/${password}/${userId}`)
        const res = await req.json();

        return res;
    }
    catch (error) {
        console.log(error);
    }
}