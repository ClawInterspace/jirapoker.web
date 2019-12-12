<template>
  <div class="container-fluid content-wrapper">
    <br><br><br>
    <div class="container-fluid search-result-content">
      <div id=list-group class="list-group">
        <div id="estimation-" v-show="isShowEstimationSelectList" style="position:fixed;top:5%;transform: translateY(200%);z-index: 999">
          <div class="estimation-sub-title">
          Estimation
          </div>
          <select id="inputState" class="form-control" v-model="currentIssue.estimatedStoryPoint" @change="setIssueIsEstimated(currentIssue); insertIssueEstimationResult(currentIssue.issueKey, user.userName, currentIssue.estimatedStoryPoint)">
            <option v-for="storyPoint in storyPoints" :key="storyPoint" :value="storyPoint">{{ storyPoint }}</option>
          </select>
        </div>
        <div>
          {{currentIssue.estimationResults}}
        </div>
        <div v-for="sprint in sprints" :key="sprint.sprintName">
          <div class="content-title">
            {{ sprint.sprintName}}&emsp;<span class="badge badge-secondary">{{ sprint.issues.length }}&nbsp;issues</span>
          </div>
          <div v-for="issue in sprint.issues" :key="issue.issueKey">
            <button type="button" class="list-group-item list-group-item-action" v-if="issue.sprintName === sprint.sprintName" @click="setCurrentIssue(issue); isShowEstimationSelectList = true; isShowIssueDetail = true;">
              <a class="nav-item" :href="issue.url">{{ issue.issueKey }}</a>&emsp;{{ issue.summary}}&emsp;<span class="badge badge-success" v-show="issue.isEstimated">Estimated</span><span class="badge badge-primary badge-pill">{{ issue.storyPoint }}</span>
            </button>
          </div>
          <br><br>
        </div>   
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Issue, Sprint, EstimationResult } from '@/classes/apiModel';
import { JiraPokerService } from '@/services';
import { UserProfile } from '../../classes/model';
import { mapGetters, mapMutations } from 'vuex';

export default Vue.extend({
  name: 'JiraPoker', 
  components: {
  },
  data() {
    return {
      isShowEstimationSelectList: false,
      isShowIssueDetail: false,
      sprints: [] as Sprint[],
      storyPoints: ["", 0, 0.5, 1, 2, 3, 5, 8, 13, 21, 34, '?'] as any[],
      currentIssue: new Issue() as Issue,
    };
  },
  computed: {
    ...mapGetters({
      user: 'user',
    }),
  },
  sockets: {
    issueEstimationResults(results: EstimationResult[]) {
      console.log(results);
      console.log('hihihi')
      this.$data.currentIssue.estimationResults = results;
      this.$data.currentIssue = new Issue(this.$data.currentIssue);
    }
  },
  methods: {
    setIssueIsEstimated(issue: Issue) {
      if (issue.estimatedStoryPoint !== "") {
        issue.isEstimated = true
      }
      else {
        issue.isEstimated = false
      }
    },
    setEstimatedStoryPoint(issue: Issue, estimatedStoryPoint: any) {
      issue.estimatedStoryPoint = estimatedStoryPoint;
    },
    insertIssueEstimationResult(issueKey: string, userName: string, estimatedStoryPoint: string) {
      const estimationResult: EstimationResult = {issueKey, userName, estimatedStoryPoint};
      const jiraPokerService = new JiraPokerService();
      jiraPokerService.insertIssueEstimationResult(estimationResult);
    },
    async setSprints() {
      const vm = this;
      const jiraPokerService = new JiraPokerService();
      let sprints: Sprint[] = await jiraPokerService.getIssuesInActiveAndFutureSprints('product & DevOps Infra');
      vm.sprints = sprints;
    },
    async setCurrentIssue(issue: Issue) {
      const vm = this;
      const jiraPokerService = new JiraPokerService();
      issue.estimationResults = await jiraPokerService.getIssueEstimationResults(issue.issueKey);
      vm.currentIssue = issue;
      console.log('123', vm.currentIssue.estimationResults)
    },
  },
  async mounted() {
    
  },

  async created() {
    const vm = this;
    vm.setSprints();
  },
  updated() {
    console.log('update')
  }
});
</script>

<style lang="less" scoped>
  .container-fluid.search-result-content {
    width: 137%;
    .form-control {
      width: 70px;
      font-size: 15px;
    }
    .estimation-sub-title {
      font-size: 15px;
    }
    .list-group-item.list-group-item-action {
      width: 70%;
      font-size: 13px;
      display:block;
        .nav-item {
          color: #828282;
        }        
        .badge.badge-primary.badge-pill {        
          position: absolute;
          right: 2%;
          width: 35px;
          background: #6c757d   
        }
    }
  }
</style>