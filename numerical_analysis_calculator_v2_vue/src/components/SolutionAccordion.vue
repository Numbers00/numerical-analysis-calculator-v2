<template>
<div class="accordion container-fluid px-0" id="helperAccordion">
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        Final Answer
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#helperAccordion">
      <div class="accordion-body">
        {{printAnswer}}
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingTwo">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        Calculated Estimates
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#helperAccordion">
      <div class="accordion-body text-start">
        <p v-for="(line, index) in printEstimates" :key="index.uuid">{{line}}</p>
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingThree">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        Summarized Solution
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#helperAccordion">
      <div class="accordion-body text-start">
        <template v-for="(line, index) in printSummary">
          <template v-if="line.length > 56">
            <p 
              v-if="/X[0-9]+ =/.test(line)" 
              :key="index.uuid" 
              class="lead fw-bold"
            >
            {{line.slice(0,56)}}...
            </p>
            <p v-else :key="index">{{line.slice(0,56)}}...</p>
          </template>
          <template v-else>
            <p 
              v-if="/^X[0-9]+ =/.test(line)" 
              :key="index.uuid" 
              class="lead fw-bold"
            >
            {{line}}
            </p>
            <p v-else :key="index">{{line}}</p>
          </template>
        </template>
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingFour">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
        Complete Solution
      </button>
    </h2>
    <div id="collapseFour" class="accordion-collapse collapse show" aria-labelledby="headingFour" data-bs-parent="#helperAccordion">
      <div class="accordion-body text-start" style="overflow-x: auto;">
        <template v-for="(line, index) in printSolution">
          <template v-if="line.length > 56">
            <p 
              v-if="/X[0-9]+ =/.test(line)" 
              :key="index.uuid" 
              class="lead fw-bold"
            >
            {{line.slice(0,56)}}...
            </p>
            <p v-else :key="index">{{line.slice(0,56)}}...</p>
          </template>
          <template v-else>
            <p 
              v-if="/^X[0-9]+ =/.test(line)" 
              :key="index.uuid" 
              class="lead fw-bold"
            >
            {{line}}
            </p>
            <p v-else :key="index">{{line}}</p>
          </template>
        </template>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { uuid } from 'vue-uuid';
import VueMathjax from 'vue-mathjax-next';

export default {
  name: 'SolutionAccordion',
  props: {
    estimates: Array,
    summary: Array,
    solution: Array,
    answer: String
  },
  data () {
    return {
      uuid: uuid.v4()
    }
  },
  components: {
    'vue-mathjax': VueMathjax
  },
  computed: {
    printEstimates () {
      if (this.estimates.length === 0) return ['Please click "calculate" to start displaying the estimates'];
      else return this.estimates;
    },
    printSummary () {
      if (this.summary.length === 0) return ['Please click "calculate" to start displaying the summary'];
      else return this.summary;
    },
    printSolution () {
      if (this.solution.length === 0) return ['Please click "calculate" to start displaying the solution'];
      else return this.solution;
    },
    printAnswer () {
      if (this.answer === '') return 'Please click "calculate" to start displaying the answer';
      else return this.answer;
    }
  }
}
</script>

<style lang="scss" scoped>

#collapseFour .accordion-body {
  text-align: left !important;
}

.accordion-item {
  border: none;
}

.accordion-button {
  border: 2px solid #c3cfd9;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  background-color: #f7f8fb;
  color: black;

  // &:nth-child(1) {
  //   border-bottom: 2px solid #c3cfd9;
  // }
}
</style>
