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
                    console.log(file.url)
                    console.log(file.type.slice(file.type.indexOf("/")))
                    const anchor = document.createElement("a");
                    anchor.href = file.url;
                    switch (file.type.slice(file.type.indexOf("/"))) {
                        case "/mp4":
                            anchor.download = `${file.url.slice(19)}.mp4`;
                            break;
                        case "/png":
                            anchor.download = `${file.url.slice(19)}.png`;
                            break;
                        case "/pdf":
                            anchor.download = `${file.url.slice(19)}.pdf`;
                            break;
                        case "/jpeg":
                            anchor.download = `${file.url.slice(19)}.jpeg`;
                            break;
                        default:
                            break;
                    }
                    anchor.style.display = "none";
                    document.body.appendChild(anchor);
                    console.log(anchor);
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