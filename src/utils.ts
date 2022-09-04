
import * as t from '@babel/types'
import type { NodePath } from '@babel/core'
import type { Program } from '@babel/types'

/**
 * @example
 * `import N = N.S;` 中的 N.S => `"N.S"`;
 * @param node
 */
export function getTSQualifiedName (node: t.TSQualifiedName): string {
  const identifiers: string[] = [node.right.name]
  let cur: t.TSQualifiedName = node
  while (t.isTSQualifiedName(cur.left)) {
    cur = cur.left
    identifiers.unshift(cur.right.name)
  }

  identifiers.unshift(cur.left.name)
  return identifiers.join('.')
}

export function getConstEnumMemberExpression (node: t.MemberExpression): string | null {
  if (!t.isIdentifier(node.property)) {
    return null
  }
  const identifiers: string[] = [node.property.name]
  let cur: t.MemberExpression = node
  while (t.isMemberExpression(cur.object)) {
    cur = cur.object
    const property = cur.property
    if (!t.isIdentifier(property)) {
      return null
    }
    identifiers.unshift(property.name)
  }
  if (!t.isIdentifier(cur.object)) {
    return null
  }
  identifiers.unshift((cur.object).name)
  return identifiers.join('.')
}

export function getNamespaceAliasMapFromProgram (
  body: t.Statement[],
  allKeys: string[],
  path?: NodePath<Program>
): Map<string, string> {
  const alias = new Map<string, string>()
  const mayBeRenamedAlias: Array<[string, t.Identifier]> = [] // maybe
  const pendingRemoveBodyIndexList: number[] = []
  const rootSet = new Set()
  allKeys.forEach((k) => {
    const root = k.split('.')[0]
    rootSet.add(root)
  })
  body.forEach((d, index) => {
    if (!t.isTSImportEqualsDeclaration(d)) {
      if ((path != null) && t.isVariableDeclaration(d) && d.declarations.length === 1) {
        const firstDeclaratorInit = d.declarations[0].init
        if (t.isMemberExpression(firstDeclaratorInit)) {
          // tsc 之后 import xxx = v.v.v 会变成 var xxx = v.v.v
          // 这里处理 tsc 后的代码
          const memberExpCode = path
            .getSource()
            .substring(firstDeclaratorInit.start!, firstDeclaratorInit.end!)
          const root = memberExpCode.split('.')[0]
          if (!root) {
            return
          }
          // 去掉非全局变量 或者 enums key 中并没有这个 root 的情况
          if (path.scope.getBindingIdentifier(root) || !rootSet.has(root)) {
            return
          }
          pendingRemoveBodyIndexList.unshift(index)
          alias.set((d.declarations[0].id as any).name, memberExpCode)
        } else if (t.isIdentifier(firstDeclaratorInit)) {
          const left = (d.declarations[0].id as any).name
          const right = firstDeclaratorInit.name
          const memberExpCodeMaybe = alias.get(right)
          if (memberExpCodeMaybe) {
            pendingRemoveBodyIndexList.unshift(index)
            alias.set(left, memberExpCodeMaybe)
          }
          if (!path.scope.getBindingIdentifier(right)) {
            alias.set(left, right)
          }
        }
      }
      return
    }
    const left = d.id.name
    const { moduleReference } = d
    if (!t.isTSQualifiedName(moduleReference)) {
      if (t.isIdentifier(moduleReference)) {
        mayBeRenamedAlias.push([left, moduleReference])
      }
      return
    }
    const codeString = getTSQualifiedName(moduleReference)
    if (
      allKeys.some((key) => {
        return key.startsWith(codeString)
      })
    ) {
      alias.set(left, codeString)
    }
  })
  mayBeRenamedAlias.forEach(([l, identifier]) => {
    const trueNS = alias.get(identifier.name)
    if (trueNS) {
      alias.set(l, trueNS)
    } else {
      alias.set(l, identifier.name)
    }
  })
  if (path != null) {
    pendingRemoveBodyIndexList.forEach((index) => {
      (path.get(`body.${index}`) as any).remove()
    })
  }
  return alias
}

const DOT_REG = /\./g
export function escapeDotForRegExp (pattern: string): string {
  const output = pattern.replace(DOT_REG, '\\.')
  DOT_REG.lastIndex = 0
  return output
}
