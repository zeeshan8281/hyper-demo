import React, { useState } from 'react'

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

const Toggle: React.FC<{ open: boolean; onClick: () => void }> = ({ open, onClick }) => (
  <button onClick={onClick} className="text-zinc-400 hover:text-white mr-1">
    {open ? '▾' : '▸'}
  </button>
)

const KeySpan: React.FC<{ name: string }> = ({ name }) => (
  <span className="text-blue-300 mr-1">{name}</span>
)

const ValueSpan: React.FC<{ value: Exclude<JsonValue, object> }> = ({ value }) => {
  const t = typeof value
  const style = t === 'number'
    ? 'text-amber-300'
    : t === 'boolean'
      ? 'text-purple-300'
      : value === null
        ? 'text-zinc-500'
        : 'text-green-300'
  return <span className={style}>{String(value)}</span>
}

const indentClass = (level: number) => `pl-${Math.min(level * 4, 24)}`

const Node: React.FC<{ name?: string; data: JsonValue; level: number }>
  = ({ name, data, level }) => {
  const isArray = Array.isArray(data)
  const isObject = !isArray && typeof data === 'object' && data !== null

  if (!isArray && !isObject) {
    return (
      <div className={`whitespace-pre-wrap ${indentClass(level)}`}>
        {name !== undefined && <KeySpan name={`${name}:`} />}<ValueSpan value={data as any} />
      </div>
    )
  }

  const entries = isArray
    ? (data as JsonValue[]).map((v, i) => [String(i), v] as const)
    : Object.entries(data as { [k: string]: JsonValue })

  const [open, setOpen] = useState(level < 1)

  return (
    <div className={indentClass(level)}>
      <div className="flex items-center">
        <Toggle open={open} onClick={() => setOpen(!open)} />
        {name !== undefined && <KeySpan name={name} />}
        <span className="text-zinc-500">
          {isArray ? `[${entries.length}]` : `{${entries.length}}`}
        </span>
      </div>
      {open && (
        <div className="mt-1">
          {entries.map(([k, v]) => (
            <Node key={k} name={k} data={v} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

const JsonView: React.FC<{ data: any } > = ({ data }) => {
  return (
    <div className="bg-black border border-zinc-700 p-4 text-xs text-zinc-300 font-mono overflow-auto max-h-[60vh]">
      <Node data={data as JsonValue} level={0} />
    </div>
  )
}

export default JsonView


