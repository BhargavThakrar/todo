import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'dueDate', async: false })
export class DueDateValidator implements ValidatorConstraintInterface {
  validate(dueDate: string) {
    // date is optional
    if (!dueDate) {
      return true;
    }

    // validate if date is valid
    if (isNaN(Date.parse(dueDate))) {
      return false;
    }

    // validate date is in future
    const givenDate = new Date(dueDate);
    const currentDate = new Date();

    // Normalize both dates to midnight to compare only the dates (not times)
    givenDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (givenDate < currentDate) {
      return false;
    }

    return true;
  }

  defaultMessage() {
    return 'Invalid date';
  }
}
