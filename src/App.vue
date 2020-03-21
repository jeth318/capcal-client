<template>
  <v-app>
    <v-content style="background-color: lightgrey">
      <div style="padding: 20px; margin: 0;">
        <div style="width: 100%; display: flex; justify-content: center">
          <v-icon large>mdi-glass-wine-bottle</v-icon>
          <v-icon large>mdi-glass-wine</v-icon>
          <v-icon large>mdi-glass-cocktail</v-icon>
          <v-icon large>mdi-glass-mug</v-icon>
          <v-icon large>mdi-beer-outline</v-icon>
        </div>
      </div>
      <div class="text-center ma-2;">
        <v-snackbar
          absolute
          top
          color="purple"
          :timeout="3000"
          v-model="snackbar"
        >
          {{ text }}
          <v-btn color="white" text @click="snackbar = false">Stäng</v-btn>
        </v-snackbar>
      </div>
      <v-row justify="center">
        <v-expansion-panels accordion multiple>
          <beverage-search
            :date="datePicker"
            :time="timePicker"
          ></beverage-search>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <slot>
                <div class="accordion-header-wrapper">
                  <div class="accordion-header-text">
                    <v-icon>mdi-clock</v-icon>
                    <span style="margin-left: 10px">Datum och tidpunkt</span>
                  </div>
                  <div>{{ datePicker }} - {{ timePicker }}</div>
                </div>
              </slot>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row justify="space-around">
                <v-date-picker
                  :max="today"
                  color="green lighten-1"
                  v-model="datePicker"
                  show-current
                  locale="sv"
                  type="date"
                ></v-date-picker>
              </v-row>
              <v-row justify="center">
                <v-time-picker
                  :max="maxTime"
                  format="24hr"
                  locale="sv"
                  color="green lighten-1"
                  v-model="timePicker"
                ></v-time-picker>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel :open="true">
            <v-expansion-panel-header>
              <slot>
                <div class="accordion-header-wrapper">
                  <div class="accordion-header-text">
                    <v-icon>mdi-calendar</v-icon>
                    <span style="margin-left: 10px">Konsumtionskalender</span>
                  </div>
                </div>
              </slot>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row justify="center">
                <consumption-calendar></consumption-calendar>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-content>
  </v-app>
</template>

<script>
import BeverageSearch from "./components/beverage-search/beverage-search.vue";
import ConsumptionCalendar from "./components/consumption-calendar/consumption-calendar.vue";
import moment from "moment";

export default {
  name: "App",
  components: { BeverageSearch, ConsumptionCalendar },
  data: () => ({
    snackbar: false,
    text:
      "Ditt fyllo! Intaget har sparats och finns nu synligt i konsumtionskalendern.",
    timePicker: moment().format("hh:mm"),
    datePicker: moment().format("YYYY-MM-DD"),
    today: moment().format("YYYY-MM-DD"),
    todayTime: moment().format("hh:mm"),
    maxTime: moment().format("hh:mm")
  }),
  mounted() {
    setInterval(() => {
      this.today = moment().format("YYYY-MM-DD");
    }, 1000 * 60);
    this.$root.$on("caps_updated", () => {
      this.snackbar = true;
    });
  },
  methods: {
    onDatePickerChange() {
      if (this.datePicker === this.today) {
        this.maxTime = this.todayTime;
        const timePickerMs = new Date(
          this.today.split("T")[0] + "T" + this.timePicker
        ).getTime();
        const todayTimeMs = new Date(
          this.today.split("T")[0] + "T" + moment().format("hh:mm:ss")
        ).getTime();

        if (timePickerMs > todayTimeMs) {
          this.timePicker = moment().format("hh:mm");
        }
      } else {
        this.maxTime = undefined;
      }
    }
  },
  watch: {
    datePicker: "onDatePickerChange"
  }
};
</script>
<style lang="css">
.accordion-header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.accordion-header-text:first-child {
  margin-right: 10px;
}

.row {
  margin: 0;
}
</style>
