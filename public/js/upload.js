if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main())
else main()

function main() {
    addeventlistener(getId("collection"), "change", (e) => {
        const photos = e.target.files
        if (photos.length > 12) {
            alert("WARNING: maximum photos allowed is 12!");
            getId("upload_photos_form").reset()
        }
        else if (photos.length > 0 && photos.length <= 12) {
            setattribute(getId("upload_photos_form"), "action", "/admin/collection/upload")
        }
    })

    addeventlistener(getId("upload_photos_form"), "submit", async (e) => {
        e.preventDefault();
        if (getattribute(getId("upload_photos_form"), "action",) != "/admin/collection/upload") {
            console.log("no route has been set");
            e.preventDefault();
        }
        else {
            e.preventDefault();
            setattribute(getId("creatorId"), "value", JSON.parse(getLocalStorage("loginState")).userId);
            const formData = new FormData(getId("upload_photos_form"))

            try {
                const response = await fetch("/admin/collection/upload", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                // create shareable link / url
                console.log(data.collectionId);
                createShareLink(data.collectionId);

            } catch (error) {
                console.error(error);
                console.log("An error occurred.");
            }

            //TODO: let user view the photos which have been uploaded!!!
        }
    })
}

function createShareLink(id) {
    const url = new URL(`${(window.location.href).replace("upload", "download")}/${id}`)
    // setattribute(getId("shareurl"), "href", url);

    // Copy the URL to the clipboard
    navigator.clipboard.writeText(url.toString())
        .then(() => {
            console.log("URL copied to clipboard:", url.toString());
            // You can also display a success message or perform other actions here
        })
        .catch(err => {
            console.error("Error copying URL to clipboard:", err);
            // Handle errors here, e.g., show an error message to the user
        });

}