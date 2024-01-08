import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/base/base.component';
import { Action, Menu } from 'src/app/contracts/application-config/menu';
import { AuthorizeMenuDialogComponent } from 'src/app/dialogs/authorize-menu-dialog/authorize-menu-dialog.component';
import { DialogService } from 'src/app/services/common/dialog.service';
import { ApplicationService } from 'src/app/services/common/models/application.service';

@Component({
  selector: 'app-authorize-menu',
  templateUrl: './authorize-menu.component.html',
  styleUrls: ['./authorize-menu.component.scss']
})

export class AuthorizeMenuComponent extends BaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    private applicationService: ApplicationService,
    private dialogService:DialogService) {
    super(spinner);
  }

  async ngOnInit(): Promise<void> {
    this.dataSource.data = (await this.applicationService.getAuthorizeDefinitionEndPoints())
      .map(menu => {
        const treeMenu: ITreeMenu = {
          name: menu.name,
          actions: menu.actions.map(action => ({
            name: action.definition,
            code: action.code,
          })),
        };
        return treeMenu;
      });
  }

  assignRole(code: string, name:string){
    this.dialogService.openDialog({
      compontentType: AuthorizeMenuDialogComponent,
      data: {code, name},
      options:{
        width:"70em"
      },
      afterClosedDialog:()=>{

      }
    })
  }

  private _transformer = (treeMenu: ITreeMenu, level: number) => {
    return {
      expandable: !!treeMenu.actions && treeMenu.actions.length > 0, // eğer actions array'i varsa ve boş değilse, expandable true olur
      name: treeMenu.name,
      level: level,
      code: treeMenu.code
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.actions
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

interface ITreeMenu{
  name?:string;
  actions?: ITreeMenu[]
  code?:string
}

