/**
 * fetches the user profile
 * @param {string} id 
 * @returns {object}
 */
async function getUserProfile(id) {
    try {
        const req = await fetch(`/get/profile/userbyId/${id}`);
        const res = await req.json();

        return (res);
    }
    catch (error) {
        location.href = `/error/${error}`;
    }
}

/**
 * simplification of element.addEventListener()
 * @param {HTMLElement} element 
 * @param {HTMLElementEventMap} event 
 * @param {CallableFunction} callback 
 */
function addeventlistener(element, event, callback) {
    element.addEventListener(event, callback)
}

/**
 * simplifies document.getElementById
 * @param {HTMLElement.id} id 
 * @returns {HTMLElement | undefined}
 */
function getId(id) {
    return document.getElementById(id);
}

/**
 * 
 * @param {HTMLElement.className} classname 
 * @returns {HTMLElement | undefined}
 */
function getClass(classname) {
    return document.getElementsByClassName(classname);
}

/**
 * get attribute of an element
 * @param {HTMLElement} element 
 * @param {HTMLElement.attribute} attribute 
 */
function getattribute(element, attribute) {
    return element.getAttribute(attribute);
}

/**
 * sets the attribute of an element
 * @param {HTMLElement} element
 * @param {HTMLElement.attributeKey} key
 * @param {HTMLElement.attributeValue} value
 */

function setattribute(element, key, value) {
    return element.setAttribute(key, value);
}

/**
 * simplifies localstorage.getItem
 * @param {WindowLocalStorage.key} key 
 */
function getLocalStorage(key) {
    return localStorage.getItem(key);
}

/**
 * simplifies localstorage.removeItem
 * @param {WindowLocalStorage.key} key 
 */
function removeLocalStorage(key) {
    localStorage.removeItem(key);
}

/**
 * simplifies localstorage.setItem
 * @param {WindowLocalStorage.key} key
 * @param {WindowLocalStorage.value} value
 */
function setLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

try {
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

    function setUserdata(data) {
        document.getElementById("current_user-image").setAttribute("src", data.profilePicUrl);
        document.getElementById("current_user-name").innerText = `${data.firstname} ${data.lastname}`;
        document.getElementById("title-header").innerText = `CCap ~ ${data.firstname} ${data.lastname}`;
    }
}
catch (error) {
    console.log(error);
}