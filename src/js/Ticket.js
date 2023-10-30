export default class Ticket {
    constructor({ id, name, description, status, created }) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.status = status;
      this.created = created;
    }

    isDone() {
      if(this.status === true) {
        return 'checked';
      } else {
        return '';
      }
    }
    
    get markup() {
     
      return `
        <div class="ticket" id="${this.id}">
      <div class="ticket-intro">
        <div class="ticket-checkbox ${this.isDone()}"></div>
      <h2 class="ticket-title">${this.name}</h2>
      <span class="ticket-date">${new Date(this.created).toLocaleString('ru-RU')}</span>
      <div class="ticket-buttons">
      <input type="button" id="ticket-button-edit" name="ticket-button-edit" class="ticket-button-edit">
      <input type="button" id="ticket-button-remove" name="ticket-button-remove" class="ticket-button-remove">
      </div>
      </div>
      <div class="ticket-content unactive">${this.description}</div>
    </div>`;
      }
  }