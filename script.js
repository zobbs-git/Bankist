'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };
const account1 = {
  owner: 'Chizoba Nweke',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Kelvin Johnson',
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
  owner: 'Daniel Brown',
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

const displayMovements = function (movements, sorts = false) {
  containerMovements.innerHTML = '';

  const mooves = sorts ? movements.slice().sort((a, b) => a - b) : movements;

  mooves.forEach(function (val, ind) {
    const type = val > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${ind + 1} ${type}
        </div>
        <div class="movements__value">${val}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBal = function (moves) {
  moves.balance = moves.movements.reduce((acc, val) => acc + val, 0);
  labelBalance.textContent = `${moves.balance}€`;
};

const displaySummary = function (movement) {
  const income = movement.movements
    .filter(val => val > 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = `${income}€`;

  const out = movement.movements
    .filter(val => val < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = movement.movements
    .filter(val => val > 0)
    .map(deposit => (deposit * movement.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, val) => acc + val, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// Update UI
const updateUI = function (acc) {
  // DISPLAY BALANCE
  calcDisplayBal(acc);
  // DISPLAY SUMMARY
  displaySummary(acc);
  // DISPLAY MOVEMENTS
  displayMovements(acc.movements);
};

let currentAcc;
/////Event handler
btnLogin.addEventListener('click', function (el) {
  el.preventDefault();

  currentAcc = accounts.find(acc => acc.username === inputLoginUsername.value);
  // console.log(currentAcc);
  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    // DISPLAY UI AND WELCOME MESSAGE
    labelWelcome.textContent = `Welcome back, ${
      currentAcc.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // CLEAR INPUT FIELDS
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // UPDATE UI
    updateUI(currentAcc);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, recieverAcc);

  inputTransferTo.value = inputTransferAmount.value = '';

  if (
    amount > 0 &&
    recieverAcc &&
    currentAcc.balance >= amount &&
    recieverAcc.username !== currentAcc.username
  ) {
    // running the transfers
    currentAcc.movements.push(-amount);
    recieverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAcc);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAcc.movements.some(val => val >= amount * 0.1)) {
    // ADD MOVEMENT
    currentAcc.movements.push(amount);
    // UPDATE UI
    updateUI(currentAcc);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAcc.username &&
    Number(inputClosePin.value) === currentAcc.pin
  ) {
    const ind = accounts.findIndex(acc => acc.username === currentAcc.username);
    console.log(ind);

    // DELETE ACCOUNT
    accounts.splice(ind, 1);

    // // HIDE UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (i) {
  i.preventDefault();
  displayMovements(currentAcc.movements, !sorted);
  sorted = !sorted;
});
