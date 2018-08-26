export class CompareValidator {
  static matchingConfirmPasswords(rForm: any) {
    let formInputs = rForm['value'];
    if (formInputs.password == formInputs.repassword) {
      return null;
    } else {
      return rForm.controls['repassword'].setErrors({ passwordNotEquivalent: true })
    }
  }
}