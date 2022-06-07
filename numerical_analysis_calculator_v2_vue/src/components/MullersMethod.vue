<template>
  <div class="m-0 p-0 container-fluid">
    <div class="outline-card rounded container-fluid">
      <div class="mt-2 row d-flex justify-content-between">
        <div class="col-lg-6 text-start">
          <label for="nonlinearMethod" class="form-label mt-2 mb-0 fw-bold">
            Pick a Method
          </label>
          <select 
            id="nonlinearMethod" 
            class="form-select form-select" 
            aria-label=".form-select-sm example"
            v-model="numMethod"
          >
            <option value="bisectionMethod">Bisection Method</option>
            <option value="falsePositionMethod">False Position Method</option>
            <option value="newtonRaphsonMethod">Newton Raphson Method</option>
            <option value="secantMethod">Secant Method</option>
            <option value="methodofSuccessiveSubstitution">Method of Successive Substitution</option>
            <option value="mullersMethod" selected>Muller's Method</option>
          </select>
        </div>

        <div class="col-lg-6 text-start">
          <label for="equation" class="form-label mt-2 mb-0 fw-bold">
            Give the Equation
          </label>
          <input 
              type="text"
              class="form-control col-11" 
              id="equation"
              placeholder="x^3 - 3x + 1"
              v-model="equation"
              required
            >
        </div>
      </div>

      <div class="mt-4 ms-0 ps-0 container-fluid d-inline-flex">
        <div class="form-check">
          <input 
            class="form-check-input" 
            type="checkbox" 
            v-model="randomGuesses"
            value=""
            id="checkRandomGuesses"
            required
          >
          <label class="form-check-label" for="checkRandomGuesses">
            Random Guesses
          </label>
        </div>

        &nbsp;or use&nbsp;
        <input 
          type="number" 
          v-model="firstGuess" 
          class="guess-input p-0 form-control" 
          id="firstGuess"
          required
        >
        &nbsp;,&nbsp;
        <input 
          type="number" 
          v-model="secondGuess" 
          class="guess-input p-0 form-control" 
          id="secondGuess"
          required
        >
        &nbsp;and&nbsp;
        <input 
          type="number" 
          v-model="thirdGuess" 
          class="guess-input p-0 form-control" 
          id="thirdGuess"
          required
        >
      </div>

      <div class="mt-4 ms-0 ps-0 container-fluid d-inline-flex">
        w/ Max Iteration&nbsp;
        <input 
          type="number" 
          v-model="maxiter"
          class="places-input p-0 form-control" 
          id="maxIteration"
          required
        >
        &nbsp;and Solution correct up to&nbsp;
        <input 
          type="number" 
          v-model="correctDigits"
          class="places-input p-0 form-control" 
          id="correctDigits"
          required
        >
        &nbsp;Decimal Places
      </div>

      <div class="mt-4 ms-0 ps-0 container-fluid d-inline-flex">
        <div class="form-check">
          <input 
            class="form-check-input" 
            type="checkbox" 
            v-model="inputErrorTolerance"
            value=""
            id="checkErrorTolerance"
            required
          >
        </div>

        or click this to input Error Tolerance&nbsp;
        <input 
          type="number" 
          v-model="errorTolerance"
          class="longer-places-input p-0 form-control" 
          id="errorTolerance"
          required
        >
        &nbsp;here
      </div>

      <div class="mt-3 mb-3 row d-flex justify-content-around">
        <button 
          type="button" 
          @click="handleCalculate()" 
          class="col-lg-5 btn btn-secondary"
        >
        Calculate
        </button>
        <button type="button" class="col-lg-5 btn btn-dark">Reset</button>
      </div>
    </div>
    <p class="text-start mt-4">
      Muller's Method: SM(f(x), X0, X1, X2, Ɛ, maxiter)<br>
      <br>
      For: Nonlinear Equations<br>
      Brief Description: Is one of the fastest iterative algorithms, but
      does not always converge<br>
      Comparison with Other Methods: Is faster than Secant Method but still slower than 
      Newton-Raphson Method, can be computationally-expensive both on the computer and
      when done by hand<br>
      <br>
      Legend:<br>
      xCurr = current estimate<br>
      xPrev1 = previous estimate<br>
      xPrev2 = previous previous estimate<br>
      xPrev3 = previous previous previous estimate<br>
      Ɛ = error tolerance<br>
      maxiter = max iteration<br>
      iter = current iteration<br>
      <br>
      Pseudocode:<br>
      float xPrev3 = 0<br>
      float xPrev2 = X2<br>
      float xPrev1 = X1<br>
      float xCurr = X0<br>
      iter = 1<br>
      <br>
      repeat<br>
        &emsp;xPrev3 = xPrev2<br>
        &emsp;xPrev2 = xPrev1<br>
        &emsp;xPrev1 = xCurr<br>
        &emsp;xCurr = (func(xPrev1)(((x-xPrev2)(x-xPrev3))/((xPrev1-xPrev2)(xPrev1-xPrev3))) + func(xPrev2)(((x-xPrev1)(x-xPrev3))/((xPrev2-xPrev1)(xPrev2-xPrev3))) + func(xPrev3)(((x-xPrev1)(x-xPrev2))/((xPrev3-xPrev1)(xPrev3-xPrev2))))<br>
        &emsp;if f(xCurr) === 0<br>
          &emsp;&emsp;print(xCurr + " is the exact solution")<br>
        &emsp;iter++<br>
      until |xCurr - xPrev| &lt; Ɛ or iter &gt; maxiter<br>
    </p>
  </div>
</template>

<script>
import nerdamer from 'nerdamer';

export default {
  name: 'MullersMethod',
  props: {

  },
  data () {
    return {
      numMethod: 'mullersMethod',
      equation: '',
      inputErrorTolerance: false,
      randomGuesses: false,
      firstGuess: 1,
      secondGuess: 2,
      thirdGuess: 3,
      maxiter: 100,
      correctDigits: 4,
      errorTolerance: 0.0001,
      estimates: [],
      summary: [],
      solution: [],
      answer: '',
      prevCorrectDigits: 4
    }
  },
  methods: {
    countDecimals (num) {
      // code adapted from and credits to:
      // https://stackoverflow.com/a/17369245
      if (Math.floor(num) === num) return 0;

      var str = num.toString();
      if (str.indexOf(".") !== -1 && str.indexOf("-") !== -1) {
          return str.split("-")[1] || 0;
      } else if (str.indexOf(".") !== -1) {
          return str.split(".")[1].length || 0;
      }
      return str.split("-")[1] || 0;
    },
    checkEquality (arr) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = i+1; j < arr.length; j++) {
          if (arr[i] !== arr[j]) return false;
        } 
      }
      return true;
    },
    randomizeGuesses () {
      this.firstGuess = 1;
      this.secondGuess = 3;
      this.thirdGuess = 5;

      let func = this.func;
      let checkEquality = this.checkEquality;

      let a = 1;
      let b = 3;
      let c = 5;

      while (checkEquality([a,b,c]) && c < 15) {
        this.thirdGuess++;
        c++;
      }

      while (checkEquality([a,b,c]) && a > -15) {
        this.firstGuess--;
        a--;
      }

      while (checkEquality([a,b,c]) && c < 30) {
        this.thirdGuess++;
        c++;
      }

      while (checkEquality([a,b,c]) && a > -30) {
        this.firstGuess--;
        a--;
      }

      console.log([a,b,c])
      console.log(checkEquality([a,b,c]))

      let firstRand = a - Math.floor(Math.random() * 5);
      let secondRand = Math.round(Math.random()) === 0 ? b - Math.floor(Math.random() * 5) : b + Math.ceil(Math.random() * 5);
      let thirdRand = c + Math.ceil(Math.random() * 5);

      let randMaxiter = 0;

      while (checkEquality([firstRand,secondRand,thirdRand]) || randMaxiter < 10) {
        firstRand = a - Math.floor(Math.random() * 5);
        secondRand = Math.round(Math.random()) === 0 ? b - Math.floor(Math.random() * 5) : b + Math.ceil(Math.random() * 5);
        thirdRand = c + Math.ceil(Math.random() * 5);

        this.firstGuess = firstRand;
        this.secondGuess = secondRand;
        this.thirdGuess = thirdRand;

        randMaxiter++;
      }

      if (!checkEquality([firstRand,secondRand,thirdRand])) {
        this.firstGuess = firstRand;
        this.secondGuess = secondRand;
        this.thirdGuess = thirdRand;
      } else {
        if (!checkEquality([a,b,c])) {
          this.firstGuess = a;
          this.secondGuess = b;
          this.thirdRand = c;
        } else throw new Error();
      }
    },
    shortenDecimal (num) {
      return parseFloat(num.toFixed(this.correctDigits));
    },
    handleCalculate () {
      this.prevCorrectDigits = this.correctDigits;

      this.estimates = [];
      this.summary = [];
      this.solution = [];
      this.answer = '';

      const randomGuesses = this.randomGuesses;
      const correctDigits = this.correctDigits;

      const correctedEq = this.correctedEq;
      const computedErrorTolerance = this.computedErrorTolerance;
      const maxiter = this.maxiter;

      const shortenDecimal = this.shortenDecimal;

      const func = this.func;

      if (randomGuesses) {
        try {
          this.firstGuess = 1;
          this.secondGuess = 3;
          this.thirdGuess = 5;
          this.randomizeGuesses();
        } catch (e) {
          this.estimates.push('Could not find an eligible initial guess for this equation, you can try manually inputting an initial guess');
          this.summary.push('Could not find an eligible initial guess for this equation, you can try manually inputting an initial guess');
          this.solution.push('Could not find an eligible initial guess for this equation, you can try manually inputting an initial guess');
          this.answer = 'Could not find an eligible initial guess for this equation, you can try manually inputting an initial guess';
          this.handleEstimates();
          return;
        }
      } else {
        if (func(this.firstGuess) === func(this.secondGuess)) {
          this.estimates.push(`f(${this.firstGuess}) = f(${this.secondGuess}), you can try a different guess`);
          this.summary.push(`f(${this.firstGuess}) = f(${this.secondGuess}), you can try a different guess`);
          this.solution.push(`f(${this.firstGuess}) = f(${this.secondGuess}), you can try a different guess`);

          this.answer = `f(${this.firstGuess}) = f(${this.secondGuess}), you can try a different guess`;
          this.handleEstimates();
          return;
        }
      }

      const firstGuess = this.firstGuess;
      const secondGuess = this.secondGuess;
      const thirdGuess = this.thirdGuess;

      let xPrev3 = 0;
      let xPrev2 = thirdGuess;
      let xPrev1 = secondGuess;
      let xCurr = firstGuess;

      this.estimates.push(`MM(f(x), X0, X1, X2, Ɛ, maxiter) -> MM(${this.toPrintEq}, ${firstGuess}, ${secondGuess}, ${thirdGuess}, ${computedErrorTolerance}, ${maxiter})`);
      this.summary.push(`MM(f(x), X0, X1, X2, Ɛ, maxiter) -> MM(${this.toPrintEq}, ${firstGuess}, ${secondGuess}, ${thirdGuess}, ${computedErrorTolerance}, ${maxiter})`);
      this.solution.push(`MM(f(x), X0, X1, X2, Ɛ, maxiter) -> MM(${this.toPrintEq}, ${firstGuess}, ${secondGuess}, ${thirdGuess}, ${computedErrorTolerance}, ${maxiter})`);

      let iter = 1;
      let imaginaries = 0;

      do {
        xPrev3 = xPrev2;
        xPrev2 = xPrev1;
        xPrev1 = xCurr;

        let parabola = nerdamer('(c1(((x-xPrev2)(x-xPrev3))/((xPrev1-xPrev2)(xPrev1-xPrev3))) + c2(((x-xPrev1)(x-xPrev3))/((xPrev2-xPrev1)(xPrev2-xPrev3))) + c3(((x-xPrev1)(x-xPrev2))/((xPrev3-xPrev1)(xPrev3-xPrev2))))', {c1:shortenDecimal(func(xPrev1)), c2:shortenDecimal(func(xPrev2)), c3:shortenDecimal(func(xPrev3)), xPrev1:xPrev1, xPrev2:xPrev2, xPrev3:xPrev3});
        let strXIntercepts = nerdamer('solve(parabola,x)', {parabola:parabola.toString()}).toString().slice(1,-1).split(',');
        let xIntercepts = strXIntercepts.map(e => shortenDecimal(Number(nerdamer('e',{e:e}).evaluate().text())));
        if (Math.abs(func(xIntercepts[0])) < Math.abs(func(xIntercepts[1]))) xCurr = xIntercepts[0];
        else xCurr = xIntercepts[1];

        if (strXIntercepts[0].includes('i') || strXIntercepts[1].includes('i')) {
          this.summary.push(`X${iter} <- ${parabola.toString()}`);
          this.solution.push(`X${iter} <- ${parabola.toString()}`);
          if (strXIntercepts[0].includes('i') && !strXIntercepts[1].includes('i')) {
            this.estimates.push(`root (1) ${strXIntercepts[0]} is an imaginary root, this calculator cannot proceed further, please try another guess`);
            this.summary.push(`root (1) ${strXIntercepts[0]} is an imaginary root, this calculator cannot proceed further, please try another guess`);
            this.solution.push(`root (1) ${strXIntercepts[0]} is an imaginary root, this calculator cannot proceed further, please try another guess`);
          } else if (!strXIntercepts[0].includes('i') && strXIntercepts[1].includes('i')) {
            this.estimates.push(`root (2) ${strXIntercepts[1]} is an imaginary root, this calculator cannot proceed further, please try another guess`);
            this.summary.push(`root (2) ${strXIntercepts[1]} is an imaginary root, this calculator cannot proceed further, please try another guess`);
            this.solution.push(`root (2) ${strXIntercepts[1]} is an imaginary root, this calculator cannot proceed further, please try another guess`);
          } else if (strXIntercepts[0].includes('i') && strXIntercepts[1].includes('i')) {
            this.estimates.push(`roots (1) ${strXIntercepts[0]} and (2) ${strXIntercepts[1]} are imaginary roots, this calculator cannot proceed further, please try another guess`);
            this.summary.push(`roots (1) ${strXIntercepts[0]} and (2) ${strXIntercepts[1]} are imaginary roots, this calculator cannot proceed further, please try another guess`);
            this.solution.push(`roots (1) ${strXIntercepts[0]} and (2) ${strXIntercepts[1]} are imaginary roots, this calculator cannot proceed further, please try another guess`);
          }
          this.handleEstimates();
          break;
        }
        
        this.estimates.push(`X${iter} = ${xCurr}`);

        this.summary.push(`X${iter} <- ${parabola.toString()}`);
        this.summary.push(`X${iter} = ${xCurr}`);

        this.solution.push(`X${iter} <- ${parabola.toString()}`);
        this.solution.push(`X${iter} = ${xCurr}`);

        if (func(xCurr) === 0) {
          this.estimates.push(`${xCurr} is the exact solution`);
          this.summary.push(`${xCurr} is the exact solution`);
          this.solution.push(`${xCurr} is the exact solution`);
          this.answer = `${xCurr} is the exact solution`;

          this.handleEstimates();
          return;
        }
        
        iter++;
      } while (Math.abs(xCurr - xPrev1) >= computedErrorTolerance && iter <= maxiter)

      if (iter > maxiter && Math.abs(xCurr - xPrev1) < errorTolerance) {
        this.estimates.push(`the calculation has reached maxiter ${maxiter} while not being correct up to ${correctDigits} digits, ${xCurr} is the final estimate we've reached`);
        this.summary.push(`the calculation has reached maxiter ${maxiter} while not being correct up to ${correctDigits} digits, ${xCurr} is the final estimate we've reached`);
        this.solution.push(`the calculation has reached maxiter ${maxiter} while not being correct up to ${correctDigits} digits, ${xCurr} is the final estimate we've reached`);
        this.answer = `the calculation has reached maxiter ${maxiter} while not being correct up to ${correctDigits} digits, ${xCurr} is the final estimate we've reached`;
        
        this.handleEstimates();
        return;
      }

      this.estimates.push(`X${iter-1} = ${xCurr} is our estimate`);
      this.summary.push(`X${iter-1} = ${xCurr} is our estimate`);
      this.solution.push(`X${iter-1} = ${xCurr} is our estimate`);
      this.answer = `X${iter-1} = ${xCurr} is our estimate`;

      this.handleEstimates();
    },
    handleReset () {
      this.equation = '';
      this.inputErrorTolerance = false;
      this.randomGuesses = false;
      this.firstGuess = 1;
      this.secondGuess = 5;
      this.maxiter = 100;
      this.correctDigits = 4;
      this.errorTolerance = 0.0001;
      this.estimates = [];
      this.summary = [];
      this.solution = [];
      this.answer = '';
      this.prevCorrectDigits = 4;

      this.handleEstimates();
    },
    handleEstimates () {
      this.$emit('handle-estimates', {'estimates':this.estimates, 'summary':this.summary, 'solution':this.solution, 'answer':this.answer});
    }
  },
  watch: {
    numMethod () {
      this.$emit('change-num-method', this.numMethod);
    },
    inputErrorTolerance () {
      document.getElementById('correctDigits').disabled = this.inputErrorTolerance;
      document.getElementById('errorTolerance').disabled = !this.inputErrorTolerance;
    },
    firstGuess () {
      this.correctDigits = Math.max(this.prevCorrectDigits, this.countDecimals(this.firstGuess));
    },
    secondGuess () {
      this.correctDigits = Math.max(this.prevCorrectDigits, this.countDecimals(this.secondGuess));
    },
    randomGuesses () {
      document.getElementById('firstGuess').disabled = this.randomGuesses;
      document.getElementById('secondGuess').disabled = this.randomGuesses;
      document.getElementById('thirdGuess').disabled = this.randomGuesses;
    },
    maxiter () {
      if (this.maxiter !== '') this.maxiter = Math.floor(this.maxiter);

      if (this.maxiter !== '' && this.maxiter < 1) this.maxiter = 1;
      else if (this.maxiter > 500) this.maxiter = 500; 
    },
    correctDigits () {
      if (this.correctDigits !== '') this.correctDigits = Math.floor(this.correctDigits);

      if (this.correctDigits !== '' && this.correctDigits < 0) this.correctDigits = 0;
      else if (this.correctDigits > 14) this.correctDigits = 14;
      else if (!this.inputErrorTolerance) this.errorTolerance = 1 / (10 ** this.correctDigits);
    },
    errorTolerance () {
      if (this.countDecimals(this.errorTolerance) > 14) this.errorTolerance = parseFloat(this.errorTolerance.toFixed(14));

      if (this.inputErrorTolerance) this.correctDigits = this.countDecimals(this.errorTolerance);
    }
  },
  computed: {
    func () {
      return new Function('x', `return ${this.correctedEq}`);
    },
    lagrangeFunc () {
      const func = this.func;
      const shortenDecimal = this.shortenDecimal;
      return new Function('x', `return func(xPrev1)(x-xPrev2)(x-xPrev3)/(xPrev1-xPrev2)(xPrev1-xPrev3) + func(xPrev2)(x-xPrev1)(x-xPrev3)/(xPrev2-xPrev1)(xPrev2-xPrev3) + func(xPrev3)(x-xPrev1)(x-xPrev2)/(xPrev3-xPrev1)(xPrev3-xPrev2)`);
    },
    computedErrorTolerance () {
      if (!this.inputErrorTolerance) return 1 / (10 ** this.correctDigits);
      return this.errorTolerance;
    },
    toPrintEq () {
      let eq = this.equation;

      for(let i = 0; i < eq.length; i++) {
        if (eq[i] === "x" && Number.isInteger(Number(eq[i-1]))) {
          eq = eq.substring(0, i) + '*' + eq.substring(i);
        }
      }

      return eq;
    },
    correctedEq () {
      let eq = this.equation;

      eq = eq.replace(/\^/g, '**').replace(/ /g,'');
      for(let i = 0; i < eq.length; i++) {
        // if (Number.IsInteger(Number(eq[i]))) {
        //   eq = eq.substring(0, i) + `BigInt(${eq[i]})` + eq.substring(i+1);
        // }
        if (eq[i] === "x" && Number.isInteger(Number(eq[i-1]))) {
          eq = eq.substring(0, i) + '*' + eq.substring(i);
        }
      }

      return eq;
    },
  },
  mounted () {
    document.getElementById('errorTolerance').disabled = true;
  }
}
</script>

<style lang="scss" scoped>
input[type=number] {
  min-width: 66px;
  max-width: 66px;
  min-height: 22px;
  max-height: 22px;
  text-align: center;

  &.longer-places-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
}
</style>
