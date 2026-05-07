import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --bg-primary: #ffffff;
    --bg-secondary: #f5f5f5;
    --text-primary: #000000;
    --text-secondary: #666666;
    --border-color: #eeeeee;
    --card-bg: #ffffff;
    --card-bg-dark: #f5f5f5;
    --shadow: 0 2px 8px rgba(0,0,0,0.05);
    --header-bg: #ffffff;
    --input-bg: #f5f5f5;
  }

  [data-theme="dark"] {
    --bg-primary: #121212;
    --bg-secondary: #1e1e1e;
    --text-primary: #ffffff;
    --text-secondary: #aaaaaa;
    --border-color: #333333;
    --card-bg: #1e1e1e;
    --card-bg-dark: #2a2a2a;
    --shadow: 0 2px 8px rgba(0,0,0,0.3);
    --header-bg: #1e1e1e;
    --input-bg: #2a2a2a;
  }

  * {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  }

  body {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  }
`;
