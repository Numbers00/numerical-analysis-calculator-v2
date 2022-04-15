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
            <option value="regulaFalsiMethod">Regula-Falsi Method</option>
            <option value="newtonRaphsonMethod" selected>Newton Raphson Method</option>
            <option value="secantMethod">Secant Method</option>
            <option value="MOSS">Method of Successive Substitution</option>
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
              placeholder="3x^2 - 6x + 5"
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
          min="1" 
          max="500" 
          class="places-input p-0 form-control" 
          id="maxIteration"
          required
        >
        &nbsp;and Solution correct up to&nbsp;
        <input 
          type="number" 
          v-model="correctDigits" 
          min="0" 
          max="14" 
          class="places-input p-0 form-control" 
          id="correctDigits"
          required
        >
        &nbsp;Decimal Places
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
      Newton Raphson Method: NM(f(x), f'(x), Xo, Ɛ, 𝛿, maxiter)<br>
      <br>
      For: Nonlinear Equations<br>
      Brief Description: Is one of the fastest, most accurate, and simplest
      iterative algorithms, but does not always converge <br>
      Comparison with Other Methods: Is one of the fastest and simplest<br>
      <br>
      Legend:<br>
      xCurr = current estimate<br>
      xPrev = previous estimate<br>
      initialGuess = initial Guess<br>
      Ɛ = error tolerance<br>
      𝛿 = slope threshold<br>
      maxiter = max iteration<br>
      iter = current iteration<br>
      <br>
      Pseudocode:<br>
      float xPrev = initialGuess<br>
      float xCurr = xPrev - (f(xPrev) / f'(xPrev)) (iteration 1)<br>
      iter = 2<br>
      <br>
      repeat<br>
        &emsp;xPrev = xCurr<br>
        &emsp;xCurr = xPrev - (f(xPrev) / f'(xPrev))<br>
        &emsp;if f(xCurr) === 0<br>
          &emsp;&emsp;print(xCurr + " is the exact solution")<br>
        &emsp;if |f'(xCurr)| &lt; 𝛿<br>
          &emsp;&emsp;print(`|f'(${xCurr})| &lt; ${slopeThreshold}, the slope of the tangent line is approaching zero, try a different guess`)<br>
        &emsp;iter++<br>
      until |xCurr - xPrev| &lt; E or iter > maxiter<br>
    </p>
  </div>
</template>

<script>
import nerdamer from 'nerdamer';

export default {
  name: 'NewtonRaphsonMethod',
  props: {

  },
  data () {
    return {
      numMethod: 'newtonRaphsonMethod',
      equation: '',
      randomGuess: false,
      initialGuess: 1,
      maxiter: 100,
      correctDigits: 4,
      slopeThreshold: 0.0001,
      solution: [],
      answer: ''
    }
  },
  methods: {
    randomizeGuess () {
      const derivFunc = this.derivEq.buildFunction();

      while (derivFunc(this.initialGuess) === 0 && this.initialGuess < 5) {
        this.initialGuess++;
      }

      if (derivFunc(this.initialGuess) === 0) {
        this.initialGuess = 0;
        while (derivFunc(this.initialGuess) === 0 && this.initialGuess > -5) {
          this.initialGuess--;
        }
      }

      if (derivFunc(this.initialGuess) === 0) {
        this.initialGuess = 6;
        while (derivFunc(this.initialGuess) === 0 && this.initialGuess < 15) {
          this.initialGuess++;
        }
      }

      if (derivFunc(this.initialGuess) === 0) {
        this.initialGuess = -6;
        while (derivFunc(this.initialGuess) === 0 && this.initialGuess > -15) {
          this.initialGuess--;
        }
      }

      if (derivFunc(this.initialGuess) === 0 || this.initialGuess < -15 || this.initialGuess > 15) throw new Error();
    },
    shortenDecimal (num) {
      console.log(num);
      return parseFloat(num.toFixed(this.correctDigits));
    },
    handleCalculate () {
      this.solution = [];
      this.answer = '';

      const randomGuess = this.randomGuess;
      const correctDigits = this.correctDigits;

      const correctedEq = this.correctedEq;
      const derivEq = this.derivEq;
      const initialGuess = this.initialGuess;
      const errorTolerance = this.errorTolerance;
      const slopeThreshold = this.slopeThreshold;
      const maxiter = this.maxiter;

      const shortenDecimal = this.shortenDecimal;

      const func = this.func;
      const derivFunc = this.derivEq.buildFunction();

      if (randomGuess) {
        try {
          this.initialGuess = 1;
          this.randomizeGuess();
        } catch (e) {
          this.solution.push('Could not find an eligible initial guess for this equation, you can try manually inputting an initial guess');
          this.answer = 'Could not find an eligible initial guess for this equation, you can try manually inputting an initial guess';
          this.handleEstimates();
          return;
        }
      } else {
        if (derivFunc(initialGuess) === 0) {
          this.solution.push(`Substituting ${initialGuess} to ${this.derivEq} results in 0, you can try a different guess`);
          this.handleEstimates();
          return;
        }
      }
      let xPrev = initialGuess;
      let xCurr = shortenDecimal(xPrev - (shortenDecimal(func(xPrev)) / shortenDecimal(derivFunc(xPrev))));

      this.solution.push(`NM(f(x), f'(x), Xo, Ɛ, 𝛿, maxiter) -> NM(${this.toPrintEq}, ${derivEq}, ${initialGuess}, ${errorTolerance}, ${slopeThreshold}, ${maxiter})`);
      this.solution.push(`X1 <- ${xPrev} - (f(${xPrev}) / f'(${xPrev}))`);
      this.solution.push(`X1 <- ${xPrev} - (${shortenDecimal(func(xPrev))} / ${shortenDecimal(derivFunc(xPrev))})`);
      this.solution.push(`X1 = ${xCurr}`);

      let iter = 2;

      do {
        xPrev = xCurr;
        xCurr = shortenDecimal(xPrev - (shortenDecimal(func(xPrev)) / shortenDecimal(derivFunc(xPrev))));

        this.solution.push(`X${iter} <- ${xPrev} - (f(${xPrev}) / f'(${xPrev}))`);
        this.solution.push(`X${iter} <- ${xPrev} - (${shortenDecimal(func(xPrev))} / ${shortenDecimal(derivFunc(xPrev))})`);
        this.solution.push(`X${iter} = ${xCurr}`);

        if (func(xCurr) === 0) {
          this.solution.push(`${xCurr} is the exact solution`);
          this.answer = `${xCurr} is the exact solution`;

          this.handleEstimates();
          return;
        }

        if (Math.abs(derivFunc(xCurr)) < slopeThreshold) {
          // if (randomGuess) {
          //   this.randomizeGuess();
          //   this.handleCalculate();
          // }
          this.solution.push(`|f'(${xCurr})| < ${slopeThreshold}, the slope of the tangent line is approaching zero, try a different guess`);
          return; 
        }
        
        iter++;
      } while (Math.abs(xCurr - xPrev) >= errorTolerance && iter <= maxiter)

      if (iter > maxiter && Math.abs(xCurr - xPrev) < errorTolerance) {
        // if (randomGuess) {
        //   this.randomizeGuess();
        //   this.handleCalculate();
        // }
        xCurr = shortenDecimal(xCurr);
        this.solution.push(`the calculation has reached maxiter ${maxiter} while not being correct up to ${correctDigits} digits, ${xCurr} is the final estimate we've reached`);
        this.answer = `the calculation has reached maxiter ${maxiter} while not being correct up to ${correctDigits} digits, ${xCurr} is the final estimate we've reached`;
        
        this.handleEstimates();
        return;
      }

      xCurr = shortenDecimal(xCurr);
      this.solution.push(`X${iter-1} = ${xCurr} is our estimate`);
      this.answer = `X${iter-1} = ${xCurr} is our estimate`;

      this.handleEstimates();
    },
    handleEstimates () {
      this.$emit('handle-estimates', {'solution':this.solution, 'answer':this.answer});
    }
  },
  watch: {
    numMethod () {
      this.$emit('change-num-method', this.numMethod);
    },
    randomGuess () {
      document.getElementById('initialGuess').disabled = this.randomGuess;
    },
    maxiter () {
      if (this.maxiter < 1) this.maxiter = 1;
      else if (this.maxiter > 500) this.maxiter = 500; 
    },
    correctDigits () {
      if (this.correctDigits < 0) this.correctDigits = 0;
      if (this.correctDigits > 14) this.correctDigits = 14;
    }
  },
  computed: {
    func () {
      return new Function('x', `return ${this.correctedEq}`);
    },
    errorTolerance () {
      return 1 / (10 ** this.correctDigits);
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
    derivEq () {
      return nerdamer.diff(this.correctedEq, 'x').evaluate();
    }
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

  // &.places-input::-webkit-inner-spin-button {
  // -webkit-appearance: none;
  // }
}
</style>
