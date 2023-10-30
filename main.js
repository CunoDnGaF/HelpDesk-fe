/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/Ticket.js
class Ticket {
  constructor(_ref) {
    let {
      id,
      name,
      description,
      status,
      created
    } = _ref;
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.created = created;
  }
  isDone() {
    if (this.status === true) {
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
;// CONCATENATED MODULE: ./src/js/api/createRequest.js
const createRequest = async function (url, method) {
  let data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  try {
    let response;
    let actualMethod;
    if (method === 'allTickets' || method.startsWith('delete') || method.startsWith('ticket')) {
      actualMethod = method;
    }
    switch (method) {
      case 'createTicket':
        response = await fetch(`${url}?method=${method}`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            ...headers
          }
        });
        break;
      case 'updateById':
        response = await fetch(`${url}?method=${method}&id=${data.id}`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            ...headers
          }
        });
        break;
      case 'allTickets':
      case 'ticketById':
      case 'deleteById':
        {
          const queryString = new URLSearchParams(actualMethod ? data : {}).toString();
          response = await fetch(`${url}?method=${method}${queryString ? `&${queryString}` : ''}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...headers
            }
          });
          break;
        }
      default:
        console.error('Метод не существует');
        return null;
    }
    if (response.ok) {
      return method === 'deleteById' ? 'success' : await response.json();
    }
    console.error(`Ошибка сервера: ${response.statusText}`);
    return null;
  } catch (error) {
    console.error('Ошибка сети:', error);
    return null;
  }
};
/* harmony default export */ const api_createRequest = (createRequest);
;// CONCATENATED MODULE: ./src/js/TicketService.js


/**
 *  Класс для связи с сервером.
 *  Содержит методы для отправки запросов на сервер и получения ответов
 * */
class TicketService {
  constructor(url) {
    this.url = url;
  }
  list() {
    return api_createRequest(this.url, 'allTickets');
  }
  get(id) {
    return api_createRequest(this.url, 'ticketById', {
      id
    });
  }
  create(data) {
    return api_createRequest(this.url, 'createTicket', data);
  }
  update(id, data) {
    return api_createRequest(this.url, 'updateById', {
      ...data,
      id
    });
  }
  delete(id) {
    return api_createRequest(this.url, 'deleteById', {
      id
    });
  }
}
;// CONCATENATED MODULE: ./src/js/HelpDesk.js


class HelpDesk {
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
      let data = {
        name: this.addModalTitle.value,
        description: this.addModalContent.value
      };
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
    this.ticketContainer.addEventListener('click', e => {
      if (e.target.classList.contains('ticket-button-remove')) {
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
    this.ticketContainer.addEventListener('click', e => {
      if (e.target.classList.contains('ticket-button-edit')) {
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
      let data = {
        name: newName,
        description: newDescription
      };
      await this.ticketService.update(ticketId, data);
      actualTicket.querySelector('.ticket-title').textContent = newName;
      actualTicket.querySelector('.ticket-content').textContent = newDescription;
      this.editModal.classList.add('unactive');
    });
  }
  ticketContentActivator() {
    this.ticketContainer.addEventListener('click', e => {
      if (e.target.classList.contains('ticket-intro') || e.target.classList.contains('ticket-title')) {
        e.target.closest('.ticket').querySelector('.ticket-content').classList.toggle('unactive');
      }
    });
  }
  checkTicket() {
    let actualTicket;
    let ticketId;
    this.ticketContainer.addEventListener('click', async e => {
      if (e.target.classList.contains('ticket-checkbox')) {
        actualTicket = e.target.closest('.ticket');
        ticketId = actualTicket.id;
        if (e.target.classList.contains('checked')) {
          e.target.classList.remove('checked');
          await this.ticketService.update(ticketId, {
            status: false
          });
          console.log(this.ticketService.list());
        } else {
          e.target.classList.add('checked');
          await this.ticketService.update(ticketId, {
            status: true
          });
          console.log(this.ticketService.list());
        }
      }
    });
  }
}
;// CONCATENATED MODULE: ./src/js/app.js

const url = 'http://localhost:3000/';
const widget = new HelpDesk(document, url);
widget.pageLoading();
;// CONCATENATED MODULE: ./src/index.js



// TODO: write your code in app.js
/******/ })()
;