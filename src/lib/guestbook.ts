import { createClient } from '@supabase/supabase-js'

export const GRID = 24

/** Each doodle is stored as GRID*GRID characters, one per pixel, using these keys. */
export const PALETTE = { k: '#000000', g: '#767676', p: '#f7a8c8' } as const
export type Ink = keyof typeof PALETTE
export type Pixels = (Ink | '')[]

export type Doodle = { id: string; name: string; pixels: Pixels; createdAt: string }

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Without keys (a fresh clone, or before Supabase is set up) the wall still works,
// but doodles only live in this browser's storage.
const supabase = url && key ? createClient(url, key) : null

const encode = (pixels: Pixels) => pixels.map((p) => p || '.').join('')
const decode = (s: string): Pixels => [...s].map((c) => (c in PALETTE ? (c as Ink) : ''))

type Row = { id: string; name: string; pixels: string; created_at: string }
const fromRow = (r: Row): Doodle => ({ id: r.id, name: r.name, pixels: decode(r.pixels), createdAt: r.created_at })

export async function fetchDoodles(): Promise<Doodle[]> {
  if (!supabase) return loadLocal().map(fromRow)
  const { data, error } = await supabase
    .from('guestbook')
    .select('id, name, pixels, created_at')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) throw error
  return data.map(fromRow)
}

export async function submitDoodle(name: string, pixels: Pixels): Promise<Doodle> {
  const row: Row = {
    id: crypto.randomUUID(),
    name: name.trim(),
    pixels: encode(pixels),
    created_at: new Date().toISOString(),
  }
  if (supabase) {
    const { error } = await supabase.from('guestbook').insert({ id: row.id, name: row.name, pixels: row.pixels })
    if (error) throw error
  } else {
    saveLocal([row, ...loadLocal()])
  }
  return fromRow(row)
}

// Storage can be unavailable (private windows, blocked site data); the wall then
// just starts empty each visit.
const LOCAL_KEY = 'guestbook-local'

function loadLocal(): Row[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveLocal(rows: Row[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(rows.slice(0, 200)))
  } catch {
    // nothing to do; the doodle still shows until the page reloads
  }
}
