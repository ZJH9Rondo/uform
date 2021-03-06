import React from 'react'
import { registerFormField } from './core'
import { SchemaField } from '../decorators/markup'
import { registerVirtualboxFlag } from '../utils'
import { FormField } from '../state/field'
import pascalCase from 'pascal-case'

export const createVirtualBox = (name, component) => {
  registerVirtualboxFlag(name)
  registerFormField(
    name,
    class extends React.PureComponent {
      static displayName = 'VirtualBoxWrapper'

      render() {
        const { schema, schemaPath, path, getOrderProperties } = this.props
        const parentPath = path.slice(0, path.length - 1)
        const properties = getOrderProperties(this.props)
        const children = properties.map(({ key }) => {
          const newPath = parentPath.concat(key)
          const newName = newPath.join('.')
          const newSchemaPath = schemaPath.concat(key)
          return (
            <FormField
              key={newSchemaPath}
              name={newName}
              path={newPath}
              schemaPath={newSchemaPath}
            />
          )
        })
        return React.createElement(component, schema['x-props'], children)
      }
    },
    true
  )

  const VirtualBox = ({ children, name: fieldName, render, ...props }) => (
    <SchemaField
      type='object'
      name={fieldName}
      x-component={name}
      x-props={props}
      x-render={render}
    >
      {children}
    </SchemaField>
  )

  if (component.defaultProps) {
    VirtualBox.defaultProps = component.defaultProps
  }

  VirtualBox.displayName = pascalCase(name)

  return VirtualBox
}

export const FormSlot = ({ name, children }) => {
  return (
    <SchemaField
      type='object'
      name={name}
      x-component='slot'
      renderChildren={children}
    />
  )
}
