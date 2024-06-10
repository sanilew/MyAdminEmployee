import React, { useState, useEffect, useRef, useContext } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { RadioButton } from "primereact/radiobutton";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import UserContext from "../context/UserContext";
import { Cookies } from "react-cookie";
import { Calendar } from "primereact/calendar";

function Dashboard() {
  const cookies = new Cookies();
  const role = cookies.get("role");

  let emptyUser = {
    _id: null,
    first_name: "",
    last_name: "",
    email: "",
    dob: "",
    city: "",
    state: "",
    role: "",
    password: "",
  };

  const user_context = useContext(UserContext);

  const [userDialog, setUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [user, setUser] = useState(emptyUser);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    user_context.getUserList();
  }, []);

  const openNew = () => {
    setUser(emptyUser);
    setSubmitted(false);
    setUserDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const saveUser = async () => {
    setSubmitted(true);

    if (user._id) {
      const response = await user_context.updateUser(user);
      response === true &&
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "User Updated",
          life: 3000,
        });
    } else {
      const response = await user_context.addUser(user);
      response === true &&
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "User Created",
          life: 3000,
        });
    }
    setUserDialog(false);
  };

  const editUser = (user) => {
    user["password"] = "";
    setUser({ ...user });
    setUserDialog(true);
  };

  const confirmDeleteUser = (user) => {
    setUser(user);
    setDeleteUserDialog(true);
  };

  const deleteUser = () => {
    const response = user_context.deleteUser(user._id);
    setDeleteUserDialog(false);
    setUser(emptyUser);
    if (response === true) {
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User Deleted",
        life: 3000,
      });
    }
  };

  const onRoleChange = (e) => {
    let _user = { ...user };

    _user["role"] = e.value;
    setUser(_user);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...user };

    _product[`${name}`] = val;

    setUser(_product);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {role === 1 && (
          <Button
            label="New"
            icon="pi pi-plus"
            severity="success"
            onClick={openNew}
          />
        )}
      </div>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Employees</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );
  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveUser} />
    </React.Fragment>
  );
  const deleteUserDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteUserDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteUser}
      />
    </React.Fragment>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editUser(rowData)}
        />
        {role === 1 && (
          <Button
            icon="pi pi-trash"
            rounded
            outlined
            severity="danger"
            onClick={() => confirmDeleteUser(rowData)}
          />
        )}
      </React.Fragment>
    );
  };

  return (
    <>
      {role !== 3 && (
        <div>
          <Toast ref={toast} />
          <div className="card">
            <Toolbar className="mb-4" start={leftToolbarTemplate}></Toolbar>

            <DataTable
              ref={dt}
              value={user_context.usersList}
              selection={selectedUsers}
              onSelectionChange={(e) => setSelectedUsers(e.value)}
              dataKey="_id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
              globalFilter={globalFilter}
              header={header}
            >
              <Column selectionMode="single" exportable={false}></Column>
              <Column
                field="first_name"
                header="First Name"
                sortable
                style={{ minWidth: "12rem" }}
              ></Column>
              <Column
                field="last_name"
                header="Last Name"
                sortable
                style={{ minWidth: "16rem" }}
              ></Column>
              <Column
                field="email"
                header="Email"
                sortable
                style={{ minWidth: "16rem" }}
              ></Column>
              <Column
                field="dob"
                header="Date Of Birth"
                sortable
                style={{ minWidth: "16rem" }}
              ></Column>
              <Column
                field="city"
                header="City"
                sortable
                style={{ minWidth: "16rem" }}
              ></Column>
              <Column
                field="state"
                header="State"
                sortable
                style={{ minWidth: "16rem" }}
              ></Column>
              {(role === 1 || role === 2) && (
                <Column
                  body={actionBodyTemplate}
                  exportable={false}
                  style={{ minWidth: "12rem" }}
                ></Column>
              )}
            </DataTable>
          </div>

          <Dialog
            visible={userDialog}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="User Details"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialog}
          >
            {user.image && (
              <img
                src={`https://primefaces.org/cdn/primereact/images/user/${user.image}`}
                alt={user.image}
                className="user-image block m-auto pb-3"
              />
            )}
            <div className="field">
              <label htmlFor="first_name" className="font-bold">
                First Name
              </label>
              <InputText
                id="first_name"
                value={user.first_name}
                onChange={(e) => onInputChange(e, "first_name")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !user.first_name,
                })}
              />
              {submitted && !user.first_name && (
                <small className="p-error">First Name is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="last_name" className="font-bold">
                Last Name
              </label>
              <InputText
                id="last_name"
                value={user.last_name}
                onChange={(e) => onInputChange(e, "last_name")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !user.last_name,
                })}
              />
              {submitted && !user.last_name && (
                <small className="p-error">Last Name is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="email" className="font-bold">
                Email
              </label>
              <InputText
                id="email"
                value={user.email}
                onChange={(e) => onInputChange(e, "email")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !user.email,
                })}
              />
              {submitted && !user.email && (
                <small className="p-error">Email is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="city" className="font-bold">
                City
              </label>
              <InputText
                id="city"
                value={user.city}
                onChange={(e) => onInputChange(e, "city")}
                required
                autoFocus
                className={classNames({ "p-invalid": submitted && !user.city })}
              />
              {submitted && !user.city && (
                <small className="p-error">City is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="state" className="font-bold">
                State
              </label>
              <InputText
                id="state"
                value={user.state}
                onChange={(e) => onInputChange(e, "state")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !user.state,
                })}
              />
              {submitted && !user.state && (
                <small className="p-error">State is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="password" className="font-bold">
                Password
              </label>
              <InputText
                id="password"
                onChange={(e) => onInputChange(e, "password")}
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="description" className="font-bold">
                Date Of Birth
              </label>
              <Calendar
                value={new Date(user.dob)}
                onChange={(e) => onInputChange(e, "dob")}
              />
            </div>

            <div className="field">
              <label className="mb-3 font-bold">Category</label>
              <div className="formgrid grid">
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="role1"
                    name="manager"
                    value="1"
                    onChange={onRoleChange}
                    checked={user.role === "1"}
                  />
                  <label htmlFor="role1">Manager</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="role2"
                    name="admin"
                    value="2"
                    onChange={onRoleChange}
                    checked={user.role === "2"}
                  />
                  <label htmlFor="role2">Admin</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="role3"
                    name="user"
                    value="3"
                    onChange={onRoleChange}
                    checked={user.role === "3"}
                  />
                  <label htmlFor="role3">User</label>
                </div>
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteUserDialog}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Confirm"
            modal
            footer={deleteUserDialogFooter}
            onHide={hideDeleteUserDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {user && (
                <span>
                  Are you sure you want to delete <b>{user.name}</b>?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      )}
    </>
  );
}

export default Dashboard;
