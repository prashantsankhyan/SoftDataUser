import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-navbar',
 imports: [CommonModule,MatSidenavModule,MatMenuModule,MatIconModule ,MatButtonModule ,RouterOutlet,RouterLink,RouterModule],
  templateUrl: './dashboard-navbar.html',
  styleUrl: './dashboard-navbar.scss',
})
export class DashboardNavbar {
AccountId:any;
  userName:any;
  showFiller = true;
  nameOfTeam:any
  showSaleTeam = false;
  showClaimTeam = false;
  showSubmissionTeam =false;
  showTransactionTeam = false;
  isDropdownOpen: boolean = false;
   isDropdownOtherOpen: boolean = false;
  isNameDropdownOpen: boolean = false;
  isTransactionDropdownOpen: boolean = false;
  isLedgerTransaction: boolean = false;
  constructor(private router: Router,private el: ElementRef, private renderer: Renderer2,) {
    
   }

 
  ngOnInit(){
    this.userName = sessionStorage.getItem('UserName')
    this.getNameOfTeam()
  }
 
 toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
  this.isDropdownOtherOpen = false; // close other
    this.isLedgerTransaction = false;
    
}

toggleDropdownAnothrMenu() {
  this.isDropdownOtherOpen = !this.isDropdownOtherOpen;
  this.isDropdownOpen = false; // close first
  this.isTransactionDropdownOpen = false
 
   
     this.isLedgerTransaction = false;
       
}
  toggleDropdownForName() {
    this.isNameDropdownOpen = !this.isNameDropdownOpen;
    this.isTransactionDropdownOpen = false;
    this.isLedgerTransaction = false;

  }


  toggleTransaction(){
    this.isTransactionDropdownOpen = !this.isTransactionDropdownOpen
     this.isDropdownOtherOpen = false; // close other
     this.isLedgerTransaction = false
      this.isDropdownOpen = false; // close first
  }
    toggleLadger(){
    this.isLedgerTransaction = !this.isLedgerTransaction
     this.isDropdownOtherOpen = false; // close other
      this.isDropdownOpen = false; // close first
       this.isTransactionDropdownOpen  = false
  }
 
 

  getNameOfTeam(){
  this.nameOfTeam =  localStorage.getItem('teamName')
  
  if(this.nameOfTeam == 'Sale Team') {
    this.showSaleTeam = true

  }else if (this.nameOfTeam == 'Submission Team') {
    this.showSubmissionTeam = true

  }else if (this.nameOfTeam == 'Claim Team') {
    this.showClaimTeam = true;


  }else if (this.nameOfTeam == 'Transaction Team') {
   
    this.showTransactionTeam = true;

  }
 
  }
  logout() {
   
    const userData = {
      userName: sessionStorage.getItem('UserName'),
      Password: sessionStorage.getItem('Password')
    };
   
    
  }

  // logout(){
  //   this.router.navigate(['/login'])

  // }


  addAccountDetail(data:any) {
    
   
  }
}
