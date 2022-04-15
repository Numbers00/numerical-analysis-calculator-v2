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
            <option value="falsePositionMethod" selected>False Position Method</option>
            <option value="newtonRaphsonMethod">Newton Raphson Method</option>
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
            v-model="randomBounds"
            value=""
            id="checkRandomBounds"
            required
          >
          <label class="form-check-label" for="checkRandomBounds">
            Random Bounds
          </label>
        </div>

        &nbsp;or find a Root between&nbsp;
        <input 
          type="number" 
          v-model="startingBound" 
          class="bounds-input p-0 form-control" 
          id="startingBound"
          required
        >
        &nbsp;and&nbsp;
        <input 
          type="number" 
          v-model="endingBound" 
          class="bounds-input p-0 form-control"
          id="endingBound"
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
      False Position Method: FP(f(x), [a,b], E)<br>
      <br>
      For: Nonlinear Equations<br>
      Brief Description: Will always converge so long as a root is within the 
      given bounds<br>
      Comparison with Other Methods: Faster on average than Bisection Method 
      but with a more complex formula<br>
      <br>
      Legend:<br>
      xCurr = current estimate<br>
      xPrev = previous estimate<br>
      a = starting bound<br>
      b = ending bound<br>
      Ɛ = error tolerance<br>
      <br>
      Pseudocode:<br>
      float xCurr, xPrev<br>
      xCurr = a - (func(a) * (b-a))/(func(b) - func(a)) (iteration 1)<br>
      <br>
      repeat<br>
        &emsp;xPrev = xCurr<br>
        &emsp;if f(a) * f(xCurr) &lt; 0<br>
          &emsp;&emsp;b = xCurr<br>
        &emsp;else if f(a) * f(xCurr) &gt; 0<br>
          &emsp;&emsp;a = xCurr<br>
        &emsp;else print(xCurr + "is the exact solution")<br>
        &emsp;xCurr = a - (func(a) * (b-a))/(func(b) - func(a))<br>
        &emsp;iter++<br>
      until |xCurr - xPrev| &lt; Ɛ or iter &gt; maxiter<br>
    </p>
  </div>
</template>

<script>

export default {
  name: 'FalsePositionMethod',
  props: {

  },
  data () {
    return {
      numMethod: 'falsePositionMethod',
      equation: '',
      randomBounds: false,
      startingBound: 1,
      endingBound: 3,
      maxiter: 100,
      correctDigits: 4,
      solution: [],
      answer: '',
      calculating: false,
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
    randomizeBounds () {
      const func = this.func;
      let a = 1;
      let b = 3;
      const randMaxiter = 100;

      for (let i = 0; func(a) * func(b) >= 0 && i < randMaxiter; i++) {
        a--;
        b++;
      }

      if (func(a) * func(b) >= 0) {
        a = 1;
        b = 5;
        for (let i = 0; func(a) * func(b) >= 0 && i < randMaxiter; i++) {
          a++;
          b++;
        }
      }

      if (func(a) * func(b) >= 0) {
        a = -1;
        b = -5;
        for (let i = 0; func(a) * func(b) >= 0 && i < randMaxiter; i++) {
          a--;
          b--;
        }
      }

      // console.log(func(a), func(b));
      // func(x) === func(0) at very large numbers: resolved
      // if (func(a) * func(b) >= 0 || (a !== 0 && func(a) === func(0) && func(0) !== 0) || (b !== 0 && func(b) === func(0) && func(b) !== 0)) throw new Error();
      if (func(a) * func(b) >= 0) throw new Error();

      let startingRand = a;
      let endingRand = b;
      startingRand -= Math.floor(Math.random() * 5);
      endingRand += Math.floor(Math.random() * 5);

      if (func(startingRand) * func(endingRand) >= 0) {
        this.startingBound = a;
        this.endingBound = b;
      } else {
        this.startingBound = startingRand;
        this.endingBound = endingRand;
      }
    },
    shortenDecimal (num) {
      console.log(this.correctDigits);
      return parseFloat(num.toFixed(this.correctDigits));
    },
    handleCalculate () {
      this.prevCorrectDigits = this.correctDigits;

      this.solution = [];
      this.answer = '';

      const shortenDecimal = this.shortenDecimal;

      const func = this.func;

      if (this.randomBounds) {
        try {
          this.randomizeBounds();
        } catch (e) {
          this.solution.push('Could not find eligible bounds for this equation, but you can try manually inputting random bounds');
          this.answer = 'Could not find eligible bounds for this equation, but you can try manually inputting random bounds';
          this.handleEstimates();
          return;
        }
      } else {
        if (func(this.startingBound) * func(this.endingBound) >= 0) {
          this.solution.push(`f(${this.startingBound}) * f(${this.endingBound}) = ${func(this.startingBound) * func(this.endingBound)} which is greater than or equal to 0, try with different bounds`);
          this.handleEstimates();
          return;
        }
      }
      let xCurr, xPrev = 0;
      let a = this.startingBound;
      let b = this.endingBound;
      xCurr = shortenDecimal(a - shortenDecimal((shortenDecimal(func(a)) * shortenDecimal((b-a)))/(shortenDecimal(func(b)) - shortenDecimal(func(a)))));

      this.solution.push(`FP(f(x), [a, b], Ɛ) -> FP(${this.toPrintEq}, [${a}, ${b}], ${this.errorTolerance})`);
      this.solution.push(`X1 <- ${a} - (f(${a}) * (${b}-${a})) / (f(${b}) - f(${a}))`);
      this.solution.push(`X1 <- ${a} - (${shortenDecimal(func(a))} * ${shortenDecimal(b - a)}) / ${shortenDecimal(func(b))} - ${shortenDecimal(func(a))})`);
      this.solution.push(`X1 <- ${a} - (${shortenDecimal(func(a)) * shortenDecimal(b-a)} / ${shortenDecimal(func(b)) - shortenDecimal(func(a))})`);
      this.solution.push(`X1 <- ${a} - ${shortenDecimal((shortenDecimal(func(a)) * shortenDecimal(b-a))/(shortenDecimal(func(b)) - shortenDecimal(func(a))))}`);
      this.solution.push(`X1 = ${xCurr}`);

      let iter = 2;

      do {
        xPrev = xCurr;

        this.solution.push(`f(${a}) * f(${xCurr}) ? 0`);

        if (func(a) * func(xCurr) < 0) {
          this.solution.push(`${shortenDecimal(func(a))} * ${shortenDecimal(func(xCurr))} < 0`);
          this.solution.push(`b <- ${xCurr}`);
          b = xCurr;
        }
        else if (func(a) * func(xCurr) > 0) {
          this.solution.push(`${shortenDecimal(func(a))} * ${shortenDecimal(func(xCurr))} > 0`);
          this.solution.push(`a <- ${xCurr}`);
          a = xCurr;
        }
        else {
          this.solution.push(`${shortenDecimal(func(a))} * ${shortenDecimal(func(xCurr))} = 0`);

          this.solution.push(`X${iter} = ${xCurr} is the exact solution`);
          this.answer = `X${iter} = ${xCurr} is the exact solution`;
          
          this.handleEstimates();
          return;
        }

        xCurr = shortenDecimal(a - shortenDecimal((shortenDecimal(func(a)) * shortenDecimal((b-a)))/(shortenDecimal(func(b)) - shortenDecimal(func(a)))));

        this.solution.push(`X${iter} <- ${a} - (f(${a}) * (${b}-${a})) / (f(${b}) - f(${a}))`);
        this.solution.push(`X${iter} <- ${a} - (${shortenDecimal(func(a))} * (${shortenDecimal(b - a)}) / ${shortenDecimal(func(b))} - ${shortenDecimal(func(a))})`);
        this.solution.push(`X${iter} <- ${a} - (${shortenDecimal(func(a)) * shortenDecimal((b-a))} / ${shortenDecimal(func(b)) - shortenDecimal(func(a))})`);
        this.solution.push(`X${iter} <- ${a} - ${shortenDecimal((shortenDecimal(func(a)) * shortenDecimal((b-a)))/(shortenDecimal(func(b)) - shortenDecimal(func(a))))}`);
        this.solution.push(`X${iter} = ${xCurr}`);
        
        iter++;
      } while (Math.abs(xCurr - xPrev) >= this.errorTolerance && iter <= this.maxiter)

      if (iter > this.maxiter) {
        this.solution.push(`the calculation has reached maxiter ${maxiter} while not being correct up to ${correctDigits} digits, ${xCurr} is the final estimate we've reached`);
        this.answer = `the calculation has reached maxiter ${maxiter} while not being correct up to ${correctDigits} digits, ${xCurr} is the final estimate we've reached`;
        
        this.handleEstimates();
        return;
      }

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
    startingBound () {
      if (this.countDecimals(this.startingBound) > 14) this.startingBound = parseFloat(this.startingBound.toFixed(14));
      this.correctDigits = Math.max(this.prevCorrectDigits, this.countDecimals(this.startingBound), this.countDecimals(this.endingBound));
    },
    endingBound () {
      if (this.countDecimals(this.endingBound) > 14) this.endingBound = parseFloat(this.endingBound.toFixed(14));
      this.correctDigits = Math.max(this.prevCorrectDigits, this.countDecimals(this.startingBound), this.countDecimals(this.endingBound));
    },
    randomBounds () {
      document.getElementById('startingBound').disabled = this.randomBounds;
      document.getElementById('endingBound').disabled = this.randomBounds;
    },
    maxiter () {
      if (this.maxiter !== '') this.maxiter = Math.floor(this.maxiter);

      if (this.maxiter !== '' && this.maxiter < 1) this.maxiter = 1;
      else if (this.maxiter > 500) this.maxiter = 500; 
    },
    correctDigits () {
      if (this.correctDigits !== '') this.correctDigits = Math.floor(this.correctDigits);

      if (this.correctDigits !== '' && this.correctDigits < 0) this.correctDigits = 0;
      if (this.correctDigits > 14) this.correctDigits = 14;
    }
  },
  computed: {
    func () {
      return new Function('x', 'return ' + this.correctedEq);
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
