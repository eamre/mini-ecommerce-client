import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/common/models/user.service';
import { jwtDecode } from "jwt-decode";
import { RoleService } from 'src/app/services/common/models/role.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private roleService: RoleService) { }
  ngOnInit(){

  }

  menuItems = [
    { label: 'Dashboard', link: '/admin', role: '' },
    { label: 'Customers', link: 'customers', role: '' },
    { label: 'Products', link: 'products', role: '' },
    { label: 'Orders', link: 'orders', role: 'Get All Orders Yetkisi'},
    { label: 'Authorize Menu', link: 'authorize-menu', role: '' },
    { label: 'Roles', link: 'roles', role: '' },
    { label: 'Users', link: 'users', role: '' },
    { label: 'Ana Sayfa', link: '', role: '' }
  ];

  roleCheck(role: string):boolean{
    return this.roleService.hasRole(role);
  }
  // hasRole(role: string) {
  //   return role === '' || this.userRoles.includes(role);
  // }
}
