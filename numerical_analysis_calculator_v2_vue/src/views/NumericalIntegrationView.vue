<template>
<div class="container row d-flex justify-content-between px-0 mx-0">
  <div class="col-lg-6 rounded ps-0">
    <solution-accordion 
      :estimates="estimates"
      :summary="summary"
      :solution="solution"
      :answer="answer"
    />
  </div>
  <div class="col-lg-6 me-0 pe-0">
    <riemann-sum-method
      v-if="numMethod === 'riemannSumMethod'"
      @change-num-method="changeNumMethod"
      @handle-estimates="handleEstimates"
    />
    <trapezoidal-rule-method
      v-if="numMethod === 'trapezoidalRuleMethod'"
      @change-num-method="changeNumMethod"
      @handle-estimates="handleEstimates"
    />
    <simpsons-13-rule-method
      v-if="numMethod === 'simpsons13RuleMethod'"
      @change-num-method="changeNumMethod"
      @handle-estimates="handleEstimates"
    />
    <simpsons-38-rule-method
      v-if="numMethod === 'simpsons38RuleMethod'"
      @change-num-method="changeNumMethod"
      @handle-estimates="handleEstimates"
    />
  </div>
</div>
</template>

<script>
import SolutionAccordion from '@/components/SolutionAccordion.vue';
import RiemannSumMethod from '@/components/RiemannSumMethod.vue';
import TrapezoidalRuleMethod from '@/components/TrapezoidalRuleMethod.vue';
import Simpsons13RuleMethod from '@/components/Simpsons13RuleMethod.vue';
import Simpsons38RuleMethod from '@/components/Simpsons38RuleMethod.vue';

export default {
  name: 'NumericalIntegrationView',
  data () {
    return {
      numMethod: 'riemannSumMethod',
      estimates: [],
      summary: [],
      solution: [],
      answer: ''
    }
  },
  components: {
    SolutionAccordion,
    RiemannSumMethod,
    TrapezoidalRuleMethod,
    Simpsons13RuleMethod,
    Simpsons38RuleMethod
  },
  props: {
    navNumMethod: String
  },
  methods: {
    changeNumMethod (numMethod) {
      console.log(numMethod);
      this.numMethod = numMethod;
    },
    handleEstimates (estimates) {
      this.estimates = estimates.estimates;
      this.summary = estimates.summary;
      this.solution = estimates.solution;
      this.answer = estimates.answer;
    }
  },
  watch: {
    navNumMethod () {
      console.log(this.navNumMethod);
      this.changeNumMethod(this.navNumMethod);
    }
  }
}
</script>
