import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

export class BaseComponent {
  constructor(private spinner: NgxSpinnerService) {}

  showSpinner(spinnerType:SpinnerType){
    this.spinner.show(spinnerType);

    // setTimeout(() => {
    //   this.spinner.hide(spinnerType);
    // }, 1600);
  }

  hideSpinner(spinnerType:SpinnerType){
    this.spinner.hide(spinnerType);
  }
}

export enum SpinnerType{
  BallAtom = "s1",
  BallScaleMultiple ="s2",
  BallSpinClockwiseFadeRotating = "s3"
}
