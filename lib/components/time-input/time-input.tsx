import React, { ComponentPropsWithoutRef, forwardRef } from "react";

import cn from "classnames";

import { NumberInput, NumberInputProps } from "../number-input";
import { Select, SelectProps } from "../select";

import "./styles.scss";

export type AmPm = "AM" | "PM";

export interface TimeInputProps extends ComponentPropsWithoutRef<"div"> {
  id?: string;
  error?: string;
  required?: boolean;
  hourProps?: NumberInputProps;
  minuteProps?: NumberInputProps;
  amPmProps?: SelectProps;
  hourLabel?: string;
  minuteLabel?: string;
  amPmLabel?: string;
}

export const TimeInput = forwardRef<HTMLDivElement, TimeInputProps>(function TimeInput(
  {
    id = "time-input",
    hourProps,
    minuteProps,
    amPmProps,
    hourLabel = "Hour",
    minuteLabel = "Minute",
    amPmLabel = "AM/PM",
    error,
    required,
    className,
    ...props
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn("govuk-date-input", "lbh-date-input", className)}
      {...props}
    >
      <div className="govuk-date-input__item">
        <label className="govuk-label lbh-label" htmlFor={`${id}-hour`}>
          {hourLabel}
        </label>
        <NumberInput
          className="govuk-date-input__input govuk-input--width-2"
          name="hour"
          required={required}
          maxLength={2}
          min={0}
          max={12}
          padStart={2}
          aria-label="Hour"
          {...hourProps}
        />
      </div>
      <div className="govuk-date-input__item">
        <label className="govuk-label lbh-label" htmlFor={`${id}-minute`}>
          {minuteLabel}
        </label>
        <NumberInput
          className="govuk-date-input__input govuk-input--width-2"
          name="minute"
          required={required}
          maxLength={2}
          min={0}
          max={59}
          padStart={2}
          aria-label="Minute"
          {...minuteProps}
        />
      </div>
      <div className="govuk-date-input__item">
        <label className="govuk-label lbh-label" htmlFor={`${id}-amPm`}>
          {amPmLabel}
        </label>
        <Select id="amPm" name="amPm" aria-label="AM/PM" {...amPmProps}>
          <option value="">{amPmProps?.placeholder || "AM/PM"}</option>
          <option value="am">AM</option>
          <option value="pm">PM</option>
        </Select>
      </div>
    </div>
  );
});
