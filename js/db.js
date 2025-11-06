import { log } from './utils.js';

const DB_NAME = 'DashboardDB';
const DB_VERSION = 4;
const PROMPTS_STORE_NAME = 'promptsStore';
const STORE_NAME = 'settings';
const FAVICONS_STORE_NAME = 'faviconsStore';
let db;

/**
 * Menginisialisasi dan membuka koneksi ke database IndexedDB.
 * Membuat object store jika belum ada.
 * @returns {Promise<IDBDatabase>} Promise yang resolve dengan instance database.
 */
export function initDB() {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            log('error', 'log.error.db.generic', {}, event.target.error);
            reject('Error opening database');
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const tempDb = event.target.result;
            if (!tempDb.objectStoreNames.contains(STORE_NAME)) {
                tempDb.createObjectStore(STORE_NAME, { keyPath: 'key' });
            }
            if (!tempDb.objectStoreNames.contains(PROMPTS_STORE_NAME)) {
                tempDb.createObjectStore(PROMPTS_STORE_NAME, { keyPath: 'id' });
            }
            if (!tempDb.objectStoreNames.contains(FAVICONS_STORE_NAME)) {
                tempDb.createObjectStore(FAVICONS_STORE_NAME, { keyPath: 'domain' });
            }
            if (tempDb.objectStoreNames.contains('faviconsStore')) {
                tempDb.deleteObjectStore('faviconsStore');
            }
        };
    });
}

/**
 * Menyimpan satu item data (key-value pair) ke IndexedDB.
 * @param {string} key - Kunci dari data yang akan disimpan.
 * @param {any} value - Nilai dari data yang akan disimpan.
 * @returns {Promise<void>}
 */
export async function setItem(key, value) {
    const dbInstance = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = dbInstance.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put({ key, value });

        request.onsuccess = () => resolve();
        request.onerror = (event) => {
            log('error', 'log.error.db.saveItem', { key: key }, event.target.error);
            reject(event.target.error);
        };
    });
}

/**
 * Mengambil satu atau beberapa item dari IndexedDB berdasarkan kunci.
 * @param {string[]} keys - Array berisi kunci yang ingin diambil datanya.
 * @returns {Promise<Object>} Object yang berisi pasangan key-value yang ditemukan.
 */
export async function getItems(keys) {
    const dbInstance = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = dbInstance.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const result = {};

        const promises = keys.map(key => {
            return new Promise((resolveItem, rejectItem) => {
                const request = store.get(key);
                request.onsuccess = () => {
                    if (request.result) {
                        result[key] = request.result.value;
                    }
                    resolveItem();
                };
                request.onerror = (event) => {
                    log('error', 'log.error.db.getItem', { key: key }, event.target.error);
                    rejectItem(event.target.error);
                }
            });
        });
        
        Promise.all(promises)
            .then(() => resolve(result))
            .catch(error => reject(error));
    });
}

/**
 * Menyimpan atau memperbarui satu prompt di promptsStore.
 * @param {object} promptData - Objek prompt lengkap termasuk semua Blob.
 * @returns {Promise<void>}
 */
export async function savePrompt(promptData) {
    const dbInstance = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = dbInstance.transaction(PROMPTS_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(PROMPTS_STORE_NAME);
        const request = store.put(promptData);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
    });
}

/**
 * Mengambil semua data prompt TANPA blob (hanya metadata).
 * @returns {Promise<object[]>} Array objek prompt yang hanya berisi metadata.
 */
export async function getAllPromptMetadata() {
    const dbInstance = await initDB();
    const prompts = [];
    return new Promise((resolve, reject) => {
        const transaction = dbInstance.transaction(PROMPTS_STORE_NAME, 'readonly');
        const store = transaction.objectStore(PROMPTS_STORE_NAME);
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = event => {
            const cursor = event.target.result;
            if (cursor) {
                const { imageBlobOriginal, imageBlobViewer, imageBlobThumbnail, imageBlobIcon, ...metadata } = cursor.value;
                prompts.push(metadata);
                cursor.continue();
            } else {
                resolve(prompts);
            }
        };
        cursorRequest.onerror = event => reject(event.target.error);
    });
}

/**
 * Mengambil Blob spesifik untuk satu prompt.
 * @param {number} promptId - ID dari prompt.
 * @param {'imageBlobThumbnail' | 'imageBlobViewer' | 'imageBlobOriginal'} blobType
 * @returns {Promise<Blob|null>}
 */
export async function getPromptBlob(promptId, blobType) {
    const dbInstance = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = dbInstance.transaction(PROMPTS_STORE_NAME, 'readonly');
        const store = transaction.objectStore(PROMPTS_STORE_NAME);
        const request = store.get(promptId);
        request.onsuccess = () => {
            if (request.result && request.result[blobType]) {
                resolve(request.result[blobType]);
            } else {
                resolve(null);
            }
        };
        request.onerror = (event) => reject(event.target.error);
    });
}

/**
 * Menghapus satu prompt dari database.
 * @param {number} promptId - ID dari prompt yang akan dihapus.
 * @returns {Promise<void>}
 */
export async function deletePromptFromDB(promptId) {
    const dbInstance = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = dbInstance.transaction(PROMPTS_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(PROMPTS_STORE_NAME);
        const request = store.delete(promptId);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
    });
}

/**
 * Mengambil satu objek prompt lengkap (termasuk semua blob) dari database.
 * @param {number} promptId - ID dari prompt yang akan diambil.
 * @returns {Promise<object|null>}
 */
export async function getFullPrompt(promptId) {
    const dbInstance = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = dbInstance.transaction(PROMPTS_STORE_NAME, 'readonly');
        const store = transaction.objectStore(PROMPTS_STORE_NAME);
        const request = store.get(promptId);
        request.onsuccess = () => {
            resolve(request.result || null);
        };
        request.onerror = (event) => reject(event.target.error);
    });
}

/**
 * Menghapus semua data dari object store tertentu.
 * @param {string} storeName - Nama object store yang akan dibersihkan.
 * @returns {Promise<void>}
 */
export async function clearStore(storeName) {
    const dbInstance = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = dbInstance.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = (event) => {
            log('error', 'log.error.db.clearStore', { storeName: storeName }, event.target.error);
            reject(event.target.error);
        };
    });
}