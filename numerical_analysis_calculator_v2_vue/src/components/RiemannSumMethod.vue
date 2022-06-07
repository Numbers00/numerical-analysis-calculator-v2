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
            <option value="riemannSumMethod" selected>Riemann Sum Method</option>
            <option value="trapezoidalRuleMethod">Trapezoidal Rule Method</option>
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
              placeholder="x^3 - 3x + 1"
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
        &nbsp;solving using&nbsp;
        <input 
          type="number" 
          v-model="numPartitions" 
          class="partitions-input p-0 form-control"
          id="numPartitions"
          required
        >
        &nbsp;Partitions initially
      </div>

      <div class="mt-4 ms-0 ps-0 container-fluid d-inline-flex">
        w/ Method Type as&nbsp;
        <select 
          id="methodType" 
          class="form-select-sm" 
          v-model="methodType"
        >
          <option value="midpoint">Midpoint</option>
          <option value="leftRight" selected>Left/Right</option>
        </select>
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
  name: 'RiemannSumMethod',
  props: {

  },
  data () {
    return {
      numMethod: 'riemannSumMethod',
      equation: '',
      methodType: 'leftRight',
      inputErrorTolerance: false,
      lowerBound: -1,
      upperBound: 2,
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
      return parseFloat(num.toFixed(this.correctDigits));
    },
    handleCalculate () {
      this.prevCorrectDigits = this.correctDigits;

      this.estimates = [];
      this.summary = [];
      this.solution = [];
      this.answer = '';

      const shortenDecimal = this.shortenDecimal;

      const func = this.func;

      let xCurr, xPrev = 0;
      let a = this.lowerBound;
      let b = this.upperBound;
      xCurr = calcRiemann(xCurr, lowerBound, upperBound, numPartitions);

      this.estimates.push(`R(f(x), [a, b], Ɛ) -> R(${this.toPrintEq}, [${a}, ${b}], ${this.computedErrorTolerance})`);
      this.summary.push(`R(f(x), [a, b], Ɛ) -> R(${this.toPrintEq}, [${a}, ${b}], ${this.computedErrorTolerance})`);
      this.solution.push(`R(f(x), [a, b], Ɛ) -> R(${this.toPrintEq}, [${a}, ${b}], ${this.computedErrorTolerance})`);

      let currNumPartitions = numPartitions;
      let iter = 1;

      do {
        xPrev = xCurr;
        currNumPartitions = Math.floor(currNumPartitions * 2);
        xCurr = calcRiemann(xCurr, lowerBound, upperBound, currNumPartitions);
        
        iter++;
      } while (Math.abs(xCurr - xPrev) >= this.computedErrorTolerance)

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

#methodType {
  min-width: 88px;
  max-width: 88px;
  min-height: 30px;
  max-height: 30px;
  text-align: center;
}
</style>
