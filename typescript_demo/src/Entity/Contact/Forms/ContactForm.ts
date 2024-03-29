import { FORM_TYPE_CREATE, FORM_TYPE_UPDATE } from "../../../formTypes";

import { WebApiConfig } from "xrm-webapi";

export class ContactForm {
  static formContext: Xrm.FormContext;
  static formType: number;
  static config = new WebApiConfig("9.2");

  static async onLoad(context: Xrm.Events.EventContext): Promise<void> {
    this.formContext = context.getFormContext();
    this.formType = this.formContext.ui.getFormType();

    if (this.formType === FORM_TYPE_CREATE) {
      console.log('FORM_TYPE_CREATE');
    } else if (this.formType === FORM_TYPE_UPDATE) {
      console.log('FORM_TYPE_UPDATE');
    }

    this.validateIdNumber();
    this.autoPopulateIdRelatedFields();
    await this.attachEvent();
    await this.callCustomApi_SayHello();
  }
  static async onSave(context: Xrm.Events.EventContext): Promise<void> {

  }
  static async attachEvent(): Promise<void> {
    this.formContext.getAttribute('t365_idnumber').addOnChange(this.validateIdNumber);
    this.formContext.getAttribute('t365_idnumber').addOnChange(this.autoPopulateIdRelatedFields);
  }

  static async callCustomApi_SayHello(): Promise<void> {
    var execute_t365_SayHelloAPI_Request = {
      // Parameters
      t365_Name: "Tiyani", // Edm.String

      getMetadata: function () {
        return {
          boundParameter: null,
          parameterTypes: {
            t365_Name: {
              typeName: "Edm.String",
              structuralProperty: 1
            }
          },
          operationType: 0,
          operationName: "t365_SayHelloAPI"
        };
      }
    };

    execute
    Xrm.WebApi.execute(execute_t365_SayHelloAPI_Request).then(
      function success(response: { ok: any; json: () => any; }) {
        if (response.ok) {
          return response.json();
        }
      }
    ).then(function (responseBody: any) {
      var result = responseBody;
      console.log(result);
      // Return Type: mscrm.t365_SayHelloAPIResponse
      // Output Parameters
      var t356_sayhellotome = result["t356_SayHelloToMe"]; // Edm.String
    }).catch(function (error: { message: any; }) {
      console.log(error.message);
    });
  }

  static validateIdNumber(): void {
    console.log('validateIdNumber called');
  }

  static hideTabAndShowMessage(): void {
    ContactForm.formContext.ui.tabs.get("details").setVisible(false);
    alert('Details Tab is hidden')
  }

  static autoPopulateIdRelatedFields(): void {
    const formContext = ContactForm.formContext;// context.getFormContext();
    const idNumber = formContext.getAttribute('t365_idnumber').getValue();
    const ageAttribute = formContext.getAttribute('t365_age');
    const genderAttribute = formContext.getAttribute('gendercode');

    if (ageAttribute && genderAttribute) {
      ageAttribute.setValue(null);
      genderAttribute.setValue(null);
    }

    if (idNumber === undefined || idNumber === null) {
      return
    };

    if (idNumber.length >= 13) {
      const dateOfBirth = idNumber.substr(0, 6);
      const genderCode = idNumber.substr(6, 4);

      const birthYear = '19' + dateOfBirth.substr(0, 2);
      const birthMonth = dateOfBirth.substr(2, 2);
      const birthDay = dateOfBirth.substr(4, 2);
      const birthDate = new Date(parseInt(birthYear), birthMonth - 1, birthDay);

      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear() + 1;
      const monthDiff = today.getMonth() - birthDate.getMonth() + 1;

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      const gender = (parseInt(genderCode) >= 5000) ? 1 : 2; // 1= 'Male' : 2='Female';

      if (ageAttribute && genderAttribute) {
        ageAttribute.setValue(age);
        genderAttribute.setValue(gender);
      } else {
        console.error('One or both attributes are null or undefined.');
      }
    }
  }
}
