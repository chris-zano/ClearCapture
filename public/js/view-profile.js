if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main())
else main()

function main() {
    const url = new URL(window.location.href);
    const id = url.pathname.split('/').pop();
    const userId = JSON.parse(getLocalStorage("loginState")).userId;
    const userDetails = JSON.parse(getLocalStorage("current-user"))

    if (!userDetails) {
        fetchUserData(`/admin/get/userById/${userId}`)
            .then(response => {
                //update the credentials
                const userDetails = response.document;
                setLocalStorage("current-user", JSON.stringify(userDetails));

                setUserdata(userDetails)
            })
            .catch(error => {
                console.log(error);
            })

    }
    else {
        setUserdata(userDetails)
    }

    fetchUserData(`/admin/get/userById/${id}`)
        .then(response => {
            //update the credentials
            const userDet = response.document;
            console.log(userDet);
            setUserProfilePageData(userDet)

        })
        .catch(error => {
            console.log(error);
        })

        document.getElementById("message-user").addEventListener("click", (e) => {
            window.open(userDetails.whatsapp, "_blank")
        })
}

async function fetchUserData(url) {
    try {
        const req = await fetch(url);
        const res = await req.json();

        return res;
    }
    catch (error) {
        console.log(error);
    }
}

function setUserdata(data) {
    document.getElementById("current_user-image").setAttribute("src", data.profilePicUrl);
    document.getElementById("current_user-name").innerText = `${data.firstname} ${data.lastname}`;
    document.getElementById("title-header").innerText = `${data.firstname} ${data.lastname}`;
}

function setUserProfilePageData(data) {
    document.getElementById("banner-image").setAttribute("src", data.profilePicUrl);
    document.getElementById("user-profile-img").setAttribute("src", data.profilePicUrl);
    document.getElementById("creator-name").innerText = `${data.firstname} ${data.lastname}`;

    getId("facebook_url").setAttribute("href", data.facebook);
    getId("instagram_url").setAttribute("href", data.instagram);
    getId("tiktok_url").setAttribute("href", data.tiktok);
    getId("twitter_url").setAttribute("href", data.twitter);
    getId("whatsapp_url").setAttribute("href", data.whatsapp);
    getId("youtube_url").setAttribute("href", data.youtube);
}

