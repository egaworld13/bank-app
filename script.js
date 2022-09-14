'use strict';

/////////////////////////////////////////////////

//* DATA
const account1 = {
  owner: 'Edgars Roze',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-09-11T17:01:17.194Z',
    '2022-09-13T23:36:17.929Z',
    '2022-09-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'lv-LV',
};

const account2 = {
  owner: 'Ilona Roze',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2022-06-25T18:49:59.371Z',
    '2022-09-13T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

//? ELEMENTS
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////* FUNCTIONALITY

//?CREATE USERNAME FOR OWNERS = Edgars Roze =er;

const createUserNames = function (accs) {
  accs.forEach(function (ele) {
    ele.username = ele.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUserNames(accounts);

//? LOGIN

let currenAccount;
btnLogin.addEventListener('click', function (e) {
  //Prevent form from btn submiting( when click on btn page is reloaded and we can' see info)
  // So I use .preventDefault();
  e.preventDefault();
  //Assign loged in acc to variable, so i can use it in others func.
  currenAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // currentAccount will be compared if its exsist '?' <= optional chaining and if its same  as input!
  if (currenAccount?.pin === Number(inputLoginPin.value)) {
    //?DISPLAY USER AND WELCOME MSG

    labelWelcome.textContent = `Welcome back ${
      // split name and username , takes first arr element! => name
      currenAccount.owner.split(' ')[0]
    }`;
    //make user content visible
    containerApp.style.opacity = 100;
    //clear input fields after login
    inputLoginUsername.value = inputLoginPin.value = '';
    inputClosePin.blur();

    //UPDATE UI func call; => mov/summ/balance func
    updateUI(currenAccount);
  }
});

//?MOVEMENTS
// sort =false ->default value.
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; // empty the movements container..
  // with movements.slice() = copy array, not modify original!
  const movSort = sort ? movements.slice().sort((a, b) => a - b) : movements;
  //! Not explained
  movSort.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}€</div>
  </div>`;
    // add html string with html code in to  movements container as first child:
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//? BALANCE
const calcAndDisplayBalance = function (acc) {
  //calc owerall balance and create obj propertie with it
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  //display balance on page
  labelBalance.textContent = `${acc.balance} €`;
};
//?SUMMARY
const calcAndDisplaySummary = function (acc) {
  //IN
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;
  //OUT
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(out)}€`;
  //INTERESTS
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int > 1;
    })
    .reduce((acc, deposti) => acc + deposti, 0);
  labelSumInterest.textContent = `${interest}€`;
};

//? UPDATE CURRENT AC UI MOV/SUM/BAL

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  //Display balance
  calcAndDisplayBalance(acc);
  //Display summary
  calcAndDisplaySummary(acc);
};

//?TRANSFER BTN
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const reciverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  //clear fields after transfer
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    reciverAcc &&
    currenAccount.balance >= amount &&
    reciverAcc?.username !== currenAccount.username
  ) {
    //Transfer:
    currenAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    //*Update UI
    updateUI(currenAccount);
  }
});
//* Loan functionality
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currenAccount.movements.some(move => move >= amount * 0.1)
  ) {
    currenAccount.movements.push(amount);
  }
  //Update UI
  updateUI(currenAccount);
  inputLoanAmount.value = '';
});
//* Close acc
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  //clear input fields

  if (
    currenAccount.username === inputCloseUsername.value &&
    currenAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currenAccount.username
    );
    //Delet account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
});
//For sorting
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currenAccount.movements, !sorted);
  //For sorting
  sorted = !sorted;
});
