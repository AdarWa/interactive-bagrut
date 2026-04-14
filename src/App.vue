<template>
  <div id="app">
    <div v-if="!bagrut">
      <h1>Load Bagrut</h1>
      <FileUpload accept=".xml" :auto="true" :customUpload="true" @uploader="loadBagrut" />
    </div>
    <div v-else>
      <BagrutViewer :bagrut="bagrut" />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from 'vue';
import FileUpload, {type FileUploadUploaderEvent } from 'primevue/fileupload';
import BagrutViewer from './components/BagrutViewer.vue';
import { parseBagrut, type Bagrut } from './services/bagrutParser';

export default defineComponent({
  name: 'App',
  components: {
    BagrutViewer,
    FileUpload,
  },
  setup() {
    const bagrut = ref<Bagrut | null>(null);

    const loadBagrut = async (event: FileUploadUploaderEvent) => {
      const file = Array.isArray(event.files) ? event.files[0] : event.files;
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const xml = e.target?.result as string;
          if (xml) {
            bagrut.value = parseBagrut(xml);
          }
        };
        reader.readAsText(file);
      }
    };

    return {
      bagrut,
      loadBagrut,
    };
  },
});
</script>
