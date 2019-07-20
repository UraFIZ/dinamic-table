import { join } from 'path';
import { _ } from 'core-js';
const tableBody = document.querySelector('div > table > tbody');
const trTag = [...document.querySelector('div > table > thead > tr').children];
let sortDirection = true;
const modalContainer = document.querySelector('body > div > div');
const form = document.querySelector('body > div > div > form');
const closeBtn = document.querySelector('body > div > div > form > div');
const submitBtn = document.querySelector('body > div > div > form > button');
const openModal = document.querySelector('body > div > button');
const addititnolInfoModal = document.querySelector(
  'body > div.wrapper > div.additinolInfo'
);
const aditinolInfoAddress = document.querySelector(
  'body > div > div.additinolInfo > div.address > span'
);
const aditinolInfoCompany = document.querySelector(
  'body > div > div.additinolInfo > div.company'
);
const closeBtnAditinolInfo = document.querySelector(
  'body > div > div.additinolInfo > div.closeAddinfo'
);

const submitObj = {
  address: {},
  company: {},
};
class Business {
  getBusiness() {
    try {
      let result = fetch('https://jsonplaceholder.typicode.com/users').then(
        res => res.json()
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
class UI {
  constructor() {
    // this.getFilltred = this.getFilltred.bind(this);
    this.consoleData = this.consoleData.bind(this);
  }
  consoleData(dafta) {
    console.log(dafta);
  }
  displayData(data) {
    // if (Storage.getCompany != '') {
    //   data = Storage.getCompany();
    //   console.log(data);
    // }
    let result = '';
    data.forEach(product => {
      const { name } = product.company;
      const { city, street, suite } = product.address;
      result += `
        <tr/>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.username}</td>
        <td>${product.email}</td>
        <td>${product.website}</td>
        <td class="delete">delete</td>
        <tr/>
   `;
    });
    tableBody.innerHTML = result;
  }
  getFilltred(data) {
    trTag.forEach(item => {
      item.addEventListener('click', () => {
        let thisText = item.innerHTML.toLocaleLowerCase().replace(/ +/g, '');
        if (sortDirection) {
          sortDirection = false;
        } else {
          sortDirection = true;
        }
        console.log(sortDirection);
        switch (this.getTypeOf(data, item)) {
          case 'number':
            this.sortNumberColumn(data, sortDirection, thisText);
            break;
          case 'string':
            this.sortStringColumn(data, sortDirection, thisText);
            break;
        }
      });
    });
  }
  getTypeOf(data, item) {
    let getType = typeof data[0][
      item.innerHTML.toLocaleLowerCase().replace(/ +/g, '')
    ];
    return getType;
  }
  sortNumberColumn(data, isSort, columnN) {
    data.sort((a, b) => {
      return isSort ? a[columnN] - b[columnN] : b[columnN] - a[columnN];
    });

    this.displayData(data);
    // Storage.saveCompany(data);
  }
  sortStringColumn(data, isSort, columnN) {
    data.sort((a, b) => {
      if (isSort) {
        if (a[columnN] < b[columnN]) {
          return -1;
        }
        if (a[columnN] > b[columnN]) {
          return 1;
        }
      } else {
        if (a[columnN] < b[columnN]) {
          return 1;
        }
        if (a[columnN] > b[columnN]) {
          return -1;
        }
      }
    });
    this.displayData(data);
    // Storage.saveCompany(data);
  }
  workingWithModal(data) {
    openModal.addEventListener('click', () => {
      modalContainer.style.display = 'flex';
    });
    closeBtn.addEventListener('click', () => {
      modalContainer.style.display = 'none';
    });
    submitBtn.addEventListener('click', e => {
      e.preventDefault();
      let id = 10;
      const city = document.querySelector('#city').value;
      const street = document.querySelector('#street').value;
      const suite = document.querySelector('#suite').value;
      const zipcode = document.querySelector('#zipcode').value;
      const compName = document.querySelector('#compName').value;
      const bs = document.querySelector('#bs').value;
      const email = document.querySelector('#email').value;
      const subName = document.querySelector('#subName').value;
      const phone = document.querySelector('#phone').value;
      const userName = document.querySelector('#userName').value;
      const website = document.querySelector('#website').value;
      if (
        city &&
        street &&
        suite &&
        zipcode &&
        compName &&
        bs &&
        email &&
        subName &&
        phone &&
        userName &&
        website
      ) {
        submitObj.address['city'] = city;
        submitObj.address['street'] = street;
        submitObj.address['suite'] = suite;
        submitObj.address['zipcode'] = zipcode;
        submitObj.company['bs'] = bs;
        submitObj.company['name'] = compName;
        submitObj['email'] = email;
        submitObj['id'] = ++id;
        submitObj['name'] = subName;
        submitObj['phone'] = phone;
        submitObj['username'] = userName;
        submitObj['website'] = website;
        data = [...data, submitObj];
        console.log(data);
        modalContainer.style.display = 'none';
        this.displayData(data);
        // Storage.saveCompany(data);
      } else {
        e.preventDefault();
      }
    });
  }
  deleteCompany(data) {
    const deleteBtn = document.querySelectorAll(
      'body > div > table > tbody > tr > td.delete'
    );
    deleteBtn.forEach(item => {
      item.addEventListener('click', chrc => {
        const idOfTag = item.parentElement.firstElementChild.textContent;
        return item.parentElement.remove();
      });
    });
  }
  openModalWithAdditinolInfo(data) {
    const clickablePlices = [
      ...document.querySelectorAll(
        'body > div > table > tbody > tr:not(:first-child) > td:not(.delete) '
      ),
    ];

    clickablePlices.forEach(item => {
      item.addEventListener('dblclick', () => {
        addititnolInfoModal.style.display = 'flex';
        closeBtnAditinolInfo.addEventListener('click', () => {
          addititnolInfoModal.style.display = 'none';
        });
        const idOfAdditinolInfo =
          item.parentElement.firstElementChild.textContent;
        const currentObjForAdd = data.find(item => {
          return item['id'] == idOfAdditinolInfo;
        });
        const {
          address: { city, street, suite },
          company: { bs },
        } = currentObjForAdd;

        aditinolInfoAddress.innerHTML = ` The current address is following: city ${city} street: ${street} suite: ${suite}  `;
        aditinolInfoCompany.innerHTML = `Some shit ${bs}`;
      });
    });
  }
}

class Storage {
  static saveCompany(companies) {
    localStorage.setItem('companies', JSON.stringify(companies));
  }
  static deleteCompany(id) {
    let company = JSON.parse(localStorage.getItem('companies'));
    return products.find(product => product.id === id);
  }
  static getCompany() {
    return localStorage.getItem('companies')
      ? JSON.parse(localStorage.getItem('companies'))
      : '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const business = new Business();
  const ui = new UI();
  business.getBusiness().then(data => {
    ui.displayData(data.slice(0, 10));
    ui.getFilltred(data);
    ui.consoleData(data);
    ui.workingWithModal(data);
    ui.deleteCompany(data);
    ui.openModalWithAdditinolInfo(data);
    // Storage.saveCompany(data);
  });
});
