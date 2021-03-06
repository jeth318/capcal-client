<template>
  <v-card color="green lighten-0" width="100%" dark>
    <v-card-text>
      <v-autocomplete
        v-model="model"
        scrollable
        full-width
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        color="white"
        hide-no-data
        hide-selected
        item-text="Description"
        item-value="API"
        label="Sök systembolagets sortiment"
        placeholder="Börja skriva för att söka"
        prepend-icon="mdi-database-search"
        return-object
      >
        <template v-slot:item="data">
          <template>
            <v-list-item-content>
              <div style="display: flex; align-items: center;">
                <div>
                  <v-list-item-title
                    >{{ data.item.namn }} ({{
                      data.item.alkoholhalt
                    }}%)</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    {{ data.item.namn2 }}
                    {{ data.item.typ }}</v-list-item-subtitle
                  >
                  <v-list-item-subtitle
                    >{{ data.item.volymiml / 1000 }} L</v-list-item-subtitle
                  >
                </div>
              </div>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>
    </v-card-text>
    <v-divider></v-divider>
    <v-expand-transition>
      <div v-if="model" style="overflow: hidden;">
        <div style="display: flex; position: relative">
          <div style="width: 50%; height: 375px; width: 50%;">
            <v-list height="375" class="green darken-2" style="font-size: 20px">
              <v-list-item v-for="(field, i) in fields" :key="i">
                <v-list-item-content>
                  <v-list-item-subtitle
                    v-text="field.key"
                  ></v-list-item-subtitle>
                  <v-list-item-title v-text="field.value"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
          <div style="width: 50%; height: 375px; background-color: white;">
            <img
              class="product-image"
              :class="{ 'product-image-visible': productImage }"
              :src="productImage"
            />
          </div>
        </div>
      </div>
    </v-expand-transition>
    <v-card-actions>
      <v-spacer fluid></v-spacer>
      <div style="width: 100%;">
        <v-btn
          :disabled="!model"
          dark
          fab
          color="pink"
          @click="increaseCount"
          height="40px"
          width="40px"
          style="margin-right: 5px;"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn
          :disabled="!model || this.count === 1"
          dark
          fab
          color="blue"
          @click="decreaseCount"
          height="40px"
          width="40px"
        >
          <v-icon>mdi-minus</v-icon>
        </v-btn>
      </div>
      <v-btn :disabled="!model" color="grey darken-3" @click="addBeverage">
        Lägg till {{ count }}
        <v-icon>mdi-add-circle</v-icon>
      </v-btn>
      <v-btn :disabled="!model" color="grey darken-3" @click="model = null">
        Rensa
        <v-icon right>mdi-close-circle</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { fetchProductImage, performSearch } from "../../rest/systembolaget.resource.js";
import { addBeveragesToDb } from "../../rest/rest.resource.js";

const iconMap = {
  Öl: {
    Flaska: "mdi-bottle-vine",
    Magnum: "mdi-glass-mug",
    "PET-flaska": "mdi-glass-mug",
    Burk: "mdi-glass-mug"
  },
  "Rött vin": {},
  "Vitt vin": {},
  Punsch: {}
};

export default {
  props: {
    date: { type: String, required: true },
    time: { type: String, required: true }
  },
  data: () => ({
    descriptionLimit: 60,
    entries: [],
    isLoading: false,
    model: null,
    productImage: "",
    count: 1,
    search: null
  }),
  methods: {
    getIcon(item) {
      return iconMap[item.varugrupp]
        ? iconMap[item.varugrupp][item.forpackning] || "mdi-glass-mug"
        : "mdi-glass-mug";
    },
    addBeverage() {
      const { namn, namn2, prisinklmoms, alkoholhalt, artikelid } =
        this.model || {};

      const prettyModel = {
        count: this.count,
        name: namn + " " + namn2,
        alcohol: parseInt(alkoholhalt),
        price: parseInt(prisinklmoms),
        productId: artikelid,
        consumedAt: this.parsedDate
      };
      addBeveragesToDb(prettyModel);
      this.model = null;
      this.productImage = null;
      this.count = 1;
      this.$root.$emit("caps_updated");
    },
    increaseCount() {
      this.count = this.count + 1;
    },
    decreaseCount() {
      this.count = this.count >= 1 ? this.count - 1 : 0;
    },
    async onModelChange() {
      if (!this.model) {
        return null;
      }
      const response = await fetchProductImage(this.model.id);
      this.productImage = response.data.imageUrl;
    }
  },
  computed: {
    parsedDate() {
      let dateString = this.date + "T";
      dateString +=
        this.time.split(":")[0].length === 1 ? `0${this.time}` : this.time;
      return new Date(dateString);
    },
    fields() {
      if (!this.model) return [];
      const {
        namn,
        namn2,
        prisinklmoms,
        volymiml,
        forpackning,
        alkoholhalt
      } = this.model;

      const prettyModel = {
        Dryck: namn + " " + namn2,
        Alkoholhalt: alkoholhalt + " %",
        Pris: prisinklmoms + ":-",
        Volym: volymiml / 1000 + " l",
        Förpackning: forpackning
      };

      return Object.keys(prettyModel)
        .map(key => {
          return {
            key,
            value: prettyModel[key]
          };
        })
        .filter(entry => !!entry.value);
    },
    items() {
      return this.entries
        .map(entry => {
          let Description =
            entry.namn.length > this.descriptionLimit
              ? entry.namn.slice(0, this.descriptionLimit) + "..."
              : entry.namn;

          return Object.assign({}, entry, { Description });
        })
        .filter(entry => entry.forpackning !== "Fat");
    }
  },

  watch: {
    model: "onModelChange",
    async search(val) {
      // Items have already been loaded
      //if (this.items.length > 0) return;
      if (!val) return;
      // Items have already been requested
      if (this.isLoading) return;

      if (val.length < 3) return;

      this.isLoading = true;
      try {
        const response = await performSearch(val);
        this.entries = response.data;
        this.isLoading = false;
      } catch (error) {
        // console.error("ERROR!:", error);
      }
    }
  }
};
</script>

<style>
.product-image {
  height: 375px;
  padding: 15px;
  display: block;
  position: absolute;
  top: 0px;
  left: 3000px;
}

.product-image-visible {
  left: 50%;
  transition: all 1000ms cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>
