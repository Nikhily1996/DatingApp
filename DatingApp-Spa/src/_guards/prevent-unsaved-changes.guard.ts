import { Injectable } from "@angular/core";
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MemberEditComponent } from 'src/app/members/member-edit/member-edit.component';

Injectable({
    providedIn:'root'
})
export class PreventUnsavedChanges implements CanDeactivate<MemberEditComponent>{
    canDeactivate(component: MemberEditComponent): boolean  {
       if(component.editForm.dirty){
           return confirm('any unsaved changes will be lost!');
       }
       return true;
    }

}