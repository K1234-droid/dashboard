import { setItem, getItems, savePrompt as savePromptToDB, getAllPromptMetadata as getAllPromptMetadataFromDB,
        getPromptBlob as getPromptBlobFromDB, deletePromptFromDB, getFullPrompt as getFullPromptFromDB, clearStore, initDB } from './db.js';
import { log } from './utils.js';    

const PROMPT_BLOB_CACHE_NAME = 'prompt-blob-cache';
const FAVICON_CACHE_NAME = 'favicon-cache';
const WALLPAPER_CACHE_NAME = 'wallpaper-cache';
const STORE_NAME = 'settings';
const PROMPTS_STORE_NAME = 'promptsStore';

/**
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
 * @param {number} promptId
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
 * @param {number} promptId
 * @param {'imageBlobThumbnail' | 'imageBlobViewer' | 'imageBlobIcon'} blobType
 * @param {Blob} blob
 * @returns {Promise<void>}
 */
export async function saveBlobToCache(promptId, blobType, blob) {
    if (!('caches' in window)) return;

    const cacheKey = `${promptId}-${blobType}`;
    
    const dummyUrl = `https://dummy-cache-key.local/${cacheKey}`;

    try {
        const cache = await caches.open('prompt-blob-cache');
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
        console.error('Error saving blob to cache:', error);
    }
}

/**
 * @param {number} promptId
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
 * @param {number} promptId
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
 * @param {number} promptId
 * @returns {Promise<void>}
 */
export async function deletePromptCache(promptId) {
    return deleteBlobFromCache(promptId, 'all');
}

/**
 * @param {string} key
 * @param {any} value
 * @returns {Promise<void>}
 */
export async function saveSetting(key, value) {
    return setItem(key, value);
}

/**
 * @param {string[]} keys
 * @returns {Promise<Object>}
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
 * @param {number} promptId
 * @param {'imageBlobThumbnail' | 'imageBlobViewer' | 'imageBlobIcon'} blobType
 * @param {boolean} forceRefresh
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
 * @param {string} domain
 * @param {Blob} blob
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
 * @param {string} domain
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
 * @param {string} domain
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
 * @param {string[]} keys
 * @returns {Promise<Object>}
 */
export async function getAllSettings(keys) {
    return loadSettings(keys);
}

/**
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
 * @param {string} cacheName
 * @returns {Promise<number>}
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
 * @param {string} cacheName
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
 * @returns {Promise<void>}
 */
export async function clearUserData() {
    const userKeysToDelete = [
        "username", "theme", "showSeconds", "menuBlur", "footerBlur", "languageSettings",
        "enableAnimation", "showContent", "showGreeting", "showDescription", "showDate", "showTime", "showUsername",
        "bookmarks", "showBookmark", "bookmarkBlur", "enableSearchBar", "bookmarkOpenAction",
        "searchEngine", "searchOpenAction", "enableHistorySearch", "enableBookmarkSearch",
        "enableBookmarkPopupFinder", "enableShortcutCtrlD", "lastKnownBookmarkSearchState", "lastKnownBookmarkPopupState",
        "colorScheme", "customBackground", "customThemeOverrides", "todoList", "showTodoList"
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
 * @returns {Promise<void>}
 */
export async function clearHiddenData() {
    try {
        await deleteAllPrompts();
        const hiddenKeysToDelete = [
            "userPIN",
            "advancedPrompts",
            "promptOrder",
            "promptFolders",
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
 * @param {Blob} blob
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