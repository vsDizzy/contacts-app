import { Component, OnInit } from '@angular/core'
import { API } from 'aws-amplify'

@Component({
  selector: 'contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  contacts

  getId(c) {
    return c.id
  }

  async ngOnInit() {
    this.contacts = await API.get('api', '/subscriber', {})
  }
}
