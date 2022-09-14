'use strict';

/////////////////////////////////////////////////
// *BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; // empty the movements container..
  //? with movements.slice() = copy array, not modify original!
  const movSort = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movSort.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}€</div>
  </div>`;
    // add html string with html code:
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcAndDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};
const calcAndDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(out)}€`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int > 1;
    })
    .reduce((acc, deposti) => acc + deposti, 0);
  labelSumInterest.textContent = `${interest}€`;
};

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
const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  //Display balance
  calcAndDisplayBalance(acc);
  //Display summary
  calcAndDisplaySummary(acc);
};

//Event handler
let currenAccount;
btnLogin.addEventListener('click', function (e) {
  //Prevent form from submiting
  e.preventDefault();
  currenAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  //* currentAccount will be compared if its exsist '?' <= optional chaining
  if (currenAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back ${
      currenAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //clear input fields after login
    inputLoginUsername.value = inputLoginPin.value = '';
    inputClosePin.blur();

    //*Update UI
    updateUI(currenAccount);
  }
});
//* Transfer implementing
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  //* clear fields after transfer
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


