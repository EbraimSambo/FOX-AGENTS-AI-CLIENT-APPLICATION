

export function getFirstAndLastName(fullName: string): string {
    const nameParts = fullName.trim().split(/\s+/);
  
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  
    return firstName + ` ` + lastName;
  }