<template>
  <div class="m-0 p-0 container-fluid">
    <div class="outline-card rounded container-fluid">
      <div class="mt-2 row d-flex justify-content-between">
        <div class="col-lg-6 text-start">
          <label for="integrationMethod" class="form-label mt-2 mb-0 fw-bold">
            Pick a Method
          </label>
          <select 
            id="integrationMethod" 
            class="form-select form-select" 
            aria-label=".form-select-sm example"
            v-model="numMethod"
          >
            <option value="riemannSumMethod">Riemann Sum Method</option>
            <option value="trapezoidalRuleMethod" selected>Trapezoidal Rule Method</option>
            <option value="simpsons13RuleMethod">Simpson's 1/3 Rule Method</option>
            <option value="simpsons38RuleMethod">Simpson's 3/8 Rule Method</option>
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
              placeholder="1/(1+x^2)"
              v-model="equation"
              required
            >
        </div>
      </div>

      <div class="mt-4 ms-0 ps-0 container-fluid d-inline-flex">
        the Bounds set at&nbsp;
        <input 
          type="number" 
          v-model="lowerBound" 
          class="bounds-input p-0 form-control" 
          id="lowerBound"
          required
        >
        &nbsp;and&nbsp;
        <input 
          type="number" 
          v-model="upperBound" 
          class="bounds-input p-0 form-control"
          id="upperBound"
          required
        >
        &nbsp;w/&nbsp;
        <input 
          type="number" 
          v-model="numPartitions" 
          class="partitions-input p-0 form-control"
          id="numPartitions"
          required
        >
        &nbsp;initial Partitions
      </div>

      <div class="mt-4 ms-0 ps-0 container-fluid d-inline-flex">
        with Solution correct up to&nbsp;
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
        <button type="button" @click="handleReset()" class="col-lg-5 btn btn-dark">Reset</button>
      </div>
    </div>
    <p class="text-start mt-4">
      Bisection Method: BM(f(x), [a,b], E)<br>
      <br>
      For: integration Equations<br>
      Brief Description: Will always converge so long as a root is within the 
      given bounds<br>
      Comparison with Other Methods: Slower than Regula-Falsi Method but simpler<br>
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
        &emsp;iter++<br>
      until |xCurr - xPrev| &lt; Ɛ or iter &gt; maxiter<br>
    </p>
  </div>
</template>

<script>

export default {
  name: 'TrapezoidalRuleMethod',
  props: {

  },
  data () {
    return {
      numMethod: 'trapezoidalRuleMethod',
      equation: '',
      inputErrorTolerance: false,
      lowerBound: -1,
      upperBound: 2,
      maxiter: 100,
      numPartitions: 12,
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
    randomizeBounds () {
      let a = -1;
      let b = 2;

      let startingRand = a;
      let endingRand = b;
      startingRand -= Math.floor(Math.random() * 5);
      endingRand += Math.floor(Math.random() * 5);

      this.startingBound = startingRand;
      this.endingBound = endingRand;
    },
    shortenDecimal (num) {
      return Math.round((num + Number.EPSILON) * (10 ** this.correctDigits)) / (10 ** this.correctDigits);
    },
    calcTrapezoidalRule (lowerBound, upperBound, currNumPartitions, iter) {
      let func = this.func;
      let shortenDecimal = this.shortenDecimal;

      const STEPSIZE = shortenDecimal((upperBound - lowerBound) / currNumPartitions);
      let xArr = [];

      this.summary.push(`ΔX${iter} <- (${upperBound} - ${lowerBound})/${currNumPartitions}`);
      this.summary.push(`ΔX${iter} = ${STEPSIZE}`);
      this.solution.push(`ΔX${iter} <- (${upperBound} - ${lowerBound})/${currNumPartitions}`);
      this.solution.push(`ΔX${iter} = ${STEPSIZE}`);

      for (let i = lowerBound; i <= upperBound; i += STEPSIZE) {
        xArr.push(i);
      }

      this.summary.push(`X_ARR${iter} = [${xArr}]`);
      this.solution.push(`X_ARR${iter} = [${xArr}]`);

      let fxSum = 0;
      for (let i = 1; i < xArr.length-1; i++) {
        fxSum = shortenDecimal(fxSum + shortenDecimal(func(xArr[i])));
      }


      this.summary.push(`X${iter} <- ΔX${iter}[((f(${xArr[0]}) + f(${xArr[xArr.length-1]})) / 2) + Σf(${xArr.slice(1,xArr.length-2)})]`);
      this.solution.push(`X${iter} <- ΔX${iter}[((f(${xArr[0]}) + f(${xArr[xArr.length-1]})) / 2) + Σf(${xArr.slice(1,xArr.length-2)})]`);
      this.solution.push(`X${iter} <- ${STEPSIZE}[((${func(xArr[0])} + ${func(xArr[xArr.length-1])}) / 2) * Σ[${xArr.slice(1,xArr.length-2).map(e => func(e))}]]`);
      this.solution.push(`X${iter} <- ${STEPSIZE}[${(func(xArr[0]) + func(xArr[xArr.length-1])) / 2} * ${fxSum}]`);
      this.solution.push(`X${iter} <- ${STEPSIZE} * ${((func(xArr[0]) + func(xArr[xArr.length-1])) / 2) * fxSum}`);

      return shortenDecimal(STEPSIZE * shortenDecimal(shortenDecimal(shortenDecimal(shortenDecimal(func(xArr[0])) + shortenDecimal(func(xArr[xArr.length-1]))) / 2) + fxSum));
    },
    handleCalculate () {
      this.prevCorrectDigits = this.correctDigits;

      this.estimates = [];
      this.summary = [];
      this.solution = [];
      this.answer = '';

      let xPrev = 0;
      let xCurr = Infinity;
      let lowerBound = this.lowerBound;
      let upperBound = this.upperBound;
      let numPartitions = this.numPartitions;

      this.estimates.push(`TR(f(x), [a, b], n, Ɛ) -> TR(${this.toPrintEq}, [${lowerBound}, ${upperBound}], ${numPartitions}, ${this.computedErrorTolerance})`);
      this.summary.push(`TR(f(x), [a, b], n, Ɛ) -> TR(${this.toPrintEq}, [${lowerBound}, ${upperBound}], ${numPartitions}, ${this.computedErrorTolerance})`);
      this.solution.push(`TR(f(x), [a, b], n, Ɛ) -> TR(${this.toPrintEq}, [${lowerBound}, ${upperBound}], ${numPartitions}, ${this.computedErrorTolerance})`);

      let currNumPartitions = Math.round(((numPartitions / 2) + Number.EPSILON) * (10 ** 1)) / (10 ** 1);;
      let iter = 1;

      do {
        xPrev = xCurr;
        currNumPartitions = Math.round(currNumPartitions * 2);
        xCurr = this.calcTrapezoidalRule(lowerBound, upperBound, currNumPartitions, iter);
        this.estimates.push(`X${iter} = ${xCurr}`);
        this.summary.push(`X${iter} = ${xCurr}`);
        this.solution.push(`X${iter} = ${xCurr}`);
        iter++;
      } while (Math.abs(xCurr - xPrev) >= this.computedErrorTolerance && iter <= this.maxiter)

      this.estimates.push(`X${iter-1} = ${xCurr} is our estimate`);
      this.summary.push(`X${iter-1} = ${xCurr} is our estimate`);
      this.solution.push(`X${iter-1} = ${xCurr} is our estimate`);
      this.answer = `X${iter-1} = ${xCurr} is our estimate`;
      this.handleEstimates();
    },
    handleReset () {
      this.equation = '';
      this.inputErrorTolerance = false;
      this.lowerBound = 1;
      this.upperBound = 3;
      this.maxiter = 100;
      this.numPartitions = 12;
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
    lowerBound () {
      if (this.countDecimals(this.startingBound) > 14) this.startingBound = parseFloat(this.startingBound.toFixed(14));
      this.correctDigits = Math.max(this.prevCorrectDigits, this.countDecimals(this.startingBound), this.countDecimals(this.endingBound));
    },
    upperBound () {
      if (this.countDecimals(this.endingBound) > 14) this.endingBound = parseFloat(this.endingBound.toFixed(14));
      this.correctDigits = Math.max(this.prevCorrectDigits, this.countDecimals(this.startingBound), this.countDecimals(this.endingBound));
    },
    numPartitions () {
      this.numPartitions = Math.floor(this.numPartitions);
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
      return new Function('x', 'return ' + this.correctedEq);
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
