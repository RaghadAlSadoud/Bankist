'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2023-02-19T23:36:17.929Z',
    '2023-02-20T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const creatUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

creatUserName(accounts);

const format = function (date, locale) {
  const calDaysPassed = (date1, date2) => {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };
  const daysPast = calDaysPassed(new Date(), date);
  console.log(daysPast);

  if (daysPast === 0) return 'Today';
  if (daysPast === 1) return 'Yesterday';
  if (daysPast <= 7) return `${daysPast}days ago`;
  else {
    // const year = date.getFullYear();
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const day = `${date.getDate()}`.padStart(2, 0);

    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovemnets = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const currentdate = new Date(acc.movementsDates[i]);
    const displayDate = format(currentdate, acc.locale);
    const formatedMovements = formatCur(mov, acc.locale, acc.currency);
    const html = `
    <div class="movements__row">
     <div class="movements__type movements__type--${type}">${i + 1}   ${type}
     </div>
     <div class="movements__date">${displayDate}</div>



     <div class="movements__value">${formatedMovements}</div>
   </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calDisplayBalance = function (acc) {
  acc.balance = movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

//calDisplayBalance(account1.movements);

const calDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = formatCur(acc.incomes, acc.locale, acc.currency);

  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((aa, mov) => aa + mov, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(outcome),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposite => (deposite * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int > 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatCur(acc.in, acc.locale, acc.currency);
};

//calDisplaySummary(accounts);

// login

//

const startLogOutTimer = function () {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 20;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

let currentAccount, timer;

const updateUI = function (acc) {
  displayMovemnets(acc);
  calDisplayBalance(acc);
  calDisplaySummary(acc);
};

//
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// const currentdate = new Date();

// const year = currentdate.getFullYear();
// const month = `${currentdate.getMonth() + 1}`.padStart(2, 0);
// const day = `${currentdate.getDate()}`.padStart(2, 0);
// const hour = currentdate.getHours();
// const min = currentdate.getMinutes();

// labelDate.textContent = `${day}/${month}/${year}, ${hour}: ${min}`;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(
      ' '
    )}`;
    containerApp.style.opacity = 100;
    const now = new Date();

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      year: 'numeric',
      month: 'numeric',
      //weekDay: 'long',
    };

    labelDate.textContent = Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // const currentdate = new Date();

    // const year = currentdate.getFullYear();
    // const month = `${currentdate.getMonth() + 1}`.padStart(2, 0);
    // const day = `${currentdate.getDate()}`.padStart(2, 0);
    // const hour = `${currentdate.getHours()}`.padStart(2, 0);
    // const min = `${currentdate.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${day}/${month}/${year}, ${hour}: ${min}`;

    inputLoginUsername.value = inputLoginPin.value = ' ';
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  }
});
console.log(accounts);

//inputTransferTo

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movements.push(new Date());
    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  }

  // if(currentAccount.)
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement

    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
    inputLoanAmount.value = '';
  }

  btnClose.addEventListener('click', function (e) {
    e.preventDefault();

    if (
      inputCloseUsername.value === currentAccount.username &&
      Number(inputClosePin.value) === currentAccount.pin
    ) {
      const index = accounts.findIndex(
        acc => acc.username === currentAccount.username
      );
      accounts.splice(index, 1);
      containerApp.style.opacity = 0;
      inputCloseUsername.value = inputClosePin.value = '';
    }
  });

  let sorted = false;

  btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    displayMovemnets(currentAccount.movements, !sorted);
    sorted = !sorted;
  });

  const x = new Array(2);
  console.log(x);
  x.fill(0, 1);
  console.log(x);

  // const outDisplaySymmery = function (move) {
  //   const outcome = move.filter(mov => mov < 0).reduce((aa, mov) => aa + mov);

  //   labelSumOut.textContent = `${Math.abs(outcome)}$`;
  // };

  // outDisplaySymmery(account1.movements);

  // intresnt when we have deposite in the bank account

  // const interest = movements
  //   .filter(mov => mov > 0)
  //   .map(deposite => (deposite * 1.2) / 100)
  //   .reduce((acc, mov) => acc + mov, 0);
  // labelSumInterest.textContent = `${amountofIntersrt}$`;

  // interest(account1.movements);

  const eurToUsd = 1.1;
  const totalDepositesUSD = movements
    .filter(mov => mov > 0)
    .map(mov => mov * eurToUsd)
    .reduce((acc, mov) => acc + mov, 0);

  const deposite = movements.filter(function (mov) {
    return mov > 0;
  });
  //console.log(movements);
  //console.log(deposite);

  const withdrawal = movements.filter(function (move) {
    return move < 0;
  });
  //console.log(withdrawal);

  // takes a starter valye as well like 2,100
  // we send it after the call back function

  // const addAll = movements.reduce(function (acc, mov) {
  //   return acc + mov;
  // }, 100);
  // console.log(addAll);

  //   const num = 234567.54;
  //   const options = {
  //     style: 'currency', // unit, curruncy,
  //     unit: 'mile-per-hour',
  //     currency: 'EUR',
  //   };
  //   console.log(Intl.NumberFormat('ar-JO', options).format(num));

  //   setTimeout(
  //     (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
  //     3000,
  //     'olives',
  //     'spinach'
  //   );

  //   // const ingredients = ['olives', 'spanich'];
  //   // const pizzaTimer = setTimeout(
  //   //   (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
  //   //   3000,
  //   //   ...ingredients
  //   // );
  //   // if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);
  // });

  // setInterval(() => {
  //   const now = new Date();
  //   console.log(now);
  // ;
});

console.log('App');
