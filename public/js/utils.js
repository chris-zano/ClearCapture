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