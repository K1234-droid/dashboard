import { setItem, getItems, savePrompt as savePromptToDB, getAllPromptMetadata as getAllPromptMetadataFromDB,
        getPromptBlob as getPromptBlobFromDB, deletePromptFromDB, getFullPrompt as getFullPromptFromDB, clearStore, initDB } from './db.js';
import { log } from './utils.js';    

const PROMPT_BLOB_CACHE_NAME = 'prompt-blob-cache';
const FAVICON_CACHE_NAME = 'favicon-cache';
const WALLPAPER_CACHE_NAME = 'wallpaper-cache';
const STORE_NAME = 'settings';
const PROMPTS_STORE_NAME = 'promptsStore';

/**
 * Membersihkan semua cache sementara (yang tidak esensial untuk tampilan awal)
 * dari prompt-blob-cache saat halaman dimuat.
 * Ini menggunakan pendekatan "whitelist" untuk menjaga cache utama.
 * @returns {Promise<void>}
 */
export async function clearTemporaryCacheOnLoad() {
    if (!('caches' in window)) return;

    const permanentCacheTypes = [
        'imageBlobThumbnail',
        'imageBlobIcon'
    ];

    try {
        const cache = await caches.open(PROMPT_BLOB_CACHE_NAME);
        const requests = await cache.keys();

        const deletePromises = requests.map(request => {
            const isPermanent = permanentCacheTypes.some(type => request.url.includes(type));

            if (!isPermanent) {
                return cache.delete(request);
            }
            return Promise.resolve();
        });

        await Promise.all(deletePromises);
        log('info', 'log.info.viewerCacheCleared');
    } catch (error) {
        log('error', 'log.error.failedToClearViewerCache', {}, error);
    }
}

/**
 * Mengambil Blob dari Cache API.
 * @param {number} promptId - ID dari prompt.
 * @param {'imageBlobThumbnail' | 'imageBlobViewer' | 'imageBlobIcon'} blobType
 * @returns {Promise<Blob|null>}
 */
async function getBlobFromCache(promptId, blobType) {
    if (!('caches' in window)) return null;

    const cacheKey = `${promptId}-${blobType}`;
    const dummyUrl = `https://dummy-cache-key.local/${cacheKey}`; 
    
    try {
        const cache = await caches.open(PROMPT_BLOB_CACHE_NAME);
        const response = await cache.match(dummyUrl); 

        if (response) {
            return await response.blob();
        }
        return null;
    } catch (error) {
        log('error', 'log.error.getBlobFromCacheFailed', {}, error);
        return null;
    }
}

/**
 * Menyimpan Blob ke Cache API menggunakan URL dummy yang aman.
 * @param {number} promptId - ID dari prompt.
 * @param {'imageBlobThumbnail' | 'imageBlobViewer' | 'imageBlobIcon'} blobType
 * @param {Blob} blob - Blob yang akan disimpan.
 * @returns {Promise<void>}
 */
async function saveBlobToCache(promptId, blobType, blob) {
    if (!('caches' in window)) return;

    const cacheKey = `${promptId}-${blobType}`;
    
    const dummyUrl = `https://dummy-cache-key.local/${cacheKey}`;

    try {
        const cache = await caches.open(PROMPT_BLOB_CACHE_NAME);
        
        // 1. Buat Response dari Blob
        const response = new Response(blob, {
            status: 200,
            statusText: 'OK',
            headers: { 
                'Content-Type': blob.type || 'application/octet-stream',
                'X-Content-Type-Options': 'nosniff'
            }
        });

        await cache.put(dummyUrl, response);

    } catch (error) {
        log('error', 'log.error.saveBlobToCacheFailed', {}, error);
    }
}

/**
 * Menghapus Blob dari Cache API.
 * @param {number} promptId - ID dari prompt.
 * @param {'imageBlobThumbnail' | 'imageBlobViewer' | 'imageBlobIcon' | 'all'} blobType
 * @returns {Promise<void>}
 */
async function deleteBlobFromCache(promptId, blobType = 'all') {
    if (!('caches' in window)) return;

    try {
        const cache = await caches.open(PROMPT_BLOB_CACHE_NAME);
        const typesToDelete = blobType === 'all'
            ? ['imageBlobThumbnail', 'imageBlobViewer', 'imageBlobIcon']
            : [blobType];

        await Promise.all(typesToDelete.map(type => {
            const cacheKey = `${promptId}-${type}`;
            const dummyUrl = `https://dummy-cache-key.local/${cacheKey}`;
            return cache.delete(dummyUrl);
        }));
    } catch (error) {
        log('error', 'log.error.deleteBlobFromCacheFailed', {}, error);
    }
}

/**
 * Menghapus SATU jenis Blob spesifik dari Cache API untuk sebuah prompt.
 * @param {number} promptId - ID dari prompt.
 * @param {'imageBlobThumbnail' | 'imageBlobViewer' | 'imageBlobIcon'} blobType
 * @returns {Promise<void>}
 */
export async function deletePromptBlobFromCache(promptId, blobType) {
    if (!('caches' in window)) return;

    try {
        const cache = await caches.open(PROMPT_BLOB_CACHE_NAME);
        const cacheKey = `${promptId}-${blobType}`;
        const dummyUrl = `https://dummy-cache-key.local/${cacheKey}`;
        await cache.delete(dummyUrl);
    } catch (error) {
        log('error', 'log.error.deleteTypedBlobFailed', { blobType: blobType }, error);
    }
}

/**
 * Menghapus SEMUA Blob yang terkait dengan prompt dari cache.
 * Dipanggil saat menghapus sebuah prompt.
 * @param {number} promptId - ID dari prompt yang dihapus.
 * @returns {Promise<void>}
 */
export async function deletePromptCache(promptId) {
    return deleteBlobFromCache(promptId, 'all');
}

/**
 * Menyimpan sebuah pengaturan ke IndexedDB.
 * @param {string} key - Kunci pengaturan (e.g., 'username').
 * @param {any} value - Nilai pengaturan.
 * @returns {Promise<void>}
 */
export async function saveSetting(key, value) {
    return setItem(key, value);
}

/**
 * Memuat beberapa pengaturan dari IndexedDB.
 * @param {string[]} keys - Array kunci pengaturan yang ingin dimuat.
 * @returns {Promise<Object>} Sebuah promise yang resolve dengan objek pengaturan.
 */
export async function loadSettings(keys) {
    return getItems(keys);
}

export async function savePrompt(promptData) {
    return savePromptToDB(promptData);
}

export async function getAllPromptMetadata() {
    return getAllPromptMetadataFromDB();
}

/**
 * Mengambil Blob spesifik untuk satu prompt, dengan prioritas Cache API.
 * @param {number} promptId - ID dari prompt.
 * @param {'imageBlobThumbnail' | 'imageBlobViewer' | 'imageBlobIcon'} blobType
 * @param {boolean} forceRefresh - Jika true, akan memaksa pengambilan dari IndexedDB.
 * @returns {Promise<Blob|null>}
 */
export async function getPromptBlob(promptId, blobType, forceRefresh = false) {
    if (!forceRefresh) {
        const cachedBlob = await getBlobFromCache(promptId, blobType);
        if (cachedBlob) {
            return cachedBlob;
        }
    }

    const dbBlob = await getPromptBlobFromDB(promptId, blobType);
    if (dbBlob) {
        await saveBlobToCache(promptId, blobType, dbBlob);
    }
    return dbBlob;
}

export async function deletePromptDB(promptId) {
    await deletePromptCache(promptId);
    return deletePromptFromDB(promptId); 
}

export async function getFullPrompt(promptId) {
    return getFullPromptFromDB(promptId);
}

/**
 * Menyimpan blob favicon ke Cache API.
 * @param {string} domain - Domain URL sebagai kunci.
 * @param {Blob} blob - Blob gambar favicon.
 */
export async function saveFaviconToCache(domain, blob) {
    if (!('caches' in window)) return;
    const dummyUrl = `https://dummy-favicon.local/${domain}`;
    try {
        const cache = await caches.open(FAVICON_CACHE_NAME);
        const response = new Response(blob, {
            status: 200,
            headers: { 'Content-Type': blob.type || 'application/octet-stream' }
        });
        await cache.put(dummyUrl, response);
    } catch (error) {
        log('error', 'log.error.saveFaviconFailed', {}, error);
    }
}

/**
 * Mengambil blob favicon dari Cache API.
 * @param {string} domain - Domain URL.
 * @returns {Promise<Blob|null>}
 */
export async function getFaviconFromCache(domain) {
    if (!('caches' in window)) return null;
    const dummyUrl = `https://dummy-favicon.local/${domain}`;
    try {
        const cache = await caches.open(FAVICON_CACHE_NAME);
        const response = await cache.match(dummyUrl);
        return response ? await response.blob() : null;
    } catch (error) {
        log('error', 'log.error.getFaviconFailed', {}, error);
        return null;
    }
}

/**
 * Menghapus blob favicon dari Cache API.
 * @param {string} domain - Domain URL.
 */
export async function deleteFaviconFromCache(domain) {
    if (!('caches' in window)) return;
    const dummyUrl = `https://dummy-favicon.local/${domain}`;
    try {
        const cache = await caches.open(FAVICON_CACHE_NAME);
        await cache.delete(dummyUrl);
    } catch (error) {
        log('error', 'log.error.deleteFaviconFailed', {}, error);
    }
}

/**
 * Alias untuk loadSettings untuk kompatibilitas dengan impor di file lain.
 * @param {string[]} keys - Array dari kunci pengaturan yang ingin diambil.
 * @returns {Promise<Object>} Sebuah promise yang resolve dengan objek pengaturan.
 */
export async function getAllSettings(keys) {
    return loadSettings(keys);
}

/**
 * Menghapus semua prompt dari IndexedDB.
 * @returns {Promise<void>}
 */
export async function deleteAllPrompts() {
    try {
        const allMetadata = await getAllPromptMetadata();
        const deletePromises = allMetadata.map(meta => deletePromptDB(meta.id));
        await Promise.all(deletePromises);
        
        await clearPromptBlobCache(); 
        
        log('info', 'log.info.allPromptsDeleted');
    } catch (error) {
        log('error', 'log.error.deleteAllPromptsFailed', {}, error);
        throw error;
    }
}

/**
 * Menghapus seluruh Cache Storage untuk Blob Prompt.
 * @returns {Promise<void>}
 */
export async function clearPromptBlobCache() {
    if (!('caches' in window)) return;

    try {
        await caches.delete(PROMPT_BLOB_CACHE_NAME);
        log('info', 'log.info.cacheStorageDeleted', { cacheName: PROMPT_BLOB_CACHE_NAME });
    } catch (error) {
        log('error', 'log.error.deleteCacheStorageFailed', {}, error);
    }
}

/**
 * Menghapus seluruh Cache Storage untuk Favicon.
 * @returns {Promise<void>}
 */
export async function clearFaviconCache() {
    if (!('caches' in window)) return;
    try {
        await caches.delete(FAVICON_CACHE_NAME);
        log('info', 'log.info.cacheStorageDeleted', { cacheName: FAVICON_CACHE_NAME });
    } catch (error) {
        log('error', 'log.error.deleteFaviconCacheFailed', {}, error);
    }
}

/**
 * Menghitung total ukuran blob dalam sebuah Cache Storage.
 * @param {string} cacheName - Nama cache yang akan dihitung.
 * @returns {Promise<number>} - Ukuran total dalam bytes.
 */
export async function calculateCacheSize(cacheName) {
    if (!('caches' in window)) return 0;
    try {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        if (requests.length === 0) return 0;

        const responses = await Promise.all(requests.map(req => cache.match(req)));
        const blobs = await Promise.all(responses.map(res => res ? res.blob() : null));
        
        return blobs.reduce((total, blob) => total + (blob ? blob.size : 0), 0);
    } catch (error) {
        log('error', 'log.error.calculateCacheSizeFailed', { cacheName: cacheName }, error);
        return 0;
    }
}

export async function calculateStoreSize(storeName, keyList = null) {
    const dbInstance = await initDB();
    return new Promise((resolve) => {
        let totalSize = 0;
        const transaction = dbInstance.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const onCursor = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const item = cursor.value;
                if (!keyList || keyList.includes(item.key)) {
                    totalSize += new TextEncoder().encode(JSON.stringify(item)).length;
                }
                cursor.continue();
            }
        };
        const cursorRequest = store.openCursor();
        cursorRequest.onsuccess = onCursor;
        transaction.oncomplete = () => resolve(totalSize);
        transaction.onerror = () => resolve(0);
    });
}

/**
 * Menghapus sebuah Cache Storage secara keseluruhan.
 * @param {string} cacheName - Nama cache yang akan dihapus.
 * @returns {Promise<void>}
 */
export async function clearCache(cacheName) {
    try {
        const result = await caches.delete(cacheName);
        if (result) {
            log('info', 'log.info.cacheDeleted', { cacheName: cacheName });
        } else {
            log('info', 'log.info.cacheNotFound', { cacheName: cacheName });
        }
    } catch (error) {
        log('error', 'log.error.clearCacheFailed', { cacheName: cacheName }, error);
    }
}

/**
 * Menghapus semua data pengguna (pengaturan, bookmark) dari IndexedDB.
 * @returns {Promise<void>}
 */
export async function clearUserData() {
    const userKeysToDelete = [
        "username", "theme", "showSeconds", "menuBlur", "footerBlur", "languageSettings",
        "enableAnimation", "showContent", "showGreeting", "showDescription", "showDate", "showTime", "showUsername",
        "bookmarks", "showBookmark", "bookmarkBlur", "enableSearchBar", "bookmarkOpenAction",
        "searchEngine", "searchOpenAction", "enableHistorySearch", "enableBookmarkSearch",
        "enableBookmarkPopupFinder", "enableShortcutCtrlD", "lastKnownBookmarkSearchState", "lastKnownBookmarkPopupState",
        "colorScheme", "customBackground", "customThemeOverrides"
    ];

    try {
        const dbInstance = await initDB();
        const transaction = dbInstance.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const deletePromises = userKeysToDelete.map(key => {
            return new Promise((resolve, reject) => {
                const request = store.delete(key);
                request.onsuccess = resolve;
                request.onerror = reject;
            });
        });
        await Promise.all(deletePromises);
        await clearWallpaperCache();
        await clearFaviconCache();
        log('info', 'log.info.userDataCleared');
    } catch (error) {
        log('error', 'log.error.clearUserDataFailed', {}, error);
        throw error;
    }
}

/**
 * Menghapus semua data fitur tersembunyi (prompt, PIN) dari IndexedDB.
 * @returns {Promise<void>}
 */
export async function clearHiddenData() {
    try {
        await deleteAllPrompts();
        const hiddenKeysToDelete = [
            "userPIN",
            "advancedPIN",
            "advancedPrompts",
            "promptOrder",
            "enablePopupFinder",
            "enablePromptSearch"
        ];
        const dbInstance = await initDB();
        const transaction = dbInstance.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const deletePromises = hiddenKeysToDelete.map(key => {
            return new Promise((resolve, reject) => {
                const request = store.delete(key);
                request.onsuccess = resolve;
                request.onerror = reject;
            });
        });
        await Promise.all(deletePromises);
        log('info', 'log.info.hiddenDataCleared');
    } catch (error) {
        log('error', 'log.error.clearHiddenDataFailed', {}, error);
        throw error;
    }
}

/**
 * Menyimpan blob wallpaper ke Cache API.
 * @param {Blob} blob - Blob gambar wallpaper.
 */
export async function saveWallpaperToCache(blob) {
    if (!('caches' in window)) return;

    const wallpaperCacheKey = `https://dummy-wallpaper.local/custom-background`;
    
    try {
        await clearWallpaperCache(); 
        const cache = await caches.open(WALLPAPER_CACHE_NAME);
        const response = new Response(blob, {
            status: 200,
            headers: { 'Content-Type': blob.type || 'image/png' }
        });
        
        await cache.put(wallpaperCacheKey, response);
    } catch (error) {
        log('error', 'log.error.saveWallpaperFailed', {}, error);
        throw error;
    }
}

/**
 * Mengambil blob wallpaper dari Cache API.
 * @returns {Promise<Blob|null>}
 */
export async function getWallpaperFromCache() {
    if (!('caches' in window)) return null;
    const wallpaperCacheKey = `https://dummy-wallpaper.local/custom-background`;
    try {
        const cache = await caches.open(WALLPAPER_CACHE_NAME);
        const response = await cache.match(wallpaperCacheKey);
        return response ? await response.blob() : null;
    } catch (error) {
        log('error', 'log.error.takeWallpaperFailed', {}, error);
        return null;
    }
}

export async function clearWallpaperCache() {
    if (!('caches' in window)) return;
    try {
        await caches.delete(WALLPAPER_CACHE_NAME);
    } catch (error) {
        log('error', 'log.error.deleteWallpaperFailed', {}, error);
    }
}