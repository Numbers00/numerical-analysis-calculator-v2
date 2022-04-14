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
            <option value="bisectionMethod" selected>Bisection Method</option>
            <option value="falsePositionMethod">False Position Method</option>
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
      Bisection Method: BM(f(x), [a,b], E)<br>
      <br>
      For: Nonlinear Equations<br>
      Brief Description: Will always converge so long as a root is within the 
      given bounds<br>
      Comparison with Other Methods: Slower than Regula-Falsi Method but simpler<br>
      <br>
      Legend:<br>
      xCurr = current estimate<br>
      xPrev = previous estimate<br>
      a = starting bound<br>
      b = ending bound<br>
      E = error tolerance<br>
      <br>
      Pseudocode:<br>
      float xCurr, xPrev<br>
      xCurr = (a + b) / 2 (iteration 1)<br>
      <br>
      repeat<br>
        &emsp;xPrev = xCurr<br>
        &emsp;if f(a) * f(xCurr) &lt; 0<br>
          &emsp;&emsp;b = xCurr<br>
        &emsp;else if f(a) * f(xCurr) &gt; 0<br>
          &emsp;&emsp;a = xCurr<br>
        &emsp;else print(xCurr + "is the exact solution")<br>
        &emsp;xCurr = (a + b) / 2<br>
      until |xCurr - xPrev| &lt; E<br>
    </p>
  </div>
</template>

<script>

export default {
  name: 'BisectionMethod',
  props: {

  },
  data () {
    return {
      numMethod: 'bisectionMethod',
      equation: '',
      randomBounds: false,
      startingBound: 1,
      endingBound: 3,
      maxiter: 100,
      correctDigits: 4,
      solution: [],
      answer: ''
    }
  },
  methods: {
    randomizeBounds () {
      const func = this.func;
      let a = 1;
      let b = 3;
      const maxiter = 100;

      for (let i = 0; func(a) * func(b) >= 0 && i < maxiter; i++) {
        a--;
        b++;
      }

      if (func(a) * func(b) >= 0) {
        a = 1;
        b = 5;
        for (let i = 0; func(a) * func(b) >= 0 && i < maxiter; i++) {
          a++;
          b++;
        }
      }

      if (func(a) * func(b) >= 0) {
        a = -1;
        b = -5;
        for (let i = 0; func(a) * func(b) >= 0 && i < maxiter; i++) {
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
    handleCalculate () {
      this.solution = [];
      this.answer = '';

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
      xCurr = (a + b) / 2;

      this.solution.push(`BM(f(x), [a, b], E) -> BM(${this.correctedEq}, [${a}, ${b}], ${this.errorTolerance})`);
      this.solution.push(`xCurr <- (${a} + ${b}) / 2 (iteration 1)`);
      this.solution.push(`repeat until |xCurr - xPrev| < ${this.errorTolerance}`);

      let iter = 2;

      do {
        this.solution.push(`iteration ${iter}:`);
        this.solution.push(`xPrev <- ${xCurr} (xCurr)`);
        xPrev = xCurr;

        if (func(a) * func(xCurr) < 0) {
          this.solution.push(`func(${a}) * func(${xCurr}) [${func(a)} * ${func(xCurr)}] < 0`);
          this.solution.push(`b <- ${xCurr} (xCurr)`);
          b = xCurr;
        }
        else if (func(a) * func(xCurr) > 0) {
          this.solution.push(`func(${a}) * func(${xCurr}) [${func(a)} * ${func(xCurr)}] > 0`);
          this.solution.push(`a <- ${xCurr} (xCurr)`);
          a = xCurr;
        }
        else {
          xCurr = parseFloat(xCurr.toFixed(this.correctDigits));
          this.solution.push(`${xCurr} is the exact solution`);
          this.answer = `${xCurr} is the exact solution`;
          
          this.handleEstimates();
          return;
        }

        this.solution.push(`xCurr <- (${a} + ${b}) / 2`);
        xCurr = (a + b) / 2;
        
        iter++;
      } while (Math.abs(xCurr - xPrev) >= this.errorTolerance && iter <= this.maxiter)

      if (iter > this.maxiter) {
        xCurr = parseFloat(xCurr.toFixed(this.correctDigits));
        this.solution.push(`the calculation has reached maxiter ${this.maxiter}, ${xCurr} is the final estimate we've reached`);
        this.answer = `the calculation has reached maxiter ${this.maxiter}, ${xCurr} is the final estimate we've reached`;
        
        this.handleEstimates();
        return;
      }

      xCurr = parseFloat(xCurr.toFixed(this.correctDigits));
      this.solution.push(`${xCurr} is our estimate`);
      this.answer = `${xCurr} is our estimate`;

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
    randomBounds () {
      document.getElementById('startingBound').disabled = this.randomBounds;
      document.getElementById('endingBound').disabled = this.randomBounds;
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
      return new Function('x', 'return ' + this.correctedEq);
    },
    errorTolerance () {
      return 1 / (10 ** this.correctDigits);
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
