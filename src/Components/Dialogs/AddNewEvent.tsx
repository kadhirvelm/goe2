import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { Classes, Dialog, FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import { handleStringChange } from "@blueprintjs/docs-theme";

import IStoreState from "../../State/IStoreState";
import { IUser, IUserMap } from "../../Types/Users";
import { showToast } from "../../Utils/Toaster";
import { Autocomplete, IAutcompleteValuesProps } from "../Common/Autocomplete";
import { DialogUtils } from "./DialogUtils";
import { IDialogProps } from "./DialogWrapper";

import "./AddNewEvent.css";

export interface IAddNewEventStateProps {
    currentUser: IUser | undefined;
    users: IUserMap | undefined;
}

export interface IAddNewEventDispatchProps {
    dialogUtils: DialogUtils;
}

export interface ITemporaryEvent {
    attendees: IUser[];
    date: string;
    description: string;
}

export interface IAddNewEventState {
    temporaryEvent: ITemporaryEvent;
    isSubmitting: boolean;
}

export class PureAddNewEvent extends React.Component<
    IDialogProps & IAddNewEventStateProps & IAddNewEventDispatchProps, IAddNewEventState> {
    public EMPTY_STATE: IAddNewEventState = {
        isSubmitting: false,
        temporaryEvent: {
            attendees: this.props.currentUser === undefined ? [] : [this.props.currentUser],
            date: new Date().toLocaleDateString(),
            description: "",
        }
    }
    public state: IAddNewEventState = this.EMPTY_STATE;

    public render() {
        return(
            <Dialog
                canEscapeKeyClose={false}
                canOutsideClickClose={false}
                isOpen={this.props.isOpen}
                onClose={this.resetStateAndClose}
                title="Add New Event"
            >
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup>
                        <InputGroup autoFocus={true} className="input-group" onChange={this.handleChange("description")} placeholder="Description" value={this.state.temporaryEvent.description} />
                        <InputGroup className="input-group" onChange={this.handleChange("date")} placeholder={`Date, eg. ${new Date().toLocaleDateString()}`} value={this.state.temporaryEvent.date} />
                        <Autocomplete
                            className="input-group"
                            dataSource={this.props.users}
                            displayKey="name"
                            multiselection={true}
                            placeholderText="Search for users…"
                            values={this.getAttendees()}
                            onSelection={this.props.dialogUtils.handleAttendeeSelection(this.state.temporaryEvent, this.adjustFinalEvent)}
                        />
                    </FormGroup>
                </div>
                {this.props.dialogUtils.returnFooterActions(this.props.onClose, this.handleSubmit, this.state.isSubmitting)}
            </Dialog>
        );
    }

    private resetStateAndClose = () => {
        this.setState(this.EMPTY_STATE, () => {
            this.props.onClose();
        });
    }

    private handleSubmit = () => {
        this.setState({ isSubmitting: true }, async () => {
            try {
                await this.props.dialogUtils.submitFinalEvent(this.state.temporaryEvent);
                showToast(Intent.SUCCESS, "Successfully added a new event.");
                this.resetStateAndClose();
            } catch (error) {
                this.setState({ isSubmitting: false });
            }
        })
    }

    private getAttendees = () => {
        return this.state.temporaryEvent.attendees.map((user: IUser) => {
            return {[user.id]: user.name}
        }).reduce((a: IAutcompleteValuesProps, b: IAutcompleteValuesProps) => {
            return {...b, ...a}
        }, {});
    }

    private handleChange = (key: string) => {
        return handleStringChange(
            (newValue) => {
                this.adjustFinalEvent(key, newValue);
        });
    }
    
    private adjustFinalEvent = (key: string, newValue: any) => {
        this.setState({ temporaryEvent: {...this.state.temporaryEvent, [key]: newValue } });
    }
}

function mapStateToProps(state: IStoreState): IAddNewEventStateProps {
    return {
        currentUser: state.DatabaseReducer.currentUser,
        users: state.DatabaseReducer.userData,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IAddNewEventDispatchProps {
    return {
        dialogUtils: new DialogUtils(dispatch),
    };
}

export const AddNewEvent = connect(mapStateToProps, mapDispatchToProps)(PureAddNewEvent);
