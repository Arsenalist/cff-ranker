import isValid from "date-fns/isValid";
import { MultiMessageError } from '@cff/common';
import { differenceInDays } from "date-fns";

export function validateRankingParameters(startDate: string, endDate: string) {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  if (!isValid(startDateObj) && !isValid(endDateObj)) {
    throw new MultiMessageError(['Start and end date is invalid'])
  }
  if (!isValid(startDateObj)) {
    throw new MultiMessageError(['Start date is invalid'])
  }
  if (!isValid(endDateObj)) {
    throw new MultiMessageError(['End date is invalid'])
  }
  if (differenceInDays(endDateObj, startDateObj) < 0) {
    throw new MultiMessageError(['End date must be greater than start date'])
  }
}
