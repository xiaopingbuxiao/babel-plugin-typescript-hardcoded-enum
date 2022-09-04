
import * as babel from '@babel/core'
import { PluginObj } from '@babel/core'
import { parseDTSEnumFac } from './parseDts'
import {
  escapeDotForRegExp,
  getConstEnumMemberExpression,
  getNamespaceAliasMapFromProgram
} from './utils'

import type { Node } from '@babel/types'
import { writeFileSync } from 'fs'
import path from 'path'
const parseDTSEnum = parseDTSEnumFac()

export default function (
  { types: t }: typeof babel,
  { typingsRoot, debug }: { typingsRoot: string, debug: boolean }
): PluginObj {
  const enumJson = parseDTSEnum(typingsRoot)
  const allEnumKeys = Object.keys(enumJson)
  debug && writeFileSync(
    path.resolve(typingsRoot, 'debug.json'),
    JSON.stringify(enumJson, null, 4),
    'utf-8'
  )
  if (allEnumKeys.length === 0) {
    return {
      visitor: {}
    }
  }
  return {
    name: 'babel-plugin-typescript-enum',
    visitor: {
      Program (path) {
        const namespaceAlias = getNamespaceAliasMapFromProgram(
          path.node.body,
          allEnumKeys,
          path
        )
        path.traverse({
          TSImportEqualsDeclaration (path) {
            path.remove()
          },
          MemberExpression (path, state) {
            const { enumJson, namespaceAlias } = state
            const key = getConstEnumMemberExpression(path.node)
            if (!key) {
              return
            }
            const firstIdentifier = key.split('.')[0]
            const binding = path.scope.getBindingIdentifier(firstIdentifier)
            if (binding) {
              path.skip()
              return
            }
            let v = enumJson[key]
            if (typeof v === 'undefined') {
              for (const [left, right] of namespaceAlias) {
                if (!key.startsWith(left)) {
                  continue
                }
                const newKey = key.replace(
                  new RegExp('^' + escapeDotForRegExp(left)),
                  right
                )
                if (enumJson[newKey] !== undefined) {
                  v = enumJson[newKey]
                  break
                }
              }
            }
            if (typeof v === 'undefined') {
              return
            }
            let replaced: Node | undefined
            if (typeof v === 'number') {
              replaced = t.numericLiteral(v)
            } else if (typeof v === 'boolean') {
              replaced = t.booleanLiteral(v)
            } else if (typeof v === 'string') {
              replaced = t.stringLiteral(v)
            }
            if (!replaced) {
              return
            }
            const lastDot = key.lastIndexOf('.')
            const label = key.substr(lastDot + 1)
            if (replaced) {
              path.replaceWith(replaced)
              path.addComment('trailing', label, false)
            }
          }
        }, {
          enumJson,
          namespaceAlias
        })
      }
    }
  }
}
