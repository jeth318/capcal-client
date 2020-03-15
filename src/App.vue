<template>
  <v-app>
    <v-content>
      <v-row justify="center">
        <v-expansion-panels accordion multiple>
          <beverage-search></beverage-search>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <span class="accordion-header">
                <div>📅 Datum</div>
                <div>{{ datePicker }}</div>
              </span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row justify="space-around">
                <v-date-picker
                  color="green lighten-1"
                  v-model="datePicker"
                  show-current
                  locale="sv"
                  type="date"
                  :events="enableEvents ? functionEvents : null"
                ></v-date-picker>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <span class="accordion-header">
                🕐 Tidpunkt
                <div>{{ timePicker }}</div>
              </span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row justify="center">
                <v-time-picker
                  format="24hr"
                  locale="sv"
                  color="green lighten-1"
                  v-model="timePicker"
                ></v-time-picker>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-content>
  </v-app>
</template>

<script>
import BeverageSearch from "./components/BeverageSerach/BeverageSearch.vue";
export default {
  name: "App",
  components: { BeverageSearch },
  data: () => ({
    timePicker: `${new Date().getHours()}:${new Date().getMinutes()}`,
    datePicker: new Date().toJSON().split("T")[0]
  })
};
</script>
<style lang="css">
.accordion-header {
  display: flex;
  justify-content: space-between;
}
.row {
  margin: 0;
}
</style>
