/*
    i. Interact with the browser's localStorage API in easy-to-use functions
    ii. Popsicle
    iii. Ethan Cha, Peyton Elebash, Haley Figone, Yaya Yao
*/

/**
 * Saves data to localStorage under key. 
 * @param key The key in localStorage the data will be stored under
 * @param data The data to store in key
 */
export function saveToLocalStorage(key: string, data: string): void {
    try {
        const jsonString = JSON.stringify(data);
        localStorage.setItem(key, jsonString);
    } catch (error) {
        console.error("Error saving to localStorage:", error);
    }
}

/**
 * Retrieves the array of objects from localStorage as a string
 * @param key The key to read from localStorage
 * @returns The string stored in key
 * @returns An empty string and logs a warning if key is not found or is empty
 */
export function getLocalStorage(key: string): string {
    try {
        const jsonString = localStorage.getItem(key);
        if (jsonString) {
            return JSON.parse(jsonString) as string;
        }
    } catch (error) {
        console.warn(`localStorage key ${key} is empty.`);
    }
    return "";
}