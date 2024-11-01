import { defineConfig } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  content:{
    filesystem:[
      'src/**/*.{vue,js,ts,jsx,tsx}',
      "../../templates/**/*.{vue,js,ts,jsx,tsx,html}",
    ]
  },
  theme:{
    colors:{
        primary: '#4233cf',
        secondary: '#0F609B',
        accent: '#F59E0B',
        background: '#F9F9F9',
        "base-text":"#333",
        
    }
  },
  shortcuts:{
    "title-1":"font-bold text-2xl mb-1",
    "title-2":"font-bold text-xl mb-0",
    "title-3":"font-bold text-lg mb-0",
    "btn":"cursor-pointer transition duration-300 ease-in-out hover:opacity-80 px-2 bg-gray-200 text-gray-800 rounded-1 hover:bg-gray-300 hover:text-gray-900",
    "large-btn":"cursor-pointer transition duration-300 ease-in-out hover:opacity-80 px-4 py-2 bg-gray-200 text-gray-800 rounded-1 hover:bg-gray-300 hover:text-gray-900",
    "link":"cursor-pointer text-base-text hover:text-primary hover:bg-background px-4 py-1 rounded-4px",
    "link_on":"!text-primary",
    "tag":"bg-gray-200 text-gray-800 px-2 py-0 text-10px rounded-2px",
    "tag_primary":"!bg-primary !text-white",
  }
})