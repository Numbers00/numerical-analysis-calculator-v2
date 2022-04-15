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
            <option value="secantMethod" selected>Secant Method</option>
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
        &nbsp;and&nbsp;
        <input 
          type="number" 
          v-model="secondGuess" 
          class="guess-input p-0 form-control" 
          id="secondGuess"
          required
        >
        &nbsp;as your Initial Guesses
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
      until |xCurr - xPrev| &lt; Ɛ or iter &gt; maxiter<br>
    </p>
  </div>
</template>

<script>
export default {
  name: 'SecantMethod',
  props: {

  },
  data () {
    return {
      numMethod: 'secantMethod',
      equation: '',
      randomGuesses: false,
      firstGuess: 1,
      secondGuess: 5,
      maxiter: 100,
      correctDigits: 4,
      slopeThreshold: 0.0001,
      estimates: [],
      summary: [],
      solution: [],
      answer: ''
    }
  },
  methods: {
    randomizeGuesses () {
      this.firstGuess = 1;
      this.secondGuess = 5;

      let func = this.func;

      let a = 1;
      let b = 5;

      while (func(a) === func(b) && b < 15) {
        this.secondGuess++;
        b++;
      }

      while (func(a) === func(b) && a > -15) {
        this.firstGuess--;
        a--;
      }

      while (func(a) === func(b) && b < 30) {
        this.secondGuess++;
        b++;
      }

      while (func(a) === func(b) && a > -30) {
        this.firstGuess--;
        a--;
      }

      let firstRand = a - Math.floor(Math.random() * 5);
      let secondRand = b + Math.floor(Math.random() * 5);

      let randMaxiter = 0;

      while (func(firstRand) === func(secondRand) || randMaxiter < 10) {
        firstRand = a - Math.floor(Math.random() * 5);
        secondRand = b + Math.floor(Math.random() * 5);

        this.firstGuess = firstRand;
        this.secondGuess = secondRand;

        randMaxiter++;
      }

      if (func(firstRand) !== func(secondRand)) {
        this.firstGuess = firstRand;
        this.secondGuess = secondRand;
      } else {
        if (func(a) !== func(b)) {
          this.firstGuess = a;
          this.secondGuess = b;
        } else throw new Error();
      }
    },
    shortenDecimal (num) {
      return parseFloat(num.toFixed(this.correctDigits));
    },
    handleCalculate () {
      this.estimates = [];
      this.summary = [];
      this.solution = [];
      this.answer = '';

      const randomGuesses = this.randomGuesses;
      const correctDigits = this.correctDigits;

      const correctedEq = this.correctedEq;
      const derivEq = this.derivEq;
      const firstGuess = this.firstGuess;
      const secondGuess = this.secondGuess;
      const errorTolerance = this.errorTolerance;
      const slopeThreshold = this.slopeThreshold;
      const maxiter = this.maxiter;

      const shortenDecimal = this.shortenDecimal;

      const func = this.func;

      if (randomGuesses) {
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
        if (func(firstGuess) === func(secondGuess)) {
          this.solution.push(`f(${firstGuess}) = f(${secondGuess}), you can try a different guess`);
          this.handleEstimates();
          return;
        }
      }

      let xPrev2 = 0;
      let xPrev1 = secondGuess;
      let xCurr = firstGuess;

      this.estimates.push(`SM(f(x), X0, X1, Ɛ, 𝛿, maxiter) -> SM(${this.toPrintEq}, ${firstGuess}, ${secondGuess}, ${errorTolerance}, ${slopeThreshold}, ${maxiter})`);

      this.summary.push(`SM(f(x), X0, X1, Ɛ, 𝛿, maxiter) -> SM(${this.toPrintEq}, ${firstGuess}, ${secondGuess}, ${errorTolerance}, ${slopeThreshold}, ${maxiter})`);

      this.solution.push(`SM(f(x), X0, X1, Ɛ, 𝛿, maxiter) -> SM(${this.toPrintEq}, ${firstGuess}, ${secondGuess}, ${errorTolerance}, ${slopeThreshold}, ${maxiter})`);

      let iter = 1;

      do {
        xPrev2 = xPrev1;
        xPrev1 = xCurr;
        xCurr = shortenDecimal(xPrev1) - shortenDecimal(shortenDecimal(shortenDecimal(xPrev1 - xPrev2) * shortenDecimal(func(xPrev1))) / (shortenDecimal(func(xPrev1)) - shortenDecimal(func(xPrev2))));
        
        this.estimates.push(`X${iter} = ${xCurr}`);

        this.summary.push(`X${iter} <- ${xPrev1} - ((${xPrev1} - ${xPrev2})(f(${xPrev1})))/(f(${xPrev1}) - f(${xPrev2}))`);
        this.summary.push(`X${iter} = ${xCurr}`);

        this.solution.push(`X${iter} <- ${xPrev1} - ((${xPrev1} - ${xPrev2})(f(${xPrev1})))/(f(${xPrev1}) - f(${xPrev2}))`);
        this.solution.push(`X${iter} <- ${xPrev1} - ((${xPrev1 - xPrev2})(${func(xPrev1)}))/(${func(xPrev1)} - ${func(xPrev2)})`);
        this.solution.push(`X${iter} <- ${xPrev1} - (${(xPrev1 - xPrev2) * func(xPrev1)})/(${func(xPrev1) - func(xPrev2)})`);
        this.solution.push(`X${iter} <- ${xPrev1} - ${((xPrev1 - xPrev2) * func(xPrev1)) / (func(xPrev1) - func(xPrev2))}`);
        this.solution.push(`X${iter} = ${xCurr}`);

        if (func(xCurr) === 0) {
          this.estimates.push(`${xCurr} is the exact solution`);

          this.summary.push(`${xCurr} is the exact solution`);

          this.solution.push(`${xCurr} is the exact solution`);
          this.answer = `${xCurr} is the exact solution`;

          this.handleEstimates();
          return;
        }

        if (Math.abs(func(xCurr) - func(xPrev1)) < slopeThreshold) {
          // if (randomGuess) {
          //   this.randomizeGuess();
          //   this.handleCalculate();
          // }
          this.estimates.push(`|f(${xCurr}) - f(${xPrev1})| < ${slopeThreshold}, the slope of the tangent line is approaching zero, try a different guess`);

          this.summary.push(`|f(${xCurr}) - f(${xPrev1})| < ${slopeThreshold}, the slope of the tangent line is approaching zero, try a different guess`);

          this.solution.push(`|f(${xCurr}) - f(${xPrev1})| < ${slopeThreshold}, the slope of the tangent line is approaching zero, try a different guess`);

          this.handleEstimates();
          return; 
        }
        
        iter++;
      } while (Math.abs(xCurr - xPrev1) >= errorTolerance && iter <= maxiter)

      if (iter > maxiter && Math.abs(xCurr - xPrev1) < errorTolerance) {
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
    handleEstimates () {
      this.$emit('handle-estimates', {'estimates':this.estimates, 'summary':this.summary, 'solution':this.solution, 'answer':this.answer});
    }
  },
  watch: {
    numMethod () {
      this.$emit('change-num-method', this.numMethod);
    },
    randomGuesses () {
      document.getElementById('firstGuess').disabled = this.randomGuesses;
      document.getElementById('secondGuess').disabled = this.randomGuesses;
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
