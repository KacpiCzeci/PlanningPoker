import { defineConfig } from 'orval';

const destPath = (path: string) => 'libs/shared/backend-api-client/src/' + path;
export default defineConfig({
  access: {
    output: {
      mode: 'split',

      target: destPath('backend.ts'),

      schemas: destPath('schemas'),

      client: 'axios-functions',
      override: {
        mutator: {
          path: destPath("custom-instance.ts"),
          name: 'customInstance',
        },
      },
    },

    input: {
      target: 'http://localhost:3333/api-doc-json',
    },
  },
});
