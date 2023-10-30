import Ticket from './Ticket';
import TicketService from './TicketService';

export default class HelpDesk {
    constructor(document, url) {
      this.ticketContainer = document.querySelector('.ticket-container');
      this.addTicketButton = document.querySelector('.add-ticket-button');
      this.addModal = document.querySelector('.add');
      this.editModal = document.querySelector('.edit');
      this.removeModal = document.querySelector('.remove');
      this.addModalCloseButton = document.getElementById('add-modal-close');
      this.addModalOkButton = document.getElementById('add-modal-ok');
      this.ticketContainer = document.querySelector('.ticket-container');
      this.addModalTitle = document.getElementById('add-modal-title');
      this.addModalContent = document.getElementById('add-modal-content');
      this.editModalTitle = document.getElementById('edit-modal-title');
      this.editModalContent = document.getElementById('edit-modal-content');
      this.editModalCloseButton = document.getElementById('edit-modal-close');
      this.editModalOkButton = document.getElementById('edit-modal-ok');
      this.removeModalCloseButton = document.getElementById('remove-modal-close');
      this.removeModalOkButton = document.getElementById('remove-modal-ok');

      this.ticketService = new TicketService(url);
    }

    
    
    pageLoading() {
      this.ticketRendering();
      this.addModalActivator();
      this.closeAddModal();
      this.addTicket();
      this.removeTicket();
      this.editModalActivator();
      this.ticketContentActivator();
      this.checkTicket();
    }

    async ticketRendering() {
      let ticketList = await this.ticketService.list();
      
      ticketList.forEach(el => {
        
        let newTicket = new Ticket(el);

        this.ticketContainer.insertAdjacentHTML('beforeend', newTicket.markup);
      });
    }

    addModalActivator() {
     this.addTicketButton.addEventListener('click', () => {
       this.addModal.classList.remove('unactive');
     });
    }

    closeAddModal() {
      this.addModalCloseButton.addEventListener('click', () => {
        this.addModal.classList.add('unactive');
      });
    }

    addTicket() {
      this.addModalOkButton.addEventListener('click', async () => {

        let data = {name: this.addModalTitle.value, description: this.addModalContent.value};
        let newTicket = new Ticket(await this.ticketService.create(data));

        this.ticketContainer.insertAdjacentHTML('beforeend', newTicket.markup);
        this.addModal.classList.add('unactive');
        this.addModalTitle.value = '';
        this.addModalContent.value = '';
      });
    }

    removeTicket() {
      let actualTicket;
      let ticketId;

      this.ticketContainer.addEventListener('click', (e) => {
          if(e.target.classList.contains('ticket-button-remove')) {
            actualTicket = e.target.closest('.ticket');
            ticketId = actualTicket.id;

            this.removeModal.classList.remove('unactive');
          }
      });

      this.removeModalCloseButton.addEventListener('click', () => {
        this.removeModal.classList.add('unactive');
      });

      this.removeModalOkButton.addEventListener('click', async () => {
        actualTicket.remove();
        await this.ticketService.delete(ticketId);
        
        this.removeModal.classList.add('unactive');
      });
    }

    editModalActivator() {
      let actualTicket; 
      let ticketId;
      
      this.ticketContainer.addEventListener('click', (e) => { 
        if(e.target.classList.contains('ticket-button-edit')) {
            actualTicket = e.target.closest('.ticket');
            ticketId = actualTicket.id;

            this.editModal.classList.remove('unactive');
            this.editModalTitle.value = actualTicket.querySelector('.ticket-title').textContent;
            this.editModalContent.value = actualTicket.querySelector('.ticket-content').textContent;
          }
      });

      this.editModalCloseButton.addEventListener('click', () => {
          actualTicket.querySelector('.ticket-title').textContent = this.editModalTitle.value;
          this.editModal.classList.add('unactive');
      });

      this.editModalOkButton.addEventListener('click', async () => {
        let newName = this.editModalTitle.value;
        let newDescription = this.editModalContent.value;
        let data = {name: newName, description: newDescription};
        
        await this.ticketService.update(ticketId, data);
        actualTicket.querySelector('.ticket-title').textContent = newName;
        actualTicket.querySelector('.ticket-content').textContent = newDescription;

        this.editModal.classList.add('unactive');
    });
    }

    ticketContentActivator() {
      this.ticketContainer.addEventListener('click', (e) => {
        if(e.target.classList.contains('ticket-intro') || 
          e.target.classList.contains('ticket-title')) {
          e.target.closest('.ticket').querySelector('.ticket-content').classList.toggle('unactive');
        }
    });
    }

    checkTicket() {
      let actualTicket;
      let ticketId;

      this.ticketContainer.addEventListener('click', async (e) => {
          if(e.target.classList.contains('ticket-checkbox')) {
            actualTicket = e.target.closest('.ticket');
            ticketId = actualTicket.id;
            
            if(e.target.classList.contains('checked')) {
              e.target.classList.remove('checked');

              await this.ticketService.update(ticketId, {status: false});
              console.log(this.ticketService.list());
            } else {
              e.target.classList.add('checked');

              await this.ticketService.update(ticketId, {status: true});
              console.log(this.ticketService.list());
            }
          }
      });
    }

  }