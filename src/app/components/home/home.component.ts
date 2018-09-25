import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import {Observable} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { DataService } from "../data.service";

class candidate{
   
}

interface Constitute {
    StateID:any;
    
    ConstituencyID: any;
    ConstituencyName: any;
  
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
    validUser=true;
    bypassDev=false;//Toggle to check initial screen be commented
    StateId="";
    ConstituencyId="";
    message:any ={};
    
  constructor(private httpClient:HttpClient,private formBuilder: FormBuilder,private data: DataService) {
    
   }
   mobValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value !== undefined &&  control.value.length < 10) {        
        return { 'mobVal': true };
    }
    else{
        return null;
    }
    
    }
      
   ngOnInit() {
    this.registerForm = this.formBuilder.group({
        FirstName: ['', Validators.required],       
        Email: ['', [Validators.required, Validators.email]],
        MobNumber: ['', [this.mobValidator]],
        StateID: ['', [Validators.required]],
        ConstituencyID:[''],
        PincodeID:[null],
        optionsRadios:[''],
        PhoneAuthTokenInd:[null],
       
    });
   
    this.stateDetails=this.httpClient
            .get<stateClass[]>("https://electionpollapi.azurewebsites.net/api/ElectionPoll/GetAllstate");

    if(this.bypassDev==true)
    {
    this.landingContent = this.httpClient
        .get<landingPageData[]>("https://electionpollapi.azurewebsites.net/api/ElectionPoll/LandingPage?stateID=1&ConstituencyID=294&Pincode=null");
    this.validUser=false;
    }
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
  stateChange(e){
      var $selStateIndex=e.selectedIndex;
      var stateId = e[$selStateIndex].value;
    this.Constituency = this.httpClient
            .get<Constitute[]>("https://electionpollapi.azurewebsites.net/api/ElectionPoll/GetConstituency")
            .pipe(
    map((model: any) => {        
      var stateArr=[];
      for (let item of model) {
        if(item.StateID==stateId){
            stateArr.push(item);
        }
    }
      return stateArr;
    })
    
  );
  }
  
  getDetails(e:Event){   
    this.submitted = true; 
     if (this.registerForm.invalid) {        
         console.log("auth fail");
     //return;
         }
    else{
        this.registerForm["PhoneAuthTokenInd"]=1;         
        delete this.registerForm.value["optionsRadios"];            
        this.httpClient.post("https://electionpollapi.azurewebsites.net/api/ElectionPoll/SaveProfile", this.registerForm.value)
         .subscribe(             
             data => {   
                 if(data>1)
                 {
                    console.log("success");
                    this.loadLandingPageData();   
                 }
                 if(data==0)
                 {
                    this.showAuthError();
                    console.log("success")
                 }
             },
             error => {
                 console.log("Error", error);
             }
         );
    }
    
    
            
     }
     
     loadLandingPageData(){        
        this.landingContent = this.httpClient
            .get<landingPageData[]>("https://electionpollapi.azurewebsites.net/api/ElectionPoll/LandingPage?stateID="+this.registerForm.value["StateID"]+"&ConstituencyID="+this.registerForm.value["ConstituencyID"]+"&Pincode=null");
        console.log("https://electionpollapi.azurewebsites.net/api/ElectionPoll/LandingPage?stateID="+this.registerForm.value["StateID"]+"&ConstituencyID="+this.registerForm.value["ConstituencyID"]+"&Pincode=null");
        this.validUser=false;
        this.StateId= this.registerForm.value["StateID"];   
        this.ConstituencyId=this.registerForm.value["ConstituencyID"];          
        return false;
     }
     newMessage() {
        this.message["StateId"]=this.StateId;        
        this.message["ConstituencyId"]=this.ConstituencyId;        
        this.data.changeMessage(this.message)       
      }
     showAuthError(){
         alert("something went wrong");
     }

}
