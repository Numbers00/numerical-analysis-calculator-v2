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
        Complete Solution
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse show" aria-labelledby="headingTwo" data-bs-parent="#helperAccordion">
      <div class="accordion-body text-start">
        <template v-for="(line, index) in printSolution">
          <p 
            v-if="line.includes('iter') || (!line.includes('Please') && index === printSolution.length - 1)" 
            :key="index.uuid" 
            class="lead fw-bold"
          >
          {{line}}
          </p>
          <p v-else :key="index.uuid">{{line}}</p>
        </template>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { uuid } from 'vue-uuid';
import nerdamer from 'nerdamer';

export default {
  name: 'SolutionAccordion',
  props: {
    solution: Array,
    answer: String
  },
  data () {
    return {
      uuid: uuid.v4()
    }
  },
  computed: {
    printSolution () {
      if (this.solution.length === 0) return ['Please click "solve" to start displaying the solution'];
      else return this.solution;
    },
    printAnswer () {
      if (this.answer === '') return 'Please click "solve" to start displaying the answer';
      else return this.answer;
    }
  },
  mounted () {
    //let ans = nerdamer.expand('(x-1)^5');
    //console.log(ans.text());
    //Derivative of x^2
    let result = nerdamer('diff(x^2,x)').evaluate();
    console.log(result.text());
    //Build a new function
    let f = result.buildFunction();
    //Evalute f'(3)
    console.log(f(3).toString());
  }
}
</script>

<style lang="scss" scoped>
.accordion {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  border: 2px solid #c3cfd9;
}

.accordion-item {
  background-color: #fefffe;
}

.accordion-button {
  background-color: #f7f8fb;
  color: black;

  &:nth-child(1) {
    border-bottom: 2px solid #c3cfd9;
  }
}
</style>
