import { Button, Classes, Intent } from "@blueprintjs/core";
import * as React from "react";
import { Dispatch } from "react-redux";

import { DatabaseDispatcher } from "../../Dispatchers/DatabaseDispatcher";
import { IEvent } from "../../Types/Events";
import { IUser } from "../../Types/Users";
import { showToast } from "../../Utils/Toaster";
import { IFinalEventChecked, IFinalEventEmpty } from "./AddNewEvent";
import { IFinalPerson } from "./AddNewUser";

export class DialogUtils {
    private databaseDispatcher: DatabaseDispatcher;

    public constructor(private dispatch: Dispatch) {
        this.databaseDispatcher = new DatabaseDispatcher(this.dispatch);
    }

    public async submitFinalPerson(finalPerson: IFinalPerson) {
        if (this.isCompletePerson(finalPerson)) {
            await this.databaseDispatcher.createNewUser(finalPerson);
        } else {
            this.errorToast();
        }
    }

    public async submitFinalEvent(finalEvent: IFinalEventEmpty) {
        this.checkAndSubmitEvent(finalEvent, this.databaseDispatcher.createNewEvent);
    }

    public async updateFinalEvent(finalEvent: IEvent) {
        this.checkAndSubmitEvent(finalEvent, this.databaseDispatcher.updateEvent);
    }

    public returnFooterActions(onClose: () => void, handleSubmit: () => void, isActive?: boolean) {
        return (
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button onClick={onClose} text="Cancel" />
                    <Button intent={Intent.PRIMARY} loading={isActive} onClick={handleSubmit} text="Submit" />
                </div>
            </div>
        )
    }

    public handleAttendeeSelection(selectedEvent: IEvent | IFinalEventEmpty, callback: (key: string, value: any) => void) {
        return (item: IUser) => {
            if (!selectedEvent.attendees.includes(item)) {
                callback("attendees", [item, ...selectedEvent.attendees]);
            } else {
                const finalAttendees = selectedEvent.attendees.slice();
                finalAttendees.splice(finalAttendees.map(a => a.id).indexOf(item.id), 1);
                callback("attendees", finalAttendees);
            }
        }
    }

    private async checkAndSubmitEvent(finalEvent: IFinalEventEmpty | IEvent, callback: (event: IFinalEventChecked | IEvent) => void) {
        if (this.isCompleteEvent(finalEvent)) {
            finalEvent.attendees.push(finalEvent.host);
            await callback(finalEvent);
        } else {
            this.errorToast();
        }
    }

    private errorToast() {
        showToast(Intent.DANGER, "Cannot leave event fields blank/some fields are incorrect.");
        throw new Error("Incorrect fields.");
    }

    private isCompletePerson(finalPerson: IFinalPerson) {
        if (
            finalPerson.name.length > 0 &&
            finalPerson.location.length > 0 &&
            (finalPerson.gender === "F" || finalPerson.gender === "M" || finalPerson.gender === "X")) {
            return true;
        }
        return false;
    }
    
    private isCompleteEvent(finalEvent: IEvent | IFinalEventEmpty): finalEvent is IFinalEventChecked {
        return (
            finalEvent.host !== undefined &&
            finalEvent.attendees.length > 0 &&
            finalEvent.date !== "" &&
            finalEvent.description !== ""
        );
    }
}