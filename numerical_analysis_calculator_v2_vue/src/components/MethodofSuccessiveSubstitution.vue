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
            <option value="methodofSuccessiveSubstitution" selected>Method of Successive Substitution</option>
          </select>
        </div>

        <div class="col-lg-6 text-start">
          <label for="equation" class="form-label mt-2 mb-0 fw-bold">
            Give the Auxiliary Function
          </label>
          <input 
              type="text"
              class="form-control col-11" 
              id="equation"
              placeholder="(x^3)/3 + (1/3)"
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
            v-model="randomGuess"
            value=""
            id="checkRandomGuess"
            required
          >
          <label class="form-check-label" for="checkRandomGuess">
            Random Guess
          </label>
        </div>

        &nbsp;or use&nbsp;
        <input 
          type="number" 
          v-model="initialGuess" 
          class="guess-input p-0 form-control" 
          id="initialGuess"
          required
        >
        &nbsp;as your Initial Guess
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
      </div>

      <div class="mt-3 mb-3 row d-flex justify-content-around">
        <button 
          type="button" 
          @click="handleCalculate()" 
          class="col-lg-5 btn btn-secondary"
        >
        Calculate
        </button>
        <button type="button" @click="handleReset()" class="col-lg-5 btn btn-dark">Reset</button>
      </div>
    </div>
    <p class="text-start mt-4">
      Method of Successive Substitution: MOSS(f(x), X0, Ɛ, maxiter)<br>
      <br>
      For: Nonlinear Equations<br>
      Brief Description: Is one of the fastest and simplest iterative
      algorithms but does not always converge<br>
      Comparison with Other Methods: Is one of the fastest and simplest<br>
      <br>
      Legend:<br>
      xCurr = current estimate<br>
      xPrev = previous estimate<br>
      initialGuess = initial guess<br>
      Ɛ = error tolerance<br>
      ∆ = relative error<br>
      maxiter = max iteration<br>
      iter = current iteration<br>
      <br>
      Pseudocode:<br>
      float xPrev = initialGuess<br>
      float xCurr = func(xPrev) (iteration 1)<br>
      float ∆ = 0<br>
      iter = 2<br>
      <br>
      repeat<br>
        &emsp;xPrev = xCurr<br>
        &emsp;xCurr = func(xPrev)<br>
        &emsp;∆ = xPrev - xCurr<br>
        &emsp;if f(xCurr) === 0<br>
          &emsp;&emsp;print(xCurr + " is the exact solution")<br>
        &emsp;if |∆| &lt; Ɛ<br>
          &emsp;&emsp;print(`∆${iter} = ${relError} has become lower than Ɛ ${computedErrorTolerance}, X${iter} = ${xCurr} is the final estimate we've reached`)<br>
        &emsp;iter++<br>
      until |xCurr - xPrev| &lt; Ɛ or iter &gt; maxiter<br>
    </p>
  </div>
</template>

<script>
export default {
  name: 'methodofSuccessiveSubstitution',
  props: {

  },
  data () {
    return {
      numMethod: 'methodofSuccessiveSubstitution',
      equation: '',
      inputErrorTolerance: false,
      randomGuess: false,
      initialGuess: 1,
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
    randomizeGuess () {
      this.initialGuess += Math.floor(Math.random() * 5) * ((-1) ** (Math.floor(Math.random() * 2) + 1));
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

      const randomGuess = this.randomGuess;
      const correctDigits = this.correctDigits;

      const correctedEq = this.correctedEq;
      const initialGuess = this.initialGuess;
      const computedErrorTolerance = this.computedErrorTolerance;
      const maxiter = this.maxiter;

      const shortenDecimal = this.shortenDecimal;

      const func = this.func;

      if (randomGuess) {
        this.initialGuess = 1;
        this.randomizeGuess();
      }

      let xPrev = initialGuess;
      let xCurr = shortenDecimal(func(xPrev));
      let relError = 0;

      this.estimates.push(`MOSS(f(x), X0, Ɛ, maxiter) -> MOSS(${this.toPrintEq}, ${initialGuess}, ${computedErrorTolerance}, ${maxiter})`);
      this.estimates.push(`X0 = ${xPrev}`);
      this.estimates.push(`X1 = ${xCurr}`);

      this.summary.push(`MOSS(f(x), X0, Ɛ, maxiter) -> MOSS(${this.toPrintEq}, ${initialGuess}, ${computedErrorTolerance}, ${maxiter})`);
      this.summary.push(`X0 = ${xPrev}`);
      this.summary.push(`f(X0) = ${xCurr}`);
      this.summary.push(`X1 = ${xCurr}`);

      this.solution.push(`MOSS(f(x), X0, Ɛ, maxiter) -> MOSS(${this.toPrintEq}, ${initialGuess}, ${computedErrorTolerance}, ${maxiter})`);
      this.solution.push(`X0 = ${xPrev}`);
      this.solution.push(`f(X0) = ${xCurr}`);
      this.solution.push(`X1 = ${xCurr}`);

      let iter = 2;

      do {
        xPrev = xCurr;
        xCurr = shortenDecimal(func(xPrev));
        relError = shortenDecimal(xPrev - shortenDecimal(func(xPrev)));
        
        this.estimates.push(`X${iter} = ${xCurr}`);

        this.solution.push(`X${iter} <- f(${xPrev})`);
        this.solution.push(`X${iter} = ${xCurr}`);
        this.summary.push(`∆${iter} <- ${xPrev} - f(${xPrev})`);
        this.summary.push(`∆${iter} = ${relError}`);

        this.solution.push(`X${iter} <- f(${xPrev})`);
        this.solution.push(`X${iter} = ${xCurr}`);
        this.solution.push(`∆${iter} <- ${xPrev} - f(${xPrev})`);
        this.solution.push(`∆${iter} <- ${xPrev} - ${shortenDecimal(func(xPrev))}`);
        this.solution.push(`∆${iter} = ${relError}`);

        if (func(xCurr) === 0) {
          this.estimates.push(`${xCurr} is the exact solution`);
          this.summary.push(`${xCurr} is the exact solution`);
          this.solution.push(`${xCurr} is the exact solution`);
          this.answer = `${xCurr} is the exact solution`;

          this.handleEstimates();
          return;
        }

        if (Math.abs(relError) < computedErrorTolerance) {
          this.estimates.push(`∆${iter} = ${relError} has become lower than Ɛ ${computedErrorTolerance}, X${iter} = ${xCurr} is the final estimate we've reached`);
          this.summary.push(`∆${iter} = ${relError} has become lower than Ɛ ${computedErrorTolerance}, X${iter} = ${xCurr} is the final estimate we've reached`);
          this.solution.push(`∆${iter} = ${relError} has become lower than Ɛ ${computedErrorTolerance}, X${iter} = ${xCurr} is the final estimate we've reached`);
          this.answer = `∆${iter} = ${relError} has become lower than Ɛ ${computedErrorTolerance}, X${iter} = ${xCurr} is the final estimate we've reached`;

          this.handleEstimates();
          return;
        }
        
        iter++;
      } while (Math.abs(xCurr - xPrev) >= computedErrorTolerance && iter <= maxiter)

      if (iter > maxiter && Math.abs(xCurr - xPrev) < computedErrorTolerance) {
        // if (randomGuess) {
        //   this.randomizeGuess();
        //   this.handleCalculate();
        // }
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
      this.randomGuess = false;
      this.initialGuess = 1;
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
    initialGuess () {
      this.correctDigits = Math.max(this.prevCorrectDigits, this.countDecimals(this.initialGuess));
    },
    randomGuess () {
      document.getElementById('initialGuess').disabled = this.randomGuess;
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
    }
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
