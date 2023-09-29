if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main())
else main()

function main() {
    const userId = JSON.parse(getLocalStorage("loginState")).userId;

    fetchUserData(`/admin/get/userById/${userId}`)
        .then(response => {
            //update the credentials
            const userDetails = response.document;
            setUserdata(userDetails);
            
        })
        .catch(error => {
            console.log(error);
        })

    //check cached user data for creators
    fetchUserData(`/admin/get/creators`)
        .then(response => {
            //update the credentials
            const creatorsCollection = response.document;
            for (let creator of creatorsCollection) {
                console.log(userId);
                if (creator._id !== userId) {
                    addCreatorcard(creator);
                }
            }
        })
        .catch(error => {
            console.log(error);
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

function addCreatorcard(data) {
    const card = document.createElement('div');
    card.classList.add('creator');
    card.setAttribute("id", data._id);

    card.innerHTML = `
        <a href="/admin/view-profile/${data._id}">
            <div class="creator-image"><img src="${data.profilePicUrl}" alt="creator image"></div>
            <div class="creator-name">
                <h3 class="name">${data.firstname} ${data.lastname}</h3>
                <small class="role">Photographer</small>
            </div>
            <div class="socials" id="socials">
                <ul>
                    <li>
                        <a href="${data.facebook}" id="facebook_url" target="_blank">
                            <img src="/socials/images/facebook" alt="facebook">
                        </a>
                    </li>
                    <li>
                        <a href="${data.instagram}" id="instagram_url" target="_blank">
                            <img src="/socials/images/instagram" alt="instagram">
                        </a>
                    </li>
                    <li>
                        <a href="${data.tiktok}" id="tiktok_url" target="_blank">
                            <img src="/socials/images/tiktok" alt="tiktok">
                        </a>
                    </li> 
                    <li>
                        <a href="${data.twitter}" id="twitter_url" target="_blank">
                            <img src="/socials/images/twitter" alt="twitter">
                        </a>
                    </li> 
                    <li>
                        <a href="${data.whatsapp}" id="whatsapp_url" target="_blank">
                            <img src="/socials/images/whatsapp" alt="whatsapp">
                        </a>
                    </li> 
                </ul>
            </div>
        </a>
    `;
    document.getElementById("creators").append(card);
}