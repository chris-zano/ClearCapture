if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main())
else main()


function main() {
    const url = new URL(`${(window.location.href)}`)
    const collectionId = url.pathname.slice(25)

    document.getElementById("passform").addEventListener("submit", (e) => {
        e.preventDefault();

        const passkey = document.getElementById("passkey").value;

        authenticateCollectionPassKey(collectionId, passkey)
            .then(response => {
                const fileUrls = response;
                fileUrls.forEach((file => {
                    const anchor = document.createElement("a");
                    anchor.href = file.url;
                    anchor.download = `${file.originalname}`;
                    anchor.style.display = "none";
                    document.body.appendChild(anchor);
                    anchor.click();
                    document.body.removeChild(anchor);
                }))
            })
            .catch(error => {
                console.log(error);
            })
    })


}

async function authenticateCollectionPassKey(id, key) {
    try {
        const req = await fetch(`/admin/auth/collection-passkey/${id}/${key}`)
        const res = await req.json();

        return res.document
    }
    catch (error) {
        console.log(error);
    }
}