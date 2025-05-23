import type { Segment } from "../analytics/Analytics"

const DB_NAME = 'slopecalc'
const STORE_NAME = 'segments'
const DB_VERSION = 1

export const openDB = (): Promise<IDBDatabase> =>
    new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onupgradeneeded = () => {
            const db = request.result
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' })
            }
        }

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })

export const saveSegment = (segment: Segment) =>
    withStore('readwrite', store => store.put(segment))


export const getAllSegments = () =>
    withStore('readonly', store => {
        return new Promise<Segment[]>(resolve => {
            const req = store.getAll()
            req.onsuccess = () => resolve(req.result)
        })
    })


export const clearAllSegments = () =>
    withStore('readwrite', store => {
        store.clear()
    })



const withStore = async <T>(
    mode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => T
): Promise<T> => {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, mode)
    const result = callback(tx.objectStore(STORE_NAME))
    await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
        tx.onabort = () => reject(tx.error)
    })
    return result
}


export const SegmentStore = {
  save: saveSegment,
  getAll: getAllSegments,
  clear: clearAllSegments
}
