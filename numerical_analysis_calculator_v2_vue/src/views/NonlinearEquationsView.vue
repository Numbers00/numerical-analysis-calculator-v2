<template>
<div class="container-fluid row d-flex justify-content-between px-0 mx-0">
  <div class="col-lg-6 rounded ps-0">
    <solution-accordion 
      :solution="solution"
      :answer="answer"
    />
  </div>
  <div class="col-lg-6 me-0 pe-0">
    <bisection-method 
      v-if="numMethod === 'bisectionMethod'"
      @change-num-method="changeNumMethod"
      @handle-estimates="handleEstimates"
    />
    <false-position-method
      v-if="numMethod === 'falsePositionMethod'"
      @change-num-method="changeNumMethod"
      @handle-estimates="handleEstimates"
    />
    <newton-raphson-method
      v-if="numMethod === 'newtonRaphsonMethod'"
      @change-num-method="changeNumMethod"
      @handle-estimates="handleEstimates"
    />
  </div>
</div>
</template>

<script>
import SolutionAccordion from '@/components/SolutionAccordion.vue';
import BisectionMethod from '@/components/BisectionMethod.vue';
import FalsePositionMethod from '@/components/FalsePositionMethod.vue';
import NewtonRaphsonMethod from '@/components/NewtonRaphsonMethod.vue';

export default {
  name: 'NonlinearEquationsView',
  data () {
    return {
      numMethod: 'bisectionMethod',
      solution: [],
      answer: ''
    }
  },
  components: {
    SolutionAccordion,
    BisectionMethod,
    FalsePositionMethod,
    NewtonRaphsonMethod
  },
  methods: {
    changeNumMethod (numMethod) {
      this.numMethod = numMethod;
    },
    handleEstimates (estimates) {
      this.solution = estimates.solution;
      this.answer = estimates.answer;
    }
  }
}
</script>
