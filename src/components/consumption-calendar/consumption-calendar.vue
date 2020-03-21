<template>
  <div>
    <v-sheet tile height="54" color="grey lighten-3" class="d-flex">
      <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-select
        v-model="type"
        :items="types"
        dense
        outlined
        class="ma-2"
        label="type"
      ></v-select>
      <v-select
        v-model="mode"
        :items="modes"
        dense
        outlined
        label="event-overlap-mode"
        class="ma-2"
      ></v-select>
      <v-spacer></v-spacer>
      <v-btn icon class="ma-2" @click="$refs.calendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="value"
        :weekdays="weekday"
        :type="type"
        :events="events"
        :event-overlap-mode="mode"
        :event-overlap-threshold="30"
        :event-color="getEventColor"
        @change="getEvents"
      ></v-calendar>
    </v-sheet>
  </div>
</template>

<script>
import { getAllCaps } from "../../rest/rest.resource";
export default {
  name: "consumtion-calendar",
  data: () => ({
    caps: [],
    type: "month",
    types: ["month", "week", "day", "4day"],
    mode: "stack",
    modes: ["stack", "column"],
    weekday: [1, 2, 3, 4, 5, 6, 0],
    value: "",
    events: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "red",
      "red darken-2",
      "grey darken-1"
    ],
    names: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party"
    ]
  }),
  mounted() {
    this.$root.$on("caps_updated", () => {
      this.getEvents();
    });
  },
  computed: {
    totalMoneySpent() {
      let prices = [];
      this.events.forEach(event => prices.push(event.price));
      return prices.reduce((a, b) => a + b);
    }
  },
  methods: {
    monthlyReport() {
      const relevantDates = this.events
        .map(event => event.start)
        .map(date => date.split(" ")[0].split("-")[1]);

      return relevantDates.map(date => date.split(" ")[0]);
    },
    async getEvents() {
      const capsResponse = await getAllCaps();
      const caps = capsResponse.data;
      this.caps = caps;
      const events = [];
      for (let i = 0; i < caps.length; i++) {
        events.push({
          name: caps[i].name,
          start: this.formatDate(new Date(caps[i].consumedAt), true),
          color: this.generateEventColor(caps[i].alcohol),
          price: caps[i].price
        });
      }

      this.events = events;
    },
    dateHasEntries(date) {
      if (!this.events.length) {
        return false;
      }
      return this.events.filter(event => {
        return event.start.includes(this.parseDate(date));
      }).length;
    },
    parseDate(date) {
      const d = date.split("-");
      const parsedMonth = `${
        d[1].charAt(0) === "0" ? d[1].split("")[1] : d[1]
      }`;
      const parsedDay = `${d[2].charAt(0) === "0" ? d[2].split("")[1] : d[2]}`;
      const parsedDate = `${d[0]}-${parsedMonth}-${parsedDay}`;
      return parsedDate;
    },
    getDayCaps(date) {
      return this.events.filter(event =>
        event.start.includes(this.parseDate(date))
      ).length;
    },
    getDayCosts(date) {
      const caps = this.events.filter(event =>
        event.start.includes(this.parseDate(date))
      );
      return caps.map(cap => cap.price).reduce((a, b) => a + b);
    },
    generateEventColor(alcohol) {
      if (alcohol <= 0.5) {
        return "green";
      }
      if (alcohol <= 4.5) {
        return "orange";
      }
      if (alcohol <= 5.9) {
        return "red";
      }
      if (alcohol >= 6) {
        return "indigo";
      } else {
        return "grey";
      }
    },
    getEventColor(event) {
      return event.color;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    formatDate(a, withTime) {
      return withTime
        ? `${a.getFullYear()}-${a.getMonth() +
            1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
        : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`;
    }
  }
};
</script>
