import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isStringArray, parseProjectList } from './project-data'

test('renders arrays and legacy JSON, including double-encoded records', () => {
  const members = ['Alice', 'Bob']
  for (const input of [members, JSON.stringify(members), JSON.stringify(JSON.stringify(members))]) {
    assert.deepEqual(parseProjectList(input), members)
  }
})

test('malformed records cannot crash array rendering', () => {
  for (const input of [null, undefined, '', 'broken', '"Alice"', '{}', 'null', '[1]', { name: 'Alice' }]) {
    const members = parseProjectList(input)
    assert.deepEqual(members.slice(0, 3).map(name => name), [])
  }
})

test('writes reject encoded strings and non-string members', () => {
  assert.equal(isStringArray([]), true)
  assert.equal(isStringArray(['Alice']), true)
  for (const input of ['["Alice"]', null, {}, [1], ['Alice', null]]) {
    assert.equal(isStringArray(input), false)
  }
})
