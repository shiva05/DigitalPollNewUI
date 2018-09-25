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
  constructor(private httpClient:HttpClient,private data: DataService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message)
    this.surveyDate = this.httpClient
    .get<surveyContent[]>("https://electionpollapi.azurewebsites.net/api/ElectionPoll/LandingPage?stateID="+this.message.StateId+"&ConstituencyID="+this.message.ConstituencyId+"&Pincode=null");       
  }

  
}
