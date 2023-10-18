import { FORM_TYPE_CREATE, FORM_TYPE_UPDATE } from "../../../formTypes";

export class AccountForm {
  static formContext: Xrm.FormContext;
  static formType: number;

  static async onLoad(context: Xrm.Events.EventContext): Promise<void> {
    this.formContext = context.getFormContext();
    this.formType = this.formContext.ui.getFormType();

    if (this.formType === FORM_TYPE_CREATE) {
      console.log('FORM_TYPE_CREATE');
    } else if (this.formType === FORM_TYPE_UPDATE) {
      console.log('FORM_TYPE_UPDATE');
    }
    await this.attachEvent();
  }

  static async onSave(context: Xrm.Events.EventContext): Promise<void> {

  }
  static async attachEvent(): Promise<void> {
    this.formContext.getAttribute('name').addOnChange(this.logNameChange);
  }

  static async logNameChange(): Promise<void> {
    console.log("name onchange");
  }

}