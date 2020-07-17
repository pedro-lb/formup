import * as React from 'react';
import invariant from 'invariant';
import isFunction from 'lodash.isfunction';

import { FormArrayFieldProps, FormArrayFieldItem } from '../../interfaces';
import { useFormContext } from '../../contexts/FormContext/FormContext';
import getSchemaField from '../../utils/getSchemaField';
import getFieldType from '../../utils/getFieldType';

/**
 * Helper to build and render array fields within your form.
 *
 * You can pass a function or a component as children to render your fields,
 * the array of items will be automatically injected into into it.
 *
 * Each item of the array contains the field value, the path to it in
 * the schema, and a function to build the path with more field names
 * in case you're working with objects, so that you can access properties.
 *
 * You can pass this path to the "name" property of <FormInput /> to
 * register it within the form.
 *
 * Note that FormArrayField does not render anything in the DOM,
 * other than the children passed to it.
 *
 * @param param0 Options.
 */
const FormArrayField = ({
  children,
  name,
}: FormArrayFieldProps) => {
  const form = useFormContext();

  invariant(!!name, 'You need to provide the "name" prop.');
  invariant(!!children, 'You must define children for <FormArrayField />');
  invariant(!!form, 'You need to provide a <Form /> component enclosing FormInput.');

  const schemaField = getSchemaField(name, form?.schema);

  invariant(!!schemaField, `The field "${name}" was not found in the schema.`);

  const fieldType = getFieldType(name, form?.schema);

  invariant(fieldType === 'array', `The field type of ${name} must be an array in your schema in order to use <FormArrayField />.`);

  const items = React.useMemo<FormArrayFieldItem[]>(() => [], []);

  if (isFunction(children)) {
    return (
      <>
        {children(items)}
      </>
    );
  }

  return (
    <>
      {React.cloneElement(children, {
        items,
      })}
    </>
  );
};

export default FormArrayField;
