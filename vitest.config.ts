import {defineConfig} from 'vitest/config';

export default defineConfig({
    test:{
        env:'jsdom',
        globals:true,
        setupFiles:['./src/setupTest.ts']
    }
})
