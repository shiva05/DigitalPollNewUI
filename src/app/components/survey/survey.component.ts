import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from 'rxjs';
import { DataService } from "../data.service";


class surveyContent{
}
@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})

export class SurveyComponent implements OnInit {
  message:any;
  surveyDate : Observable<surveyContent[]>;
  candidateSelected=false;
  mlaSelected=false;
  mpSelected=false;
  bypassDev=false;//Toggle to check initial screen be commented
  SelectedMlaArr=[];
  SelectedMpArr=[];
  MlaProblems=[];
  MlaProblemComment:string="";
  MpProblems=[];
  MpProblemComment:string="";
  MlaProblemsContent=[];
  MpProblemsContent=[];
  selectedIndex = 0;  
  selectedMLACandidate="";
  selectedMPCandidate="";
  constructor(private httpClient:HttpClient,private data: DataService) { }

  ngOnInit() {
    if(this.bypassDev==true)
    {
     this.surveyDate = this.httpClient
    .get<surveyContent[]>("https://electionpollapi.azurewebsites.net/api/ElectionPoll/LandingPage?stateID=1&ConstituencyID=294&Pincode=null");       
    }
    else{
    this.data.currentMessage.subscribe(message => this.message = message)   
    this.surveyDate = this.httpClient
    .get<surveyContent[]>("https://electionpollapi.azurewebsites.net/api/ElectionPoll/LandingPage?stateID="+this.message.StateId+"&ConstituencyID="+this.message.ConstituencyId+"&Pincode=null");       
    }
  }

  handleMlaData(){
    this.candidateSelected=true;
    this.mlaSelected=true;    
    this.MlaProblems.length=0;
    this.MlaProblemComment="";
    var MlaProblemsList=document.querySelectorAll(".MLA-wrapper input:checked");   
      this.surveyDate.subscribe(val =>{
        var $Alldetails=this.generateArray(val)[0]["Items"];  
         for (let details of $Alldetails) {
          for(var i=0;i<MlaProblemsList.length;i++){   
            var $value=(<HTMLInputElement>MlaProblemsList[i]).value;    
          if(details.SurveyItemID==$value)
          {
            this.MlaProblems.push(details);
          }
        }
        }    
        });
        (<HTMLElement>document.querySelector(".MP-wrapper .member")).scrollIntoView({ behavior: 'smooth' })
  }
  handleMpData(){
    this.candidateSelected=true;
    this.mpSelected=true;
    this.MpProblems.length=0;
    this.MpProblemComment="";
    var MpProblemsList=document.querySelectorAll(".MP-wrapper input:checked");   
      this.surveyDate.subscribe(val =>{
        var $Alldetails=this.generateArray(val)[0]["Items"];  
         for (let details of $Alldetails) {
          for(var i=0;i<MpProblemsList.length;i++){   
            var $value=(<HTMLInputElement>MpProblemsList[i]).value;    
          if(details.SurveyItemID==$value)
          {
            this.MpProblems.push(details);
          }
        }
        }    
        });         
    this.MpProblemComment=(<HTMLInputElement>document.querySelector(".MP-wrapper textarea")).value;
   
    (<HTMLElement>document.querySelector(".summary-wrap .member")).scrollIntoView({ behavior: 'smooth' })
    

    //(<HTMLElement>document.getElementsByClassName("summary-wrap")[0]).scrollTop += 100;
    
    
  }

  handleMlaSelect(e:Event){
    this.SelectedMlaArr.length=0;
    this.MlaProblems.length=0;
    var $candidateId=(<HTMLElement>event.target).id;
    this.selectedMLACandidate=$candidateId;
    this.surveyDate.subscribe(val =>{
    var $Alldetails=this.generateArray(val)[0]["Assembly"];
     for (let details of $Alldetails) {
      if(details.ElectoralPartyMemberID==$candidateId)
      {
        this.SelectedMlaArr.push(details);
      }
    }    
    });
    
  }

  handleMpSelect(e:Event){
    this.SelectedMpArr.length=0;
    this.MpProblems.length=0;
    var $candidateId=(<HTMLElement>event.target).id;
    this.selectedMPCandidate=$candidateId;
    this.surveyDate.subscribe(val =>{
    var $Alldetails=this.generateArray(val)[0]["MPCandidates"];
     for (let details of $Alldetails) {
      if(details.ElectoralPartyMemberID==$candidateId)
      {
        this.SelectedMpArr.push(details);
      }
    }    
    });
  }
  generateArray(obj){    
    return Object.keys(obj).map((key)=>{ return obj[key]});
 }

 removeMLA(){
  this.mlaSelected=false;
  this.SelectedMlaArr.length=0;
  if(this.mlaSelected == false && this.mpSelected == false)
  {
    this.candidateSelected=false;
  }
 }
 removeMP(){
  this.mpSelected=false;
  this.SelectedMpArr.length=0;   
  if(this.mlaSelected == false && this.mpSelected == false)
  {
    this.candidateSelected=false;
  }
}
clearMlaSelection(){
  this.candidateSelected=false;
  this.mlaSelected=false;  
  this.MlaProblemComment="";
  this.MlaProblems.length=0;
  var $allChecked=document.querySelectorAll(".MLA-wrapper input:checked");
  for(var i=0;i<$allChecked.length;i++){
    (<HTMLInputElement>$allChecked[i]).checked=false;
  }
  (<HTMLInputElement>document.querySelector(".MLA-wrapper textarea")).value="";
}
clearMpSelection(){
  this.candidateSelected=false;
  this.mpSelected=false;  
  this.MpProblemComment="";
  this.MpProblems.length=0;
  var $allChecked=document.querySelectorAll(".MP-wrapper input:checked");
  for(var i=0;i<$allChecked.length;i++){
    (<HTMLInputElement>$allChecked[i]).checked=false;
  }
  (<HTMLInputElement>document.querySelector(".MP-wrapper textarea")).value="";
}



setSelected(id: number) {
  this.selectedIndex = id;
}
selectedMlaCandidate(event) {
  if(document.querySelector(".MLA-wrapper .activeCandidate"))
  {
    document.querySelector(".MLA-wrapper .activeCandidate").classList.remove('activeCandidate');
  }
  event.target.parentNode.parentNode.parentNode.parentNode.classList.add('activeCandidate'); // To ADD

 
}
selectedMpCandidate(event) {
  if(document.querySelector(".MP-wrapper .activeCandidate"))
  {
    document.querySelector(".MP-wrapper .activeCandidate").classList.remove('activeCandidate');
  }
  event.target.parentNode.parentNode.parentNode.parentNode.classList.add('activeCandidate'); // To ADD
 
}

submitVote(){
  
  var probArr=[];
  for(let problem of this.MlaProblems){
    probArr.push(problem.SurveyItemID)
  }
  console.log(probArr,this.message.ProfileId);
  console.log(this.MlaProblemComment);
  
  console.log(this.selectedMPCandidate,this.selectedMLACandidate,this.SelectedMlaArr,this.SelectedMpArr)
}
}

