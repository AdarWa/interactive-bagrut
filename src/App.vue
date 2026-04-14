<template>
  <div id="app">

    <div v-if="!showBagrutViewer || !bagrut" class="p-2 md:p-3">
      <h1 class="text-900">Load Bagrut</h1>
      <FileUpload accept=".xml" upload-label="Load" :customUpload="true" @uploader="loadBagrut" />
    </div>

    <div v-else class="p-2 md:p-3">
      <BagrutViewer :bagrut="bagrut" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import FileUpload, { type FileUploadUploaderEvent } from 'primevue/fileupload';
import BagrutViewer from './components/BagrutViewer.vue';
import { parseBagrut, type Bagrut } from './services/bagrutParser';
import Button from "primevue/button";

export default defineComponent({
  name: 'App',
  components: {
    BagrutViewer,
    FileUpload,
    Button
  },
  setup() {
    const bagrut = ref<Bagrut | null>(null);
    const showBagrutViewer = ref<boolean>(false);

    const loadBagrut = async (event: FileUploadUploaderEvent) => {
      const file = Array.isArray(event.files) ? event.files[0] : event.files;
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const xml = e.target?.result as string;
          if (xml) {
            bagrut.value = parseBagrut(xml);
            showBagrutViewer.value = true;
          }
        };
        reader.readAsText(file);
      }
    };

    return {
      showBagrutViewer,
      bagrut,
      loadBagrut,
    };
  },
});
</script>