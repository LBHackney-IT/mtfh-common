import React, {
  Children,
  ComponentPropsWithoutRef,
  ReactElement,
  cloneElement,
  forwardRef,
  isValidElement,
  useMemo,
} from 'react';
import classNames from 'classnames';

import { TextArea } from '../text-area';
import './styles.scss';

export interface FormGroupProps extends ComponentPropsWithoutRef<'div'> {
  id: string;
  name: string;
  label: string;
  hint?: string;
  error?: string | false;
  required?: boolean;
  children: ReactElement;
}

export const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(
  function FormGroup(
    { id, name, label, hint, error, required, children, className, ...props },
    ref
  ) {
    const formGroupClasses = classNames(
      'govuk-form-group',
      {
        'govuk-form-group--error': !!error,
      },
      'lbh-form-group',
      className
    );

    const describedBy = useMemo(() => {
      const classes: string[] = [];
      if (hint) {
        classes.push(`${id}-hint`);
      }
      if (error) {
        classes.push(`${id}-error`);
      }
      return classes.join(' ');
    }, [id, hint, error]);

    const formGroup = (
      <div ref={ref} className={formGroupClasses} {...props}>
        <label className="govuk-label lbh-label" htmlFor={id}>
          {label}
          {required ? <sup>*</sup> : ''}
        </label>
        {!!hint && (
          <span id={`${id}-hint`} className="govuk-hint lbh-hint">
            {hint}
          </span>
        )}
        {!!error && (
          <span
            id={`${id}-error`}
            className="govuk-error-message lbh-error-message"
          >
            <span className="govuk-visually-hidden">Error:</span> {error}
          </span>
        )}
        {!!children &&
          Children.only(
            cloneElement(children, {
              id,
              name,
              required,
              error: !!error,
              'aria-describedby': describedBy || undefined,
            })
          )}
      </div>
    );

    return isValidElement(children) && children.type === TextArea ? (
      <div className="govuk-character-count">{formGroup}</div>
    ) : (
      formGroup
    );
  }
);
