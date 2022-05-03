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
    <secant-method
      v-if="numMethod === 'secantMethod'"
      @change-num-method="changeNumMethod"
      @handle-estimates="handleEstimates"
    />
    <methodof-successive-substitution
      v-if="numMethod === 'methodofSuccessiveSubstitution'"
      @change-num-method="changeNumMethod"
      @handle-estimates="handleEstimates"
    />
    <methodof-successive-substitution
      v-if="numMethod === 'methodofSuccessiveSubstitution'"
      @change-num-method="changeNumMethod"
      @handle-estimates="handleEstimates"
    />
    <mullers-method
      v-if="numMethod === 'mullersMethod'"
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
import SecantMethod from '@/components/SecantMethod.vue';
import MethodofSuccessiveSubstitution from '@/components/MethodofSuccessiveSubstitution.vue';
import MullersMethod from '@/components/MullersMethod.vue';

export default {
  name: 'NonlinearEquationsView',
  data () {
    return {
      numMethod: 'bisectionMethod',
      estimates: [],
      summary: [],
      solution: [],
      answer: ''
    }
  },
  components: {
    SolutionAccordion,
    BisectionMethod,
    FalsePositionMethod,
    NewtonRaphsonMethod,
    SecantMethod,
    MethodofSuccessiveSubstitution,
    MullersMethod
  },
  methods: {
    changeNumMethod (numMethod) {
      this.numMethod = numMethod;
    },
    handleEstimates (estimates) {
      this.estimates = estimates.estimates;
      this.summary = estimates.summary;
      this.solution = estimates.solution;
      this.answer = estimates.answer;
    }
  }
}
</script>
