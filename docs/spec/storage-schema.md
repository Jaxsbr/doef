# Storage Schema Specification

## localStorage Keys

```
doef:sheets          → JSON array of sheet IDs: string[]
doef:sheet:{id}      → JSON serialised Sheet object
```

## Serialisation

Sheets are stored as JSON matching the `Sheet` type exactly. No transformation needed — the type is already JSON-serialisable.

```json
{
  "id": "uuid-here",
  "name": "Paradiddle Exercise",
  "timeSignature": { "beats": 4, "subdivision": 4 },
  "bpm": 120,
  "bars": [
    {
      "voiceCells": {
        "hh-closed": [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
        "snare": [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
        "kick": [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false]
      }
    }
  ],
  "createdAt": "2026-03-11T08:00:00.000Z",
  "updatedAt": "2026-03-11T08:05:00.000Z"
}
```

## Operations

| Function | Behaviour |
|----------|-----------|
| `saveSheet(sheet)` | Stringify sheet, store under `doef:sheet:{id}`. Add id to `doef:sheets` if not present. Update `updatedAt`. |
| `loadSheet(id)` | Read `doef:sheet:{id}`, parse JSON, return Sheet. Return null if missing. |
| `listSheets()` | Read `doef:sheets`, for each id load sheet and return `{ id, name, updatedAt }[]`. |
| `deleteSheet(id)` | Remove `doef:sheet:{id}`. Remove id from `doef:sheets`. |

## Auto-save

Debounce: 1000ms after last edit. Uses `saveSheet()`. No separate auto-save mechanism.

## Migration

MVP has no migration logic. If the schema changes, old sheets may be lost. Acceptable for MVP — file export (future) mitigates this.
