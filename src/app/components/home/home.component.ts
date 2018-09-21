import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import {Observable} from 'rxjs';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

class candidate{
   
}
class Constitute{   
}
class stateClass{
}
class landingPageData{

}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
    model: any = {};
    pmCandidate : Observable<candidate[]>;
    Constituency: Observable<Constitute[]>;
    stateDetails:Observable<stateClass[]>;
    landingContent:Observable<landingPageData[]>;
    registerForm: FormGroup;    
    submitted = false;
    registernotrequired:FormGroup;
  constructor(private httpClient:HttpClient,private formBuilder: FormBuilder) {
    
   }
   
      
   ngOnInit() {
    this.registerForm = this.formBuilder.group({
        FirstName: ['', Validators.required],       
        Email: ['', [Validators.required, Validators.email]],
        MobNumber: ['', [Validators.required]],
        StateID: ['', [Validators.required]],
        ConstituencyID:['',[Validators.required]],
        PincodeID:[null],
        optionsRadios:['', [Validators.required]],
        PhoneAuthTokenInd:[null]
    });
    
    
    this.Constituency = this.httpClient
            .get<Constitute[]>("https://electionpollapi.azurewebsites.net/api/ElectionPoll/GetConstituency");
    this.stateDetails=this.httpClient
            .get<stateClass[]>("https://electionpollapi.azurewebsites.net/api/ElectionPoll/GetAllstate");

    this.landingContent = this.httpClient
        .get<landingPageData[]>("https://electionpollapi.azurewebsites.net/api/ElectionPoll/LandingPage?stateID=1&ConstituencyID=294&Pincode=null");
  }
  
 
  get f() { return this.registerForm.controls; }  

  
  numberOnly(event): boolean {      
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {        
      return false;
    }
    if((event.target.value.length)>9)
     {
         return false;
     }
    
    return true;

  }

  getDetails(e:Event){   
    this.submitted = true; 
    this.registerForm["PhoneAuthTokenInd"]=1; 
    delete this.registerForm.value["optionsRadios"];              
    this.httpClient.post("https://electionpollapi.azurewebsites.net/api/ElectionPoll/SaveProfile", this.registerForm.value)
         .subscribe(
             data => {   
                 if(data==1)
                 {
                    this.loadLandingPageData();
                    document.getElementById("#myModal").style.display="none";
                    //document.querySelector(".modal-backdrop").style.display="none";                   
                 }
                 if(data==0)
                 {
                    this.showAuthError();
                 }
             },
             error => {
                 console.log("Error", error);
             }
         );
 
     }

     loadLandingPageData(){        
        this.landingContent = this.httpClient
            .get<landingPageData[]>("https://electionpollapi.azurewebsites.net/api/ElectionPoll/LandingPage?stateID="+this.registerForm.value["StateID"]+"&ConstituencyID="+this.registerForm.value["ConstituencyID"]+"&Pincode=null");
     }
     showAuthError(){
         alert("something went wrong");
     }

}
