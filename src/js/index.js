import { join } from 'path';
import { _ } from 'core-js';
const tableBody = document.querySelector('div > table > tbody');
const trTag = [...document.querySelector('div > table > thead > tr').children];
let sortDirection = true;
const modalContainer = document.querySelector('body > div > div>form');
const form = document.querySelector('body > div > div > form');
const closeBtn = document.querySelector('body > div > div > form > div');
const submitBtn = document.querySelector('body > div > div > form > button');
const clearFormData = document.querySelector(
  'body > div > div.modal-content > form > div.clear'
);
const openModal = document.querySelector('body > div > button');
const addititnolInfoModal = document.querySelector(
  'body > div.wrapper > div.additinolInfo'
);
const aditinolInfoAddress = document.querySelector(
  'body > div > div.additinolInfo > div.address > span:nth-child(2)'
);
const aditinolInfoCompany = document.querySelector(
  'body > div > div.additinolInfo > div.company > span:nth-child(2)'
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
  displayData(data) {
    let mmm =
      JSON.parse(localStorage.getItem('companies')) === null
        ? data
        : JSON.parse(localStorage.getItem('companies'));
    let result = '';
    mmm.forEach(product => {
      result += `
        <tr/>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.username}</td>
        <td>${product.email}</td>
        <td>${product.website}</td>
        <td class="delete"><i class="fas fa-trash"></i></td>
        <tr/>
   `;
    });
    tableBody.innerHTML = result;
    this.openModalWithAdditinolInfo(data);
    this.addNewCompany(data);
    this.deleteCompany(data);
    // this.getFilltred(data);
  }
  getFilltred(data) {
    let dataForFilter =
      JSON.parse(localStorage.getItem('companies')) === null
        ? data
        : JSON.parse(localStorage.getItem('companies'));
    trTag.forEach(item => {
      item.addEventListener('click', () => {
        let thisText = item.innerHTML.toLocaleLowerCase().replace(/ +/g, '');
        if (sortDirection) {
          sortDirection = false;
        } else {
          sortDirection = true;
        }
        switch (this.getTypeOf(dataForFilter, item)) {
          case 'number':
            this.sortNumberColumn(dataForFilter, sortDirection, thisText);
            break;
          case 'string':
            this.sortStringColumn(dataForFilter, sortDirection, thisText);
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
    Storage.saveCompany(data);
    this.openModalWithAdditinolInfo(data);
    this.displayData(data);
    this.deleteCompany(data);
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
    Storage.saveCompany(data);
    this.displayData(data);
    this.openModalWithAdditinolInfo(data);
    this.deleteCompany(data);
  }
  addNewCompany(data) {
    let dataForAdding =
      JSON.parse(localStorage.getItem('companies')) === null
        ? data
        : JSON.parse(localStorage.getItem('companies'));
    openModal.addEventListener('click', () => {
      modalContainer.style.display = 'flex';
    });
    closeBtn.addEventListener('click', () => {
      modalContainer.style.display = 'none';
    });
    clearFormData.addEventListener('click', () => {
      city.value = '';
      street.value = '';
      suite.value = '';
      zipcode.value = '';
      compName.value = '';
      bs.value = '';
      email.value = '';
      subName.value = '';
      phone.value = '';
      userName.value = '';
      website.value = '';
    });
    submitBtn.addEventListener('click', e => {
      e.preventDefault();
      let id = Math.round(Math.random() * 100);
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
        submitObj['id'] = id;
        submitObj['name'] = subName;
        submitObj['phone'] = phone;
        submitObj['username'] = userName;
        submitObj['website'] = website;
        dataForAdding = [...dataForAdding, submitObj];
        modalContainer.style.display = 'none';
        Storage.saveCompany(dataForAdding);
        this.displayData(dataForAdding);
        this.getFilltred(dataForAdding);
      } else {
        e.preventDefault();
      }
    });
  }
  deleteCompany(data) {
    let dataForDelete =
      JSON.parse(localStorage.getItem('companies')) === null
        ? data
        : JSON.parse(localStorage.getItem('companies'));
    const deleteBtn = document.querySelectorAll(
      'body > div > table > tbody > tr > td.delete'
    );
    deleteBtn.forEach(item => {
      item.addEventListener('click', () => {
        const idOfTag = item.parentElement.firstElementChild.textContent;
        const currentData = dataForDelete.findIndex(cher => {
          return cher.id == idOfTag;
        });
        dataForDelete = [
          ...dataForDelete.slice(0, currentData),
          ...dataForDelete.slice(currentData + 1),
        ];

        Storage.saveCompany(dataForDelete);
        this.displayData(dataForDelete);
        this.getFilltred(dataForDelete);
      });
    });
  }
  openModalWithAdditinolInfo(data) {
    let dataForAdditinolInfo =
      JSON.parse(localStorage.getItem('companies')) === null
        ? data
        : JSON.parse(localStorage.getItem('companies'));
    const clickablePlices = [
      ...document.querySelectorAll(
        'body > div > table > tbody > tr > td:not(.delete) '
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
        const currentObjForAdd = dataForAdditinolInfo.find(item => {
          return item['id'] == idOfAdditinolInfo;
        });
        const {
          address: { city, street, suite },
          company: { bs },
        } = currentObjForAdd;
        aditinolInfoAddress.innerHTML = ` The current address is following: city ${city} street: ${street} suite: ${suite}  `;
        aditinolInfoCompany.innerHTML = `The following info ${bs}`;
      });
    });
  }
}

class Storage {
  static saveCompany(companies) {
    localStorage.setItem('companies', JSON.stringify(companies));
  }
  static deleteCompany(id) {
    let companies = JSON.parse(localStorage.getItem('companies'));
    return companies.filter(company => company.id === id);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const business = new Business();
  const ui = new UI();
  business.getBusiness().then(data => {
    ui.displayData(data);
    ui.getFilltred(data);
    ui.addNewCompany(data);
    ui.deleteCompany(data);
    ui.openModalWithAdditinolInfo(data);
    ui.deleteCompany(data);
  });
});
