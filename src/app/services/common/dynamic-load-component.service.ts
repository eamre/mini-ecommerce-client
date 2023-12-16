import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicLoadComponentService {

  constructor() { }

  async loadComponent(component:ComponentName, viewContainerRef:ViewContainerRef){
    let _component: any = null;

    switch(component){
      case ComponentName.BasketsComponent:
      _component = (await import("../../ui/components/baskets/baskets.component")).BasketsComponent
      break;
    }

    viewContainerRef.clear();
    return viewContainerRef.createComponent((_component))
  }
}

export enum ComponentName{
  BasketsComponent
}

