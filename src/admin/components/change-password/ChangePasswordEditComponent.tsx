import React, { useEffect, useRef, useState } from "react";
import { Panel } from "primereact/panel";
import { AdmUser, cleanAdmUser, emptyAdmUser } from "../../models/AdmUser";
import ChangePasswordService from "../../services/ChangePasswordService";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Password } from 'primereact/password';
import { useHistory } from "react-router";
import BarraMenu from "../../../base/components/BarraMenu";

function AdmChangePasswordEditComponent() {

  const changePasswordService = new ChangePasswordService();

  const [admUser, setAdmUser] = useState<AdmUser>(emptyAdmUser);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const toast = useRef<Toast>(new Toast({}));
  const history = useHistory();

  useEffect(() => {
    onClean();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onClean = () => {
    setAdmUser(cleanAdmUser);
  }

  const onCancel = () => {
    history.push('/home');
  }

  const onSave = () => {
    setSubmitted(true);

    if (admUser.newPassword !== admUser.confirmNewPassword) {
      toast.current.show({
        severity: 'error', summary: 'Error',
        detail: 'New password and confirm password do not match!', life: 3000
      });
    } else {

      if (!changePasswordService.validatePassword(admUser.email, admUser.currentPassword)) {
        toast.current.show({
          severity: 'error', summary: 'Error',
          detail: 'The current password does not meet the security criteria.', life: 3000
        });
        return;
      }

      if (!changePasswordService.validatePassword(admUser.email, admUser.newPassword)) {
        toast.current.show({
          severity: 'error', summary: 'Error',
          detail: 'The new password does not meet the security criteria.', life: 3000
        });
        return;
      }

      if (changePasswordService.updatePassword(admUser)) {
        toast.current.show({
          severity: 'success', summary: 'Successful',
          detail: 'Password changed successfully!', life: 3000
        });
      }
    }
  }

  const onCurrentPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    const val: string = (e.currentTarget && e.currentTarget.value) || '';
    let _admUser = {...admUser};
    _admUser.currentPassword = val;

    setAdmUser(_admUser);
  }

  const onNewPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    const val: string = (e.currentTarget && e.currentTarget.value) || '';
    let _admUser = {...admUser};
    _admUser.newPassword = val;

    setAdmUser(_admUser);
  }

  const onConfirmNewPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    const val: string = (e.currentTarget && e.currentTarget.value) || '';
    let _admUser = {...admUser};
    _admUser.confirmNewPassword = val;

    setAdmUser(_admUser);
  }

  return (
    <div>
      <BarraMenu></BarraMenu>
      <Toast ref={toast} />
      
      <Panel header="Change password" className="p-mb-2">
        <div className="p-grid p-justify-end">
          <Button label="Save" icon="pi pi-check" className="p-button-success p-mr-2" onClick={onSave}></Button>
          <Button label="Clean" icon="pi pi-star-o" className="p-button-primary p-mr-2" onClick={onClean}></Button>
          <Button label="Cancel" icon="pi pi-times" className="p-button-secondary p-mr-2" onClick={onCancel}></Button>
        </div>

        <div className="p-fluid p-formgrid">
          <div className="p-col-10">
              <p>As minimum requirements for user passwords, the following should be considered:</p>
              <ul>
                  <li>Minimum length of 8 characters;</li>
                  <li>Presence of at least 3 of the 4 character classes below:
                      <ul>
                          <li>uppercase characters;</li>
                          <li>lowercase characters;</li>
                          <li>numbers;</li>
                          <li>special characters;</li>
                          <li>Absence of strings (eg: 1234) or consecutive identical characters (yyyy);</li>
                          <li>Absence of any username identifier, such as: John Silva - user: john.silva - password cannot contain "john" or "silva".</li>
                      </ul>
                  </li>
              </ul>
          </div>	
          <div className="p-field p-lg-4 p-md-6 p-sm-12">
              <label htmlFor="currentPassword">Current password:</label>
              <Password id="currentPassword" value={admUser.currentPassword} required feedback={false} maxLength={10}
                onChange={(e) => onCurrentPasswordChange(e)}></Password>
              {submitted && !admUser.currentPassword && <small className="p-error">Current password is required.</small>}
          </div>
          <div className="p-field p-lg-4 p-md-6 p-sm-12">
              <label htmlFor="newPassword">New password:</label>
              <Password id="newPassword" value={admUser.newPassword} required feedback={false} maxLength={10}
                onChange={(e) => onNewPasswordChange(e)}></Password>
              {submitted && !admUser.newPassword && <small className="p-error">New password is required.</small>}
          </div>
          <div className="p-field p-lg-4 p-md-6 p-sm-12">
              <label htmlFor="confirmNewPassword">Confirm new password:</label>
              <Password id="confirmNewPassword" value={admUser.confirmNewPassword} required feedback={false} maxLength={10}
                onChange={(e) => onConfirmNewPasswordChange(e)}></Password>
              {submitted && !admUser.confirmNewPassword && <small className="p-error">Confirm new password is required.</small>}
          </div>
        </div>

      </Panel>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
}

export default AdmChangePasswordEditComponent;
